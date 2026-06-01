<template>
  <div
    ref="rangeInputEle"
    class="d-date-editor d-range-editor"
    :class="{ isActive: isActive, disabled: disabled }"
    tabindex="0"
  >
    <input
      ref="startInputEle"
      type="text"
      autocomplete="off"
      :placeholder="placeholder[0]"
      name=""
      class="d-range-input"
      :class="{ focus: focusItem === 'start' }"
      v-model="startDate_"
      @focus="handleFocusStartInput('start')"
      @input="inputChangeStart"
      @blur="onblur"
    />
    <span class="d-range-separator">-</span>
    <input
      ref="endInputEle"
      type="text"
      autocomplete="off"
      :placeholder="placeholder[1]"
      name=""
      class="d-range-input"
      :class="{ focus: focusItem === 'end' }"
      v-model="endDate_"
      @focus="handleFocusStartInput('end')"
      @input="inputChangeEnd"
      @blur="onblur"
    />
    <div class="icon-wrapper">
      <svg-icon
        name="close"
        class="clear-icon"
        v-show="showClose"
        @mouseleave.stop="showClose = false"
        @mousedown.stop="clearInput"
      ></svg-icon>
      <svg-icon
        name="calendar"
        class="calendar-icon"
        v-show="!showClose"
        @mouseenter="onmouseover"
      ></svg-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);
const props = defineProps({
  startDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
  showTime: {
    type: Boolean,
    default: false,
  },
  format: {
    type: String,
    default: "YYYY-MM-DD HH:mm:ss",
  },
  placeholder: {
    type: Array,
    default: () => ["开始时间", "结束时间"],
  },
  focusItem: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const startDate_ = ref(props.startDate);
const endDate_ = ref(props.endDate);

const startInputEle = ref(null);
const endInputEle = ref(null);

const showClose = ref(false);

function onmouseover() {
  if (startDate_.value && endDate_.value) showClose.value = true;
}

watch(
  () => props.startDate,
  (val) => {
    startDate_.value = val;
  }
);
watch(
  () => props.endDate,
  (val) => {
    endDate_.value = val;
  }
);
const emits = defineEmits([
  "submit",
  "focus",
  "blur",
  "dateClear",
  "inputChangeStart",
  "inputChangeEnd",
]);

const isActive = ref(false);

function handleFocusStartInput(position) {
  emits("focus", position);
  isActive.value = true;
}

function inputChangeStart() {
  let format = props.format;
  const dateS = dayjs(startDate_.value, format, "es", true);

  let isStartVaild = dateS.isValid();

  if (!isStartVaild) {
    // console.log(startDate_.value, "开始日期输入非法");
    return;
  } else {
    startDate_.value = dateS.format(format);
    emits("inputChangeStart", startDate_.value);
  }
}

function inputChangeEnd() {
  let format = props.format;
  const dateE = dayjs(endDate_.value, format, "es", true);
  let isEndVaild = dateE.isValid();
  if (!isEndVaild) {
    // console.log(endDate_.value, "结束日期输入非法");
    return;
  } else {
    endDate_.value = dateE.format(format);
    emits("inputChangeEnd", endDate_.value);
  }
}

function clearInput() {
  startDate_.value = "";
  endDate_.value = "";
  emits("dateClear");
  emits("blur");
}

function focus(position) {
  if (position === "start") {
    startInputEle.value.focus();
  } else {
    endInputEle.value.focus();
  }
}

function onblur() {
  endDate_.value = props.endDate;
  startDate_.value = props.startDate;
  isActive.value = false;
}

function blur() {
  startInputEle.value.blur();
  endInputEle.value.blur();
  isActive.value = false;
}

defineExpose({
  focus,
  blur,
});
</script>

<style lang="scss" scoped>
.d-date-editor {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 4px 11px 4px;
  color: var(--color-text);
  font-size: 14px;
  line-height: 1;
  height: 34px;
  list-style: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  transition: border 0.2s, box-shadow 0.2s;
  &.isActive {
    border-color: var(--color-text-active);
  }
  &.disabled {
    background-color: var(--color-background-disabled);
    border-color: var(--color-text-disabled);
    cursor: not-allowed;
    pointer-events: none;
    .icon-wrapper {
      > span {
        cursor: auto;
        pointer-events: none;
        color: var(--color-text-disabled);
      }
    }
  }
  > input {
    position: relative;
    display: inline-block;
    width: 45%;
    min-width: 1px;
    padding: 0 6px;
    color: var(--color-text);
    font-size: 14px;
    background-color: transparent;
    background-image: none;
    transition: all 0.2s;
    border: 0;
    appearance: none;
    outline: none;
    &:focus {
      background-color: var(--color-background-hover);
    }
    &.focus {
      background-color: var(--color-background-hover);
    }
    &::placeholder {
      font-size: 13px;
    }
  }
  > input {
    position: relative;
    display: inline-block;
    width: 45%;
    min-width: 1px;
    padding: 0 6px;
    color: var(--color-text);
    font-size: 14px;
    background-color: transparent;
    background-image: none;
    transition: all 0.2s;
    border: 0;
    appearance: none;
    outline: none;
    &:focus {
      background-color: var(--color-background-hover);
    }
    &.focus {
      background-color: var(--color-background-hover);
    }
    &::placeholder {
      font-size: 13px;
    }
  }
  .d-range-separator {
    display: inline-block;
    padding: 0 8px;
    width: 5%;
  }
  .icon-wrapper {
    width: 25px;
  }
  .clear-icon,
  .calendar-icon {
    cursor: pointer;
    padding: 0 8px;
  }
}
</style>
