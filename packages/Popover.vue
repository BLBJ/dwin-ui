<template>
  <div
    ref="triggerRef"
    class="popover-container"
    v-bind="$attrs"
    @mouseenter="handleTriggerEnter('hover')"
    @mouseleave="handleTriggerLeave"
    @click="handleTriggerEnter('click')"
  >
    <slot></slot>
  </div>

  <Teleport to="body" v-if="isMounted">
    <Transition :name="getTransitionName">
      <div
        v-show="showPanel"
        ref="panelRef"
        class="drop-panel"
        :style="[panelStyle, panelPositionStyle]"
        @mouseenter="handlePanelHover"
        @mouseleave="handlePanelLeave"
      >
        <div
          class="popover-arrow"
          :style="arrowStyle"
          v-show="arrowShow"
        ></div>
        <div class="popover-content" ref="contentRef">
          <div class="popover-title" v-show="title">
            {{ title }}
          </div>
          <slot name="content"></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from "vue";

const props = defineProps({
  placement: {
    type: String,
    default: "top",
    validator: (val) =>
      [
        "top",
        "top-start",
        "top-end",
        "right",
        "right-start",
        "right-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
      ].includes(val),
  },
  zIndex: {
    type: Number,
    default: 9999,
  },
  title: {
    type: [String, Number],
    default: "",
  },
  //是否自动调整方向
  autoAdjustOverflow: {
    type: Boolean,
    default: true,
  },
  trigger: {
    type: String,
    default: "hover",
  },
});

// ========== 新增内容容器Ref：精准获取内容尺寸 ==========

const triggerRef = ref(null);
const panelRef = ref(null);
const contentRef = ref(null); // 新增：指向内容容器，避免面板样式干扰尺寸计算
const showPanel = ref(false);
const isMounted = ref(false);
const currentPlacement = ref(props.placement);
const panelPositionStyle = ref({});
const arrowStyle = ref({});
const arrowShow = ref(true);
const getTransitionName = computed(() => {
  const [mainDir] = currentPlacement.value.split("-");
  switch (mainDir) {
    case "top":
      return "slide-down";
    case "bottom":
      return "slide-up";
    case "left":
      return "slide-right";
    case "right":
      return "slide-left";
    default:
      return "slide-up";
  }
});

const panelStyle = computed(() => ({
  zIndex: props.zIndex,
  position: "absolute"
}));

/**
 * 检测元素是否溢出视口
 */
const checkOverflow = (rect) => {
  const viewport = {
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0,
  };
  return {
    top: rect.top < viewport.top,
    right: rect.right > viewport.right,
    bottom: rect.bottom > viewport.bottom,
    left: rect.left < viewport.left,
    any:
      rect.top < viewport.top ||
      rect.right > viewport.right ||
      rect.bottom > viewport.bottom ||
      rect.left < viewport.left,
  };
};

const getAutoAdjustedPlacement = (preferred, triggerRect, panelRect) => {
  const priorityMap = {
   // 上方向组
    'top': ['top', 'bottom', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'],
    'top-start': ['top-start', 'top-end', 'top', 'bottom-start', 'bottom', 'bottom-end', 'left-start', 'left', 'left-end', 'right-start', 'right', 'right-end'],
    'top-end': ['top-end', 'top-start', 'top', 'bottom-end', 'bottom', 'bottom-start', 'right-start', 'right', 'right-end', 'left-start', 'left', 'left-end'],
    
    // 下方向组
    'bottom': ['bottom', 'top', 'bottom-start', 'bottom-end', 'top-start', 'top-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'],
    'bottom-start': ['bottom-start', 'bottom-end', 'bottom', 'top-start', 'top', 'top-end', 'left-end', 'left', 'left-start', 'right-end', 'right', 'right-start'],
    'bottom-end': ['bottom-end', 'bottom-start', 'bottom', 'top-end', 'top', 'top-start', 'right-end', 'right', 'right-start', 'left-end', 'left', 'left-start'],
    
    // 左方向组
    'left': ['left', 'right', 'left-start', 'left-end', 'right-start', 'right-end', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end'],
    'left-start': ['left-start','right-start', 'left', 'left-end', 'right', 'right-end', 'top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end'],
    'left-end': ['left-end', 'right-end', 'left', 'left-start', 'right', 'right-start', 'bottom-start', 'bottom', 'bottom-end', 'top-start', 'top', 'top-end'],
    
    // 右方向组
    'right': ['right', 'left', 'right-start', 'right-end', 'left-start', 'left-end', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end'],
    'right-start': ['right-start', 'left-start', 'right', 'right-end', 'left', 'left-end', 'top-end', 'top', 'top-start', 'bottom-end', 'bottom', 'bottom-start'],
    'right-end': ['right-end','left-end', 'right', 'right-start', 'left', 'left-start', 'bottom-end', 'bottom', 'bottom-start', 'top-end', 'top', 'top-start']

  };
  for (const placement of priorityMap[preferred]) {
    const testRect = calculatePanelRect(placement, triggerRect, panelRect);
    if (!checkOverflow(testRect).any) return placement;
  }
  return "";
};

//  ========== 基于内容容器精准计算面板尺寸 ==========
const calculatePanelRect = (placement, triggerRect, panelRect) => {
  const [mainDir, subDir] = placement.split("-");
  const offset = 8; // 距离触发元素的偏移量
  const paddingNumber=12;
  const rect = {
    width: panelRect.width,
    height: panelRect.height,
    top: 0,
    left: 0,
  };
  // 计算主方向位置-12为padding值
  switch (mainDir) {
    case "top":
      rect.top = triggerRect.top - panelRect.height -paddingNumber - offset;
      break;
    case "bottom":
      rect.top = triggerRect.bottom + offset;
      break;
    case "left":
      rect.left = triggerRect.left - panelRect.width - paddingNumber - offset;
      break;
    case "right":
      rect.left = triggerRect.right + offset;
      break;
  }

  // 计算子方向偏移（start/end）
  switch (mainDir) {
    case "top":
    case "bottom":
      if (subDir === "start") {
        rect.left = triggerRect.left;
      } else if (subDir === "end") {
        rect.left = triggerRect.right - panelRect.width - paddingNumber;
      } else {
        rect.left =
          triggerRect.left + (triggerRect.width - panelRect.width - paddingNumber) / 2;
      }
      break;
    case "left":
    case "right":
      if (subDir === "start") {
        rect.top = triggerRect.top;
      } else if (subDir === "end") {
        rect.top = triggerRect.bottom - panelRect.height - paddingNumber;
      } else {
        rect.top =
          triggerRect.top + (triggerRect.height - panelRect.height - paddingNumber) / 2;
      }
      
      break;
  }
  // 转换为视口坐标
  rect.right = rect.left + rect.width;
  rect.bottom = rect.top + rect.height;
  return rect;
};

// ========== 箭头适配多行内容的面板高度 ==========
const calcArrowPosition = (
  placement,
  triggerRect,
  panelCalculatedRect,
  contentRect
) => {
  const [mainDir, subDir] = placement.split("-");
  const arrowSize = 8; // 固定箭头大小
  const arrowOffset = 8; //距离边缘偏移量
  const paddingNumber=12;
  const panelHeight = contentRect.height; // 基于内容高度计算箭头
  const style = {
    width: "0",
    height: "0",
    position: "absolute",
    "z-index": 2,
    "pointer-events": "none",
    transform: "rotate(180deg)",
    backgroundColor: "transparent",
  };
  // 1. 箭头边框方向
  switch (mainDir) {
    case "top":
      style.border = `${arrowSize}px solid transparent`;
      style.borderBottomColor = "#000000bf";
      style.bottom = `-${arrowSize * 2 - 1}px`;
      break;
    case "bottom":
      style.border = `${arrowSize}px solid transparent`;
      style.borderTopColor = "#000000bf";
      style.top = `-${arrowSize * 2 - 1}px`;
      break;
    case "left":
      style.border = `${arrowSize}px solid transparent`;
      style.borderRightColor = "#000000bf";
      style.right = `-${arrowSize * 2 - 1}px`;
      break;
    case "right":
      style.border = `${arrowSize}px solid transparent`;
      style.borderLeftColor = "#000000bf";
      style.left = `-${arrowSize * 2 - 1}px`;
      break;
  }

  // 2. 箭头垂直偏移：适配多行内容的面板高度
  switch (mainDir) {
    case "top":
    case "bottom":
      if (subDir === "start") style.left = `${arrowOffset}px`;
      else if (subDir === "end") style.right = `${arrowOffset}px`;
      else style.left = `calc(50% - ${arrowSize}px)`;
      break;
    case "left":
    case "right":
      if (subDir === "start") {
        // left-start：箭头偏移=箭头偏移量（适配内容高度）
        style.top = `${arrowOffset - 4}px`;
      } else if (subDir === "end") {
        // left-end：箭头底部偏移=箭头偏移量（基于内容高度）
        style.bottom = `${arrowOffset-4}px`;
      } else {
        // left：箭头垂直居中（基于内容高度精准计算）
        const arrowTop = panelHeight / 2 - arrowSize;
        style.top = `${arrowTop + paddingNumber/2}px`;
      }
      break;
  }
  arrowStyle.value = style;
};

// ========== 核心优化：确保DOM完全渲染后计算尺寸 ==========
const calcPanelPosition = async () => {
  if (
    !triggerRef.value ||
    !panelRef.value ||
    !contentRef.value ||
    !showPanel.value
  )
    return;
  if (!triggerRef.value.children?.length) return;
  nextTick(() => {
    // 1. 获取精准的DOM尺寸（触发元素+内容容器）
    const triggerRect = triggerRef.value.getBoundingClientRect();
    const contentRect = contentRef.value.getBoundingClientRect(); // 用内容容器尺寸替代面板
    const triggerRectChild =
      triggerRef.value.children[0].getBoundingClientRect();
    const scrollTop = window.scrollY;
    const scrollLeft = window.scrollX;
    contentRect.width = contentRef.value?.offsetWidth;
    contentRect.height = contentRef.value?.offsetHeight;
    // 2. 自动调整方向
    let finalPlacement = props.placement;
    // 自动调整
    let newFinalPlacement = getAutoAdjustedPlacement(
      props.placement,
      triggerRectChild,
      contentRect
    );
    if (newFinalPlacement) {
      finalPlacement = newFinalPlacement;
      arrowShow.value = true;
    } else {
      arrowShow.value = false;
    }
    // 更新当前方向
    currentPlacement.value = finalPlacement;

    // 3. 计算面板位置（基于内容尺寸）
    const panelCalculatedRect = calculatePanelRect(
      finalPlacement,
      triggerRectChild,
      contentRect
    );
    panelPositionStyle.value = {
      top: `${panelCalculatedRect.top + scrollTop}px`,
      left: `${panelCalculatedRect.left + scrollLeft}px`,
      width: "auto",
      height: "auto",
    };
    //某个方向放不下时
    if (!newFinalPlacement) {
      if (panelCalculatedRect.left < 0) {
        panelPositionStyle.value.left = "0px";
        if (panelCalculatedRect.height >= window.innerHeight) {
          panelPositionStyle.value.top = triggerRectChild.bottom + "px";
        } else {
          panelPositionStyle.value.top = "0px";
        }
      }
    }
    // 4. 计算箭头位置（适配内容高度）
    if (props.autoAdjustOverflow && arrowShow.value) {
      calcArrowPosition(
        finalPlacement,
        triggerRectChild,
        panelCalculatedRect,
        contentRect
      );
    }
  });
};

// hover触发：触发元素移入
const hoverTimer = ref(null);
const handleTriggerEnter = (v) => {
  if (v == "hover") {
    if (props.trigger != "hover") return;
  } else if (v == "click") {
    if (props.trigger == "click") {
      if (showPanel.value) {
        showPanel.value = false;
        return;
      }
    } else {
      //focus
      if (showPanel.value) return;
    }
  }
  clearTimeout(hoverTimer.value);
  isMounted.value = true;
  nextTick(() => {
    showPanel.value = true;
    calcPanelPosition();
  });
};
const handleTriggerLeave = () => {
  if (props.trigger != "hover") return;
  hoverTimer.value = setTimeout(() => (showPanel.value = false), 200);
};
//失去焦点
const handleClickOutside = (e) => {
  if (props.trigger == "hover" || !showPanel.value) return;
  if (
    !triggerRef.value.contains(e.target) &&
    !panelRef.value.contains(e.target)
  ) {
    showPanel.value = false;
  }
};
const handlePanelHover = () => {
  if (props.trigger != "hover") return;
  clearTimeout(hoverTimer.value);
  showPanel.value = true;
};
const handlePanelLeave = () => {
  if (props.trigger != "hover") return;
  showPanel.value = false;
};
const handleTriggerClick = () => {
  isMounted.value = true;
  nextTick(() => {
    showPanel.value = !showPanel.value;
    if (showPanel.value) calcPanelPosition();
  });
};
onMounted(() => {
  window.addEventListener("resize", calcPanelPosition);
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("resize", calcPanelPosition);
  document.removeEventListener("click", handleClickOutside);
});
defineExpose({
  calcPanelPosition,
});
</script>

<style lang="scss" scoped>
.popover-container {
  display: inline-block;
  position: relative;
  width: inherit;
  height: auto;
}
.drop-panel {
  background-color: #000;
  border-radius: 4px;
  border-radius: 2px;
  box-sizing: border-box;
  word-wrap: break-word;
  width: auto;
  min-width: 22px;
  padding: 6px;
  margin: 0;
  color: #fff;
  box-shadow: 0 4px 10px 0 rgba(255, 255, 255, 0.1);
  .popover-title{
    margin-bottom: 8px;
    color: var(--color-text);
    font-weight: 600;
    font-size: 14px;
  }
  .popover-content {
    max-width: inherit;
    width: auto;
    word-wrap: break-word;
    white-space: normal;
    line-height: 1.4;
    font-size: 14px;
    color: var(--color-text);
  }
  .popover-arrow {
    background-color: transparent !important;
    margin: 0;
    padding: 0;
  }
}
/* 过渡动画 */
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(8px) scaleY(0.95);
}
.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(8px) scaleY(0.95);
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.95);
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.95);
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(8px) scaleX(0.95);
}
.slide-left-enter-to,
.slide-left-leave-from {
  opacity: 1;
  transform: translateX(0) scaleX(1);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(8px) scaleX(0.95);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-8px) scaleX(0.95);
}
.slide-right-enter-to,
.slide-right-leave-from {
  opacity: 1;
  transform: translateX(0) scaleX(1);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-8px) scaleX(0.95);
}
</style>
