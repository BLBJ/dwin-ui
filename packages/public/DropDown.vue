<template>
  <!-- 下拉面板：组件内控制显隐，基于triggerRef定位 -->
  <Teleport :to="teleport" v-if="isMounted">
    <Transition :name="direction === 'top' ? 'slide-up' : 'slide-down'">
      <div
        v-show="showPanel_"
        ref="panelRef"
        class="drop-panel"
        :style="{
          top: `${panelTop}px`,
          left: `${panelLeft}px`,
          zIndex: zIndex,
        }"
      >
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
// 接收Props：传入triggerRef、触发类型、偏移量、z-index;
const props = defineProps({
  // 父组件传入的触发元素Ref（必传）
  teleport:{
    type: String,
    default: "body",
  },
  triggerRef: {
    type: Object,
  },
  // 面板相对于触发元素的偏移量
  offsetY: {
    type: Number,
    default: 4,
  },
  // 面板z-index（需高于表格其他元素）
  zIndex: {
    type: Number,
    default: 9999,
  },
  showPanel: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["clickOutSide"]);

const showPanel_ = ref(false);

// 面板DOM引用
const panelRef = ref(null);
// 面板定位坐标
const panelTop = ref(0);
const panelLeft = ref(0);
const isMounted = ref(false); //面板第一次渲染

// 计算面板定位（基于triggerRef）
let direction = ref("bottom"); // 面板展开方向
const calcPanelPosition = () => {
  nextTick(() => {
    if (!props.triggerRef || !panelRef.value) return; //面板隐藏时不计算
    // 获取触发元素在视口的位置
    const triggerRect = props.triggerRef.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const panelHeight = panelRef.value.offsetHeight || 300;
    if(props.teleport=='body'){
        // 判断面板展开方向（上/下）
      if (windowHeight - triggerRect.bottom >= panelHeight + props.offsetY) {
        // 下方显示
        direction.value = "bottom";
        panelTop.value = triggerRect.bottom + window.scrollY + props.offsetY;
      } else if (triggerRect.top >= panelHeight + props.offsetY) {
        // 上方显示
        direction.value = "top";
        panelTop.value = triggerRect.top + window.scrollY - panelHeight - props.offsetY;
      } else {
        // 居中（极端情况）
        direction.value = "center";
        panelTop.value = (windowHeight - panelHeight) / 2 + window.scrollY;
      }
    }else{
      //面板位置基于triggerRect，不基于body
      panelTop.value = triggerRect.height;
    }
    const containerRect = panelRef.value?.parentElement.getBoundingClientRect() || {
      left: 0,
    };
    panelLeft.value = triggerRect.left - containerRect.left;
  });
};

// ========== 点击外部关闭（仅click触发） ==========
const handleClickOutside = (e) => {
  if (!props.showPanel) return;
  if (!props.triggerRef.contains(e.target) && !panelRef.value.contains(e.target)) {
    //隐藏
    emits("clickOutSide");
  }
};

onMounted(() => {
  // 监听窗口滚动/resize：更新面板定位
  window.addEventListener("resize", calcPanelPosition);
  // window.addEventListener("scroll", calcPanelPosition);
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", calcPanelPosition);
  // window.removeEventListener("scroll", calcPanelPosition);
});

// 监听showDropDown变化：控制面板显隐
watch(
  () => props.showPanel,
  (newVal) => {
    //第一次渲染面板
    if (!isMounted.value) {
      isMounted.value = true;
      nextTick(() => {
        showPanel_.value = newVal;
        calcPanelPosition();
      });
    } else {
      showPanel_.value = newVal;
      calcPanelPosition();
    }
  }
);
defineExpose({
  calcPanelPosition
});
</script>

<style scoped>
/* 下拉面板 */
.drop-panel {
  position: absolute;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  opacity: 1;
  transform: scaleY(1) translateY(0px);
  transform-origin: left bottom;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: scaleY(0.85) translateY(3px);
  transform-origin: left bottom;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  opacity: 1;
  transform: scaleY(1) translateY(0px);
  transform-origin: left top;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: scaleY(0.85) translateY(-3px);
  transform-origin: left top;
}
</style>
