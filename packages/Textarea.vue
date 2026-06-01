<template>
  <div
    class="d-textarea input"
    :data-error="error"
    :class="{ error: error }"
    :style="{ width: width ? width + 'px' : '100%' }"
  >
    <textarea
      class="paper-textarea"
      :style="{ resize: resize }"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :value="textAreaValue"
      :maxlength="maxlength"
      @input="getTextAreaValue"
    />
    <div class="paper-length-maxlength" v-show="showPrompt">
      <span>{{ lengthText }}</span> / <span>{{ maxlength }}</span>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, nextTick } from "vue";
let props = defineProps({
  placeholder: "",
  maxlength: "",
  error: "",
  rows: "",
  modelValue: "",
  width: "",
  disabled: {
    type: Boolean,
    default: false,
  },
  showPrompt: {
    type: Boolean,
    default: false,
  },
  resize: {
    type: String,
    default: "vertical",
  },
});
let emit = defineEmits(["update:modelValue"]);
let textAreaValue = ref(props.modelValue);
let lengthText = ref(0);
if (props.modelValue && props.modelValue.length) {
  lengthText.value = props.modelValue.length;
}
const getTextAreaValue = (e) => {
  const event = e || globalThis.event;
  const target = event.srcElement || event.taget;
  emit("update:modelValue", target.value);
};
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      textAreaValue.value = val;
      lengthText.value = val.length;
    } else {
      textAreaValue.value = "";
      lengthText.value = 0;
    }
  }
);
</script>

<style lang="scss" scoped>
div.d-textarea {
  width: 100%;
  position: relative;
  height: 32px;
  &.error {
    border: 1px solid var(--color-error);
  }

  &:after {
    content: attr(data-error);
    position: absolute;
    left: 0;
    bottom: -22px;
    z-index: 100;
    color: var(--color-error);
    font-size: 12px;
    width: max-content;
  }
}

.paper-length-maxlength {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 12px;
  color: var(--color-text);
}

.paper-textarea {
  display: inline-block;
  width: 100%;
  background: transparent;
  outline: none;
  color: var(--color-text);
  padding: 5px 10px;
  font-family: inherit;
  box-sizing: border-box;
  min-height: 32px;
  height:32px;
  border: 1px solid var(--color-border);
  border-radius: 2px;
  /** 禁止textarea拉伸 */
  // resize: none;
  resize: vertical;
  &:focus {
    border: 1px solid var(--color-primary);
  }

  /* WebKit, Blink, Edge */
  &::-webkit-input-placeholder {
    color: #909499;
  }

  /* Mozilla Firefox 4 to 18 */
  &:-moz-placeholder {
    color: #909499;
  }

  /* Mozilla Firefox 19+ */
  &::-moz-placeholder {
    color: #909499;
  }

  /* Internet Explorer 10-11 */
  &:-ms-input-placeholder {
    color: #909499;
  }
}
</style>
