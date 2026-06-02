<template>
  <div
    class="d_input"
    :style="{ width: width + 'px' }"
    :data-error="error"
    :class="{ error: error }"
  >
    <input
      :type="type"
      v-model="value_"
      @input="changeValue"
      @change="changeValue"
      @keyup.enter="changeValue"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :disabled="disabled"
      v-bind="$attrs"
      :style="{ paddingRight: isAddIcon ? '36px' : 0 }"
    />
    <!-- <img
      v-show="isAddIcon"
      class="icon"
      src="../../assets/icons/lk_ic_btnsearch_def.svg"
      alt=""
    /> -->
    <svg-icon
      v-if="isAddIcon"
      :name="icon"
      @click="iconClick"
      class="icon"
    ></svg-icon>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";
import SvgIcon from './svgIcon.vue';
let props = defineProps({
  error: "",
  isAddIcon: false,
  type: {
    type: String,
    default: "text",
  },
  width: "",
  modelValue: "",
  placeholder: "",
  maxlength: "",
  disabled: false,
  filter: null,
  icon: "",
});

let emit = defineEmits(["update:modelValue", "input", "iconClick"]);
const value_ = ref(props.modelValue);
const changeValue = (val) => {
  if (props.maxlength) {
    value_.value = value_.value.slice(0, props.maxlength);
  }
  if (props.filter) {
    value_.value = props.filter(value_.value);
  }

  emit("update:modelValue", value_.value);
  emit("input", value_.value);
};

watch(
  () => props.modelValue,
  (val) => {
    value_.value = val;
  }
);

const iconClick = () => {
  emit("iconClick");
};
</script>

<style lang="scss" scoped>
.d_input {
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
