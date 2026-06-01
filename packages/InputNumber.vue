<template>
  <div
    class="rock_input_number"
    :style="{ width: width + 'px' }"
    :data-error="error"
    :class="{ error: error }"
  >
    <input
      :type="type"
      v-model="value_"
      @input="changeValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @blur="rechange"
      v-bind="$attrs"
    />
    <!-- <img
      v-show="isAddIcon"
      class="icon"
      src="../../assets/icons/lk_ic_btnsearch_def.svg"
      alt=""
    /> -->
    <svg-icon v-if="isAddIcon" :name="icon" class="icon"></svg-icon>
    <div class="d-input-number-handler-wrap" v-show="showUpDown">
      <svg-icon
        name="up"
        @click="
          value_++;
          rechange();
        "
      ></svg-icon>
      <svg-icon
        name="down"
        @click="
          value_--;
          rechange();
        "
      ></svg-icon>
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";
import SvgIcon from "./svgIcon.vue";
let props = defineProps({
  error: {
    type: String,
    default: "",
  },
  showUpDown: {
    type: Boolean,
    default: false,
  },
  isAddIcon: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [String, Number],
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  //设置最大值
  max: {
    type: Number,
    default: Infinity,
  },
  //设置最小值
  min: {
    type: Number,
    default: 0,
  },
  //是否取整
  integer: {
    type: Boolean,
    default: false,
  },
  //数值精度 小数点后几位 取整时候此值无效
  precision: {
    type: Number,
  },

  disabled: { type: Boolean, default: false },
  icon: {
    type: String,
    default: "",
  },
});
const type = ref("text");

let emit = defineEmits(["update:modelValue", "input","change"]);
const value_ = ref(props.modelValue);
const changeValue = (event) => {};

const rechange = () => {
  if (!/^-?\d+(.{1}\d+)?$/.test(value_.value)) {
    emit("update:modelValue", "");
    value_.value = "";
    return;
  } else {
    value_.value = Number(value_.value);
  }
  if (value_.value === "") {
    emit("update:modelValue", "");
    value_.value = "";
    return;
  }

  // if (!value_.value.match(/-?\d+\.?(\d+)?/)) {
  //   emit("update:modelValue", "");
  //   value_.value = "";
  //   return;
  // }
  // value_.value = value_.value.match(/-?\d+\.?(\d+)?/)[0];
  if (value_.value > props.max) value_.value = props.max;
  if (value_.value < props.min) value_.value = props.min;
  //取整
  if (props.integer) {
    value_.value = Math.floor(value_.value);
  } else {
    if (props.precision) {
      //toFixed 四舍五入解决精度丢失问题
      value_.value =
      parseFloat(Math.round((value_.value * Math.pow(10, props.precision)).toFixed(props.precision)) /
        Math.pow(10, props.precision));
    }
    if (value_.value === 0) {
      value_.value = 0.0;
    }
    
  }

  emit("update:modelValue", value_.value);
  emit("change", value_.value);
};

watch(
  () => props.modelValue,
  (val) => {
    value_.value = val;
  }
);
</script>

<style lang="scss" scoped>
.rock_input_number {
  position: relative;
  display: inline-block;
  width: 100%;

  input {
    position: relative;
    width: 100%;
    min-width: 100px;
    height: 32px;
    background: var(--color-background);
    outline: none;
    border: none;
    padding-left: 11px;
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: 2px;
    box-sizing: border-box;

    &:focus {
      border: 1px solid var(--color-primary);
    }

    &:disabled {
      background: transparent;
      border: none;
      cursor: no-drop;
    }
  }

  .d-input-number-handler-wrap {
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    width: 22px;
    height: 100%;
    background: transparent;
    border-start-start-radius: 0;
    border-start-end-radius: 2px;
    border-end-end-radius: 2px;
    border-end-start-radius: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    transition: opacity 0.2s linear 0.2s;

    > span {
      font-size: 14px;
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: auto;
      height: 40%;
      overflow: hidden;
      color: var(--color-text);
      font-weight: bold;
      line-height: 0;
      text-align: center;
      cursor: pointer;
      border-inline-start: 1px solid var(--color-border);
      transition: all 0.2s linear;
    }

    > span:nth-child(2) {
      border-block-start: 1px solid var(--color-border);
    }
  }

  &.error {
    border: 1px solid var(--color-error);
  }

  &:after {
    content: attr(data-error);
    position: absolute;
    bottom: -22px;
    left: 0;
    z-index:100;
    color: var(--color-error);
    font-size: 12px;
    width: max-content;
  }

  .icon {
    position: absolute;
    right: 10px;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
    cursor: pointer;
  }
}
</style>
