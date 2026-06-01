<template>
  <div
    class="rock_select"
    :style="{ width: width + 'px' }"
    :class="{ error: error }"
    :data-error="error"
    tabindex="0"
    @focus="() => {}"
    @blur="onBlur"
    @mousedown="focusSearch"
  >
    <div v-if="disabled" class="disable"></div>
    <div
      class="rock_label"
      ref="triggerEle"
      :class="{
        open: showDropDown,
        active: isSelectActive,
        search: showSearch,
      }"
    >
      <span
        v-if="mode === 'single' && !inputText"
        :class="{ placeholderStyle: isEmpty(modelValue_) }"
        >{{ labelText }}
      </span>
      <div class="multiple_labels" v-if="mode === 'multiple'">
        <template v-if="labelText.length">
          <div
            style="margin-right: 8px"
            v-for="(item, index) in labelText"
            :key="index"
            class="label"
          >
            {{ item?.trim() || "--" }}
            <span name="close" @mousedown.prevent.stop="closeSelect(item, index)"
              ><svg-icon name="close" size="12"></svg-icon>
            </span>
          </div>
        </template>
        <span v-show="!labelText.length && !inputText" class="mult_placeholder">{{
          placeholder
        }}</span>
        <div class="mult_input_wrap">
          <span>{{ inputText }}</span>
          <input
            class="mult_input"
            v-if="showSearch && mode === 'multiple'"
            ref="input"
            v-model="inputText"
            type="text"
            @input="search"
            @blur="onBlur"
            @focus="isSelectActive = true"
            @compositionstart="compositionstart = true"
            @compositionend="
              compositionstart = false;
              search($event);
            "
            @keyup.delete="keyDelete"
          />
        </div>
      </div>

      <svg-icon class="down" name="down" v-show="!showDropDown" size="12"></svg-icon>
      <svg-icon class="down" name="up" v-show="showDropDown" size="12"></svg-icon>
      <input
        v-if="showSearch && mode === 'single'"
        class="single_input"
        ref="input"
        v-model="inputText"
        type="text"
        @input="search"
        @blur="onBlur"
        @focus="isSelectActive = true"
        @compositionstart="compositionstart = true"
        @compositionend="
          compositionstart = false;
          search($event);
        "
      />
    </div>
    <DropDown :triggerRef="triggerEle" :showPanel="showDropDown">
      <div class="s_dropdown" :style="{ width: width + 'px' }">
        <div class="s_dropdown1">
          <ul>
            <li v-show="!dataList.length" @mousedown.prevent="selectDefault">
              <span>暂无数据</span>
            </li>
            <li
              v-show="dataList.length && !isHidePlaceholder"
              @mousedown.prevent="emitSelectAll()"
            >
              <span class="placeholderStyle">{{ placeholder }}</span>
            </li>
            <template v-if="isOptionGroup">
              <li v-for="(item, index) in dataList" :key="index" class="group">
                <span @mousedown.prevent.stop="item.open = !item.open">
                  <svg-icon v-show="!item.open" name="caret-right"></svg-icon>
                  <svg-icon v-show="item.open" name="caret-down"></svg-icon>
                  {{ item.label }}</span
                >
                <ul v-show="item.open">
                  <li
                    v-for="(child, index) in item.options"
                    :key="index"
                    :class="{
                      active:
                        mode === 'multiple'
                          ? modelValue_.includes(child.value)
                          : modelValue_ === child.value,
                      disabledli: disabledRow(child),
                    }"
                  >
                    <span @mousedown.prevent="emitSelect(child)">
                      {{
                        selectLabelFn ? selectLabelFn(child) : child.label?.trim() || "--"
                      }}
                      <svg-icon
                        class="li_icon"
                        v-show="mode === 'single' && modelValue_ === child.value"
                        name="check"
                      ></svg-icon>
                      <svg-icon
                        class="li_icon"
                        v-show="mode === 'multiple' && modelValue_.includes(child.value)"
                        name="check"
                      ></svg-icon>
                    </span>
                  </li>
                </ul>
              </li>
            </template>
            <template v-else>
              <li
                v-for="(item, index) in dataList"
                :key="index"
                :class="{
                  active:
                    mode === 'multiple'
                      ? modelValue_.includes(item.value)
                      : modelValue_ === item.value,
                  disabledli: disabledRow(item),
                }"
              >
                <span @mousedown.prevent="emitSelect(item)">
                  {{ selectLabelFn ? selectLabelFn(item) : item.label?.trim() || "--" }}
                  <svg-icon
                    class="li_icon"
                    v-show="mode === 'single' && modelValue_ === item.value"
                    name="check"
                  ></svg-icon>
                  <svg-icon
                    class="li_icon"
                    v-show="mode === 'multiple' && modelValue_.includes(item.value)"
                    name="check"
                  ></svg-icon>
                </span>
              </li>
            </template>
          </ul>
        </div>
        <div class="s_dropdown_button" v-if="data.length > 0 && selectButton">
          <span :class="selectButtonFilter() ? '' : 'active'" @click="checkallButton()">{{
            selectButtonFilter() ? "全不选" : "全选"
          }}</span>
          <!-- <span @click="onBlur">确定</span> -->
        </div>
      </div>
    </DropDown>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from "vue";
import SvgIcon from "./svgIcon.vue";
import { isEmpty } from "./utils/index";
import DropDown from "./public/DropDown.vue";
const triggerEle = ref(null);
let props = defineProps({
  selectButton: {
    type: Boolean,
    default: false,
  },
  isHidePlaceholder: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: [String, Array, Number],
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
  disabledRow: {
    type: Function,
    default: () => false,
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  //最多选择项 多选时候有用
  maxSelect: {
    type: [String, Number],
    default: "",
  },
  selectLabelFn: {
    type: Function,
  },
  isOptionGroup: {
    type: Boolean,
    default: false,
  },
});
//全选状态
const selectButtonFilter = () => {
  if (props.data.length == modelValue_.value.length) {
    return true;
  }
  return false;
};
//全选
const checkallButton = () => {
  //全选时改为全部取消
  if (selectButtonFilter()) {
    modelValue_.value = [];
  } else {
    let newsarr = [];
    for (let i = 0; i < props.data.length; i++) {
      newsarr.push(props.data[i].value);
    }
    modelValue_.value = newsarr;
  }
};
let isMult = props.mode === "multiple";
let showDropDown = ref(false);
let dataList = ref(props.data);
let modelValue_ = ref("");
resetInitValue();

const labelText = ref("");
const input = ref(null);
const inputText = ref("");
const compositionstart = ref(false);
const isSelectActive = ref(false);
//data key value 键值对

const keyValueObj = computed(() => {
  return props.data.reduce((p, c) => {
    if (c.options) {
      c.options.forEach((v) => {
        p[v.label] = v.value;
      });
    } else {
      p[c.label] = c.value;
    }
    return p;
  }, {});
});
function resetInitValue() {
  modelValue_.value = isMult ? [...props.modelValue] : props.modelValue;
}

// resetkeyValueObj.value();
function findKeyByValue(obj, value) {
  return Object.keys(obj).find((key) => obj[key] === value);
}

const setLabelText = () => {
  if (isMult) {
    labelText.value = modelValue_.value.map((v) => findKeyByValue(keyValueObj.value, v));
  } else {
    let res = Object.entries(keyValueObj.value).find(
      ([label, value]) => value === modelValue_.value
    );
    if (res) {
      labelText.value = res[0];
    } else {
      labelText.value = props.placeholder;
    }
  }
};

//首次加载 检查modelValue是否合法
function checkModelValue() {
  //分析 modelvalue_ 是否合法
  let vList = Object.values(keyValueObj.value);
  if (isMult) {
    modelValue_.value.forEach((item) => {
      if (!vList.includes(item)) {
        console.warn(`[Select]: modelValue_ 非法, value ${item} 不在下拉数据中`);
        //删除 item
        modelValue_.value.splice(modelValue_.value.indexOf(item), 1);
      }
    });
  } else {
    if (modelValue_.value && !vList.includes(modelValue_.value)) {
      console.warn(
        `[Select]: modelValue_ 非法, value ${modelValue_.value} 不在下拉数据中`
      );
      modelValue_.value = "";
    }
  }
}

let emit = defineEmits(["selectChange", "change", "update:modelValue", "blur"]);

checkModelValue();
setLabelText();

const emitSelect = ({ value, label }) => {
  if (isMult) {
    if (modelValue_.value.includes(value)) {
      modelValue_.value = modelValue_.value.filter((item) => item !== value);
    } else {
      if (props.maxSelect && modelValue_.value.length >= +props.maxSelect) {
        return;
      }
      modelValue_.value = [...modelValue_.value, value];
    }
  } else {
    modelValue_.value = value;
    showDropDown.value = false;
  }
  // console.log(modelValue_.value);
  emit("update:modelValue", modelValue_.value);
  console.log("update:modelValue");
  emit("selectChange", modelValue_.value);
  emit("change", modelValue_.value);
  inputText.value = "";
};

const emitSelectAll = () => {
  if (props.selectButton) {
    modelValue_.value = [];
  } else {
    if (isMult) {
      modelValue_.value = [];
    } else {
      modelValue_.value = "";
    }
    showDropDown.value = false;
    emit("update:modelValue", modelValue_.value);
    console.log("update:modelValue");
    emit("selectChange", modelValue_.value);
    inputText.value = "";
  }
};

const onBlur = (v) => {
  emit("blur", inputText.value);
  setLabelText();
  showDropDown.value = false;
  inputText.value = "";
  isSelectActive.value = false;
  if (props.selectButton) {
    emit("selectChange", modelValue_.value);
  }
};
onMounted(() => {
  // console.log(props.modelValue)
});
watch(
  () => props.modelValue,
  (val) => {
    resetInitValue();
    // emit("selectChange", modelValue_.value);
  }
);
watch(
  () => props.data,
  (val) => {
    dataList.value = val;
    resetInitValue();
    checkModelValue();
    nextTick(setLabelText);
  },
  { deep: true }
);
watch(modelValue_, (val) => {
  console.log("watch:modelValue_", val);
  setLabelText();
});

watch(inputText, (val, oldValue) => {
  // console.log(val + "_");
  prevInput = oldValue;
});

const selectAll = () => {
  if (modelValue_.value < dataList.value.length) {
    modelValue_.value = dataList.value.map((item) => item.value);
  } else {
    modelValue_.value = [];
  }
};

const closeSelect = (label, index) => {
  modelValue_.value.splice(index, 1);
  labelText.value.splice(index, 1);
  emit("update:modelValue", modelValue_.value);
  console.log("update:modelValue");
  emit("selectChange", modelValue_.value);
};

const focusSearch = (event) => {
  if(props.disabled) return;
  if (props.showSearch) event.preventDefault();
  showDropDown.value = !showDropDown.value;
  dataList.value = props.data;
  if (props.showSearch) input.value.focus();
};

let prevInput = "";
const search = (event) => {
  // console.log("input", compositionstart.value);
  if (compositionstart.value) {
    return; // 如果刚监听输入法输入 直接return
  }
  if (!isMult) labelText.value = event.target.value;
  showDropDown.value = true;
  if (event.target.value === "") {
    dataList.value = props.data;
    setLabelText();
    return;
  }
  dataList.value = props.data.reduce((p, c) => {
    if (c.options) {
      let res = c.options.filter((v) =>
        new RegExp(event.target.value, "ig").test(v.label)
      );
      if (res.length) {
        p.push({
          label: c.label,
          options: res,
        });
      }
    } else {
      if (new RegExp(event.target.value, "ig").test(c.label)) {
        p.push(c);
      }
    }
    return p;
  }, []);
};

const keyDelete = () => {
  if (prevInput.length === 1) {
    prevInput = "";
    return;
  }
  // console.log("keyup", inputText.value, prevInput);
  if (modelValue_.value.length && prevInput === "") {
    modelValue_.value.pop();
    setLabelText();
  }
};

const selectDefault = () => {
  dataList.value = props.data;
  onBlur();
};
defineExpose({
  inputText,
});
</script>

<style lang="scss" scoped>
.rock_select {
  position: relative;
  cursor: pointer;
  width: 100%;
  min-width: 80px;
  display: inline-block;
  vertical-align: middle;
  .disable {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    cursor: no-drop;
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

.rock_label {
  position: relative;
  width: 100%;
  min-height: 32px;
  height: 32px;
  background: var(--color-background);
  color: var(--color-text);
  line-height: 32px;
  padding-left: 11px;
  text-align: left;
  font-size: 14px;
  border: 1px solid var(--color-border);
  border-radius: 2px;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  &.active {
    border: 1px solid var(--color-primary);
  }

  &.search {
    cursor: text;
  }

  .down {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  .multiple_labels {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    height: 100%;
    width: 100%;

    > div.label {
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

  .single_input {
    position: absolute;
    left: 0;
    top: 0;
    padding-left: 10px;
    width: 100%;
    height: 100%;
    background: transparent;
    outline: none;
    border: none;
    color: var(--color-text);
  }

  .mult_placeholder {
    position: absolute;
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-ploceholder);
  }
}
.s_dropdown {
  width: 100%;
  max-height: 260px;
  background: var(--color-background);
  border-radius: 4px;
  transition: 0.3s;
  border: 1px solid var(--color-border);
  box-shadow: 0px 2px 5px 0px var(--color-border), 0px 2px 3px 0px var(--color-border);
}
.s_dropdown1 {
  max-height: 200px;
  overflow-y: auto;

  ul {
    margin: 0;
    padding: 10px 0;

    li {
      > span {
        width: 100%;
        height: 100%;
        padding-left: 10px;
        padding-right: 30px;
        display: inline-block;
        position: relative;
        list-style: none;
        color: var(--color-text);
        text-align: left;
        font-size: 14px;
        line-height: 34px;
        cursor: pointer;
        box-sizing: border-box;

        &.placeholderStyle {
          color: var(--color-text-ploceholder);
          &:hover {
            background: none;
            color: var(--color-text-ploceholder);
          }
        }

        &:hover {
          background: var(--color-background-hover);
          color: var(--color-text-hover);
        }

        &.active {
          background: var(--color-background-active);
          color: var(--color-text-selected);
        }

        .li_icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      &.disabledli {
        cursor: no-drop;

        > span {
          pointer-events: none;
          color: var(--color-text-disabled);
        }
      }

      &.group {
        > span {
          color: var(--color-text-disabled);

          &:hover {
            background: none;
          }
        }

        > ul {
          padding: 0;
          margin: 0;

          li {
            > span {
              padding-left: 20px;
            }
          }
        }
      }
    }
  }
}

.s_dropdown_button {
  margin: 10px 0;

  span {
    display: inline-block;
    width: 68px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    margin-left: 10px;
  }

  span:nth-child(2) {
    background: var(--color-primary);
    color: #ffffff;
  }

  span:nth-child(1) {
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-text);
  }

  .active {
    background: var(--color-primary);
    color: #ffffff;
  }
}

.mult_input_wrap {
  position: relative;
  height: 22px;
  padding: 0 4px;
  width: fit-content;
  min-width: 5px;

  > span {
    visibility: hidden;
  }
}

.mult_input {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: transparent;
  outline: none;
  border: none;
  color: var(--color-text);
}
</style>
