<template>
  <label class="d-checkbox-wrap" :class="{disabled}">
    <span class="d-checkbox">
      <input type="checkbox" class="d-checkbox-input" :disabled="disabled" :checked="value_"  @input="change">
      <svg-icon class="checkbox" v-if="value_" name="check"></svg-icon>
      <span class="checkbox noCheck" v-else> </span>
    </span>
    <span class="d-checkbox-text">
      <slot></slot>
    </span>
  </label>
</template>

<script setup>
import { ref, watch } from "vue";
import SvgIcon from '../svgIcon.vue';
let props = defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

let emit = defineEmits(["update:checked", "change", "errorDisabled"]);
let value_ = ref(props.checked);
watch(()=>props.checked, (val) => {
  value_.value = val;
});

const handleClick = (val) => {
  if (props.disabled) {
    emit("errorDisabled");
    return false;
  }
  value_.value = val;
  emit("update:checked", val);
};
function change(event) {
  console.log(event.target.checked);
  const value = event.target.checked;
  value_.value = value;
  handleClick(value);
  emit("change", value);
}
</script>

<style lang="scss" scoped>
.d-checkbox-wrap {
  display: flex;
  align-items: center;

  &.disabled{
    cursor: not-allowed;
    .d-checkbox-text{
      color: grey;
    }
    .checkbox{
      cursor: not-allowed;
    }
  }

  .d-checkbox {
    position: relative;
    input {
      position: absolute;
      inset: 0;
      z-index: 1;
      cursor: pointer;
      opacity: 0;
      margin: 0;
    }
  }
}

.checkbox {
  display: block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  direction: ltr;
  background-color: var(--color-primary);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  border-collapse: separate;
  transition: all 0.3s;
  cursor: pointer;
  color: #fff !important;

  &.noCheck {
    background-color: transparent;
    border-width: 2px;
  }

  >span {
    color: #fff !important;
    line-height: 16px;
  }
}
.d-checkbox-text{
  padding: 0 8px;
}
</style>
