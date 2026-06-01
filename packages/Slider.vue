<template>
  <div
    class="slider-wrapper"
    :style="vertical ? { height: width + 'px' } : { width: width + 'px' }"
  >
    <div
      class="slider-container"
      ref="container"
      :style="{ width: width + 'px' }"
      :data-error="error"
      :class="{ 'slider-vertical': vertical }"
    >
      <div class="slider-track" ref="track" @click.stop="onClickPoint">
        <div class="slider-range" :style="rangeStyle"></div>
        <template v-if="range">
          <ToolTip :placement="vertical?'right':'top'" ref="minThumb" :title="currentValue[0]" style="position: absolute;">
            <div
              class="slider-thumb"
              :style="{ left: minPosition }"
              @mousedown="startDrag('min')"
            >
            </div>
          </ToolTip>
          <ToolTip :placement="vertical?'right':'top'" ref="maxThumb" :title="currentValue[1]" style="position: absolute;">
            <div
            class="slider-thumb"
            :style="{ left: maxPosition }"
            @mousedown="startDrag('max')"
          >
          </div>
          </ToolTip>
        </template>
        <ToolTip v-else :placement="vertical?'right':'top'" ref="thumb" :title="currentValue" style="position: absolute;">
          <div
            class="slider-thumb"
            :style="{ left: thumbPosition }"
            @mousedown="startDrag('single')"
          >
          </div>
        </ToolTip>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import ToolTip from "./ToolTip.vue";
let props = defineProps({
  error: { type: String, default: "" },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  value: { type: [Number, Array], default: 0 },
  range: { type: Boolean, default: false },
  width: { type: Number, default: 200 },
  step: { type: Number, default: 1 },
  vertical: { type: Boolean, default: false }, //为true时为垂直方向false为水平方向
});
let emit = defineEmits(["update:value", "change"]);

const container = ref(null);
const track = ref(null);
const thumb = ref(null);
const minThumb = ref(null);
const maxThumb = ref(null);

const currentValue = ref(
  props.range
    ? Array.isArray(props.value)
      ? [...props.value]
      : [props.min, props.min]
    : typeof props.value === "number"
    ? props.value
    : props.min
);
emit("update:value", currentValue.value);
const dragging = ref(null);
const startX = ref(0);
const startValue = ref(0);

// 计算位置和样式
const thumbPosition = computed(() => {
  const position =
    ((currentValue.value - props.min) / (props.max - props.min)) * 100;
  return `${Math.min(100, Math.max(0, position))}%`;
});

const minPosition = computed(() => {
  const position =
    ((currentValue.value[0] - props.min) / (props.max - props.min)) * 100;
  return `${Math.min(100, Math.max(0, position))}%`;
});

const maxPosition = computed(() => {
  const position =
    ((currentValue.value[1] - props.min) / (props.max - props.min)) * 100;
  return `${Math.min(100, Math.max(0, position))}%`;
});

const rangeStyle = computed(() => {
  if (!props.range)
    return {
      left: "0%",
      width: thumbPosition.value,
    };
  const left = minPosition.value;
  const width = `calc(${maxPosition.value} - ${left})`;
  return { left, width };
});

// 处理拖动逻辑
const startDrag = (type) => {
  dragging.value = type;
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
  document.body.style.userSelect = "none";
};

const handleDrag = (e) => {
  if (!dragging.value) return;

  const trackRect = track.value.getBoundingClientRect();
  let offsetX, percentage;
  if (!props.vertical) {
    offsetX = e.clientX - trackRect.left;
    percentage = Math.min(1, Math.max(0, offsetX / trackRect.width));
  } else {
    offsetX = trackRect.bottom - e.clientY;
    percentage = Math.min(1, Math.max(0, offsetX / trackRect.height));
  }
  const newValue = props.min + percentage * (props.max - props.min);
  const steppedValue = Math.round(newValue / props.step) * props.step;

  if (dragging.value === "single") {
    if (currentValue.value == steppedValue) return;
    currentValue.value = steppedValue;
    emit("update:value", currentValue.value);
    thumb.value.calcPanelPosition();
  } else if (dragging.value === "min") {
    currentValue.value[0] = Math.min(steppedValue, currentValue.value[1]);
    emit("update:value", [...currentValue.value]);
    minThumb.value.calcPanelPosition();
  } else if (dragging.value === "max") {
    currentValue.value[1] = Math.max(steppedValue, currentValue.value[0]);
    emit("update:value", [...currentValue.value]);
    maxThumb.value.calcPanelPosition();
  }
  emit("change", props.range ? [...currentValue.value] : currentValue.value);
};

const stopDrag = () => {
  dragging.value = null;
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.body.style.userSelect = "";
};

const onClickPoint = (e) => {
  const trackRect = track.value.getBoundingClientRect();
  let offsetX, percentage;
  if (!props.vertical) {
    offsetX = e.clientX - trackRect.left;
    percentage = Math.min(1, Math.max(0, offsetX / trackRect.width));
  } else {
    offsetX = trackRect.bottom - e.clientY;
    percentage = Math.min(1, Math.max(0, offsetX / trackRect.height));
  }
  const newValue = props.min + percentage * (props.max - props.min);
  const steppedValue = Math.round(newValue / props.step) * props.step;
  if (props.range) {
    const midPoint = (currentValue.value[0] + currentValue.value[1]) / 2;
    if (steppedValue <= midPoint) {
      currentValue.value[0] = Math.min(steppedValue, currentValue.value[1]);
    } else {
      currentValue.value[1] = Math.max(steppedValue, currentValue.value[0]);
    }
    emit("update:value", [...currentValue.value]);
  } else {
    currentValue.value = steppedValue;
    emit("update:value", currentValue.value);
  }
  if (dragging.value === "single") {
    thumb.value.calcPanelPosition();
  } else if (dragging.value === "min") {
    minThumb.value.calcPanelPosition();
  }else if (dragging.value === "max") {
    maxThumb.value.calcPanelPosition();
  }
  emit("change", props.range ? [...currentValue.value] : currentValue.value);
};

// 响应式更新
onMounted(() => {
  if (props.range && !Array.isArray(props.value)) {
    currentValue.value = [props.min, props.max];
    emit("update:value", currentValue.value);
  }
});
watch(
  () => props.value,
  (val) => {
    currentValue.value = props.range
      ? Array.isArray(props.value)
        ? [...props.value]
        : [props.min, props.min]
      : typeof props.value === "number"
      ? props.value
      : props.min;
    // emit("update:value", currentValue.value);
  }
);
onUnmounted(() => {
  stopDrag();
});
</script>
<style scoped lang="scss">
.slider-wrapper {
  display: inline-block;
}
.slider-container {
  width: 100%;
  box-sizing: border-box;
  display: inline-block;
  &:after {
    content: attr(data-error);
    position: absolute;
    top: 10px;
    left: 2px;
    z-index: 100;
    color: var(--color-error);
    font-size: 12px;
    word-break: break-all;
  }
  &.slider-vertical {
    transform: rotate(270deg);
    width: 4px;
    height: 100%;
    position: relative;
    left: 0;
    top: 0;
  }
}
.slider-track {
  position: relative;
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
  width: 100%;
  transition: background-color 0.3s;
}
.slider-track:hover {
  background-color: #e1e1e1;
}
.slider-range {
  position: absolute;
  height: 100%;
  background-color: #91d5ff;
  border-radius: 2px;
}

.slider-thumb {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #fff;
  border: 2px solid #91d5ff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 2;
  transition: transform 0.1s;
  top:2px;
}
.slider-thumb:active {
  cursor: grabbing;
  width: 14px;
  height: 14px;
  border: 2px solid #1677ff;
}
</style>