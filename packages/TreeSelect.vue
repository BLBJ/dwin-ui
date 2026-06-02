<template>
  <div class="d_select" :style="{ width: width + 'px' }" :class="{ disable: disabled, error: error }" :data-error="error">
    <div class="d_label" ref="triggerEle" @click.stop="openDropDown" :class="{ open: showDropDown }">
      <span v-if="mode === 'single'" :class="{ placeholderStyle: labelText === placeholder }">{{ labelText }}</span>
      <div class="multiple_labels" v-if="mode === 'multiple'">
        <span style="margin-right: 8px" v-for="(item, index) in labelText" :key="index" class="label">
          {{ item }}
          <span name="close" @click.stop="closeSelect(item)">x</span>
        </span>
        <span class="placeholderStyle" v-show="!modelValue_.length">{{
          placeholder
        }}</span>
      </div>
      <svg-icon class="down" name="down" v-show="!showDropDown" size="12"></svg-icon>
      <svg-icon class="down" name="up" v-show="showDropDown" size="12"></svg-icon>
    </div>
    <DropDown ref="dropDown" :triggerRef="triggerEle" :showPanel="showDropDown" @clickOutSide="showDropDown = false">
      <div class="s_dropdown" :style="{ width: width + 'px' }" >
        <div class="placeholderStyle" @click="clearSelected">
          {{ placeholder }}
        </div>
        <Tree :tree-data="data" @change="emitSelect" :label-key="labelKey" :value-key="valueKey" :mode="mode"
          ref="treeSelect" @update:expandKeys="expandKeysChange"></Tree>
      </div>
    </DropDown>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from "vue";
import Tree from "./Tree.vue";
import SvgIcon from './svgIcon.vue';
import DropDown from "./public/DropDown.vue";
const triggerEle = ref(null);
let props = defineProps({
  data: {
    type: Array,
  },
  modelValue: {
    type: [String, Array, Number],
  },
  isCascade: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "请选择",
  },
  width: [String, Number],
  mode: {
    type: String,
    default: "single",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: "",
  valueKey: { type: String, default: "value" },
  labelKey: { type: String, default: "title" },
});
let isMult = props.mode === "multiple";
let showDropDown = ref(false);
const treeSelect = ref(null);
//展开-收起时，重新计算面板位置
const dropDown = ref(null);
const expandKeysChange = (keys) => {
  dropDown.value.calcPanelPosition();
};
const getFlatArray = (arrs) => {
  return arrs.reduce((sum, c) => {
    sum.push({ label: c[props.labelKey], value: c[props.valueKey] });
    if (c.children && c.children.length) {
      sum.push(...getFlatArray(c.children));
    }
    return sum;
  }, []);
};

let flatList = ref([]);
flatList.value = getFlatArray(props.data);
// console.log(flatList, "flatList");

let modelValue_ = ref(props.modelValue);
let labelText = computed(() => {
  if (isMult) {
    return flatList.value
      .filter((item) => modelValue_.value.includes(item.value))
      .map((item) => item.label);
  } else {
    let res = flatList.value.find((item) => item.value == modelValue_.value);
    if (res) {
      return res.label;
    } else {
      return props.placeholder;
    }
  }
});
let labelAndValue = ref([]);

let emit = defineEmits(["selectChange", "update:modelValue"]);
const emitSelect = ({ label, value }) => {
  console.log(label, modelValue_.value);
  if (isMult) {
    if (modelValue_.value.includes(value)) {
      modelValue_.value = modelValue_.value.filter((item) => item !== value);
      labelAndValue.value = labelAndValue.value.filter(
        (item) => item.value !== value
      );
    } else {
      modelValue_.value.push(value);
      labelAndValue.value.push({ label, value });
    }
  } else {
    modelValue_.value = value;
    showDropDown.value = false;
  }
  emit("update:modelValue", modelValue_.value);
  emit("selectChange", modelValue_.value);
};
watch(
  () => props.modelValue,
  (val) => {
    modelValue_.value = val;
    nextTick(() => {
      treeSelect.value.reset(isMult ? [...modelValue_.value] : [modelValue_.value]);
    });
  }
);
watch(
  () => props.data,
  () => {
    flatList.value = getFlatArray(props.data);
  }
);
const openDropDown = () => {
  showDropDown.value = !showDropDown.value;
};

const closeSelect = (label) => {
  let val = flatList.value.find((item) => item.label == label).value;
  modelValue_.value = modelValue_.value.filter((item) => item !== val);
  nextTick(() => {
    treeSelect.value.reset([...modelValue_.value]);
  });
  emit("update:modelValue", modelValue_.value);
  emit("selectChange", modelValue_.value);
};

const selectAll = () => {
  if (modelValue_.value < props.data.length) {
    modelValue_.value = props.data.map((item) => item.value);
  } else {
    modelValue_.value = [];
  }
};

const clearSelected = () => {
  if (isMult) {
    modelValue_.value = [];
    labelAndValue.value = [];
  } else {
    modelValue_.value = "";
  }
  showDropDown.value = false;
  treeSelect.value.reset(modelValue_.value);
  emit("update:modelValue", modelValue_.value);
  emit("selectChange", { value: "", label: "" });

};
</script>

<style lang="scss" scoped>
.d_select {
  position: relative;
  cursor: pointer;
  width: 100%;
  min-width: 80px;

  &.disable {
    pointer-events: none;
  }

  &.error {
    border: 1px solid var(--color-error);
  }

  &:after {
    content: attr(data-error);
    position: absolute;
    bottom: -22px;
    left: 0;
     z-index: 100;
    color: var(--color-error);
    font-size: 12px;
    width: max-content;
  }
}

.placeholderStyle {
  color: var(--color-text-ploceholder);
}

.d_label {
  width: 100%;
  min-height: 32px;
  background: var(--color-background);
  color: var(--color-text);
  line-height: 32px;
  padding-left: 10px;
  text-align: left;
  font-size: 14px;
  border: 1px solid var(--color-border);
  border-radius: 2px;

  .placeholderStyle {
    color: var(--color-text-ploceholder);
  }

  input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .down {
    position: absolute;
    right: 10px;
    top: 0;bottom:0;
    margin:auto;
  }

  .multiple_labels {
    >span.label {
      position: relative;
      width: max-content;
      box-sizing: border-box;
      max-width: 100%;
      height: 22px;
      line-height: 22px;
      display: inline-block;
      background: var(--color-background-hover);
      padding: 0 4px;
      color: var(--color-text);
      border-radius: 2px;
      cursor: default;
      font-size: 14px;
    }

    span[name="close"] {
      font-size: 14px;
      cursor: pointer;
      color: var(--color-text);

      &:hover {
        color: var(--color-title);
      }
    }
  }
}

.s_dropdown {
  // position: absolute;
  // top: 100%;
  // left: 0;
  // z-index: 100;
  width: 100%;
  background: var(--color-background);
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  transform: 0.3s;
  padding: 5px 10px;
  border: 1px solid var(--color-border);
  box-shadow: 0px 2px 5px 0px var(--color-border),
    0px 2px 3px 0px var(--color-border);
  font-size: 14px;
  ul {
    margin: 0;
    padding: 10px 0;

    li {
      list-style: none;
      color: var(--color-text);
      text-align: left;
      font-size: 14px;
      line-height: 34px;
      padding-left: 10px;
      cursor: pointer;
      box-sizing: border-box;

      &:hover {
        background: var(--color-background-hover);
        color: var(--color-text-hover);
      }

      &.active {
        background: var(--color-background-active);
        color: var(--color-text-selected);
      }
    }
  }
}
</style>
