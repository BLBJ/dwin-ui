<template>
  <div
    class="d-panel-container"
    ref="panelRef"
    @mouseenter="onPanelMouseEnter"
    @mouseleave="onPanelMouseLeave"
    :style="{ width: width + 'px' }"
  >
    <slot name="picker"></slot>
  </div>
  <Teleport to="body">
    <Transition :name="direction === 'top' ? 'slide-up' : 'slide-down'">
      <div
        class="d-panel"
        ref="pickerPanelRef"
        @mouseenter="onPanelMouseEnter"
        @mouseleave="onPanelMouseLeave"
        v-show="showPicker"
        :style="panelStyle"
        v-if="isMounted"
      >
        <slot name="dropdown"></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { nextTick, ref, onMounted, onUnmounted } from "vue";
const props = defineProps({
  width: {
    type: [String, Number],
    default: "",
  },
});

// watch(
//   () => showPanel.value,
//   (value) => {
//     if (value) {
//       onFocus();
//     }
//   }
// );

const emits = defineEmits(["panelHide", "load"]);

const isMounted = ref(false);
const showPicker = ref(true);
const panelStyle = ref({});

const panelRef = ref(null);
const pickerPanelRef = ref(null);
// 忽略外部点击
let ignoreExternalClick = false;

const showPickerPanel = async () => {
  // 第一次显示时，先激活 v-if
  if (!isMounted.value) {
    isMounted.value = true;
    await nextTick(); // 等待 DOM 渲染
  }
  showPicker.value = true;
  setTimeout(() => {
    positionPanel();
    emits("load");
  }, 200);
};

// 隐藏面板
const hidePicker = () => {
  showPicker.value = false;
  emits("panelHide");
};

const onFocus = () => {
  ignoreExternalClick = true;
  showPickerPanel();
};

// 失去焦点时关闭（除非将要聚焦到面板）
const onBlur = () => {
  if (ignoreExternalClick) return;
  // 延迟关闭，等待面板是否被聚焦
  setTimeout(() => {
    if (!ignoreExternalClick && !showPicker.value) return;
    const active = document.activeElement;
    const inPanel = pickerPanelRef.value && pickerPanelRef.value.contains(active);
    const inInput = panelRef.value && panelRef.value.contains(active);

    if (!inPanel && !inInput) {
      hidePicker();
    }
  }, 0);
};

let direction = ref("bottom");
const positionPanel = () => {
  if (!panelRef.value || !pickerPanelRef.value) return;
  const inputRect = panelRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const panelHeight = pickerPanelRef.value.offsetHeight || 300;
  const PADDING = 4;
  let top;
  if (windowHeight - inputRect.bottom >= panelHeight + PADDING) {
    // 下方显示
    top = inputRect.bottom + window.scrollY + PADDING;
    direction.value = "bottom";
  } else if (inputRect.top >= panelHeight + PADDING) {
    // 上方显示
    top = inputRect.top + window.scrollY - panelHeight - PADDING;
    direction.value = "top";
  } else {
    // 居中（极端情况）
    top = (windowHeight - panelHeight) / 2 + window.scrollY;
    direction.value = "center";
  }
  panelStyle.value = {
    left: `${inputRect.left + window.pageXOffset}px`,
    top: `${top}px`,
  };
};

// 面板鼠标进入/离开
const onPanelMouseEnter = () => {
  ignoreExternalClick = true;
};
const onPanelMouseLeave = () => {
  ignoreExternalClick = false;
};

const handleClickOutside = (event) => {
  if (ignoreExternalClick) return;
  if (!panelRef.value || !pickerPanelRef.value) return;
  //点击到不是rangeInput和pickerPanel的元素，隐藏pickerPanel
  if (
    !panelRef.value.contains(event.target) &&
    !pickerPanelRef.value.contains(event.target)
  ) {
    hidePicker();
  }
};

const addEvent = () => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", positionPanel);
};
const removeEvent = () => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", positionPanel);
};

onMounted(() => {
  addEvent();
});
onUnmounted(() => {
  removeEvent();
});

defineExpose({
  onBlur,
  onFocus,
  hidePicker,
});
</script>

<style lang="scss" scoped>
.d-panel-container {
  position: relative;
  width: 100%;
}
.d-panel {
  position: absolute;
  left: -9999px;
  top: -9999px;
  z-index: 9999;
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
