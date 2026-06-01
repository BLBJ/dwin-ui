<template>
  <!-- 输入框 -->
  <div
    class="d-range-picker-container"
    ref="pickerRef"
    :style="{ width: width + 'px' }"
  >
    <RangeInput
      ref="inputRef"
      :placeholder="placeholder_"
      :start-date="startDate_"
      :end-date="endDate_"
      :focus-item="focusItem"
      :disabled="disabled"
      @submit="submit"
      @dateClear="inputClear"
      @focus="focusing"
      @blur="isShowPanel = false"
      @inputChangeStart="inputChangeStart"
      @inputChangeEnd="inputChangeEnd"
      :format="format_"
    />
  </div>

  <DropDown
    :triggerRef="pickerRef"
    :showPanel="isShowPanel"
    @clickOutSide="
      resetDate();
      isShowPanel = false;
    "
  >
    <RangePickerPanel
      ref="panel"
      @date-select="dateSelect"
      @yearChange="dateSelect"
      @monthChange="dateSelect"
      @submit="submit"
      :show-time="showTime"
      :disabled-date="disabledDate"
      :disabled-time="disabledTime"
      :time-format="timeFormat"
      :date-format="dateFormat"
      :mode="mode"
      :start-date="startDate_"
      :end-date="endDate_"
      :focusItem="focusItem"
      @clear="clearPanel"
    />
  </DropDown>
</template>

<script setup>
import { nextTick, ref, onMounted, onUnmounted, computed, watch } from "vue";
import RangeInput from "./RangeInput.vue";
import RangePickerPanel from "./pickerPanel/index.vue";
import dayjs from "dayjs";
import DropDown from "../public/DropDown.vue";

window.dayjs = dayjs;

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
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
    default: "YYYY-MM-DD",
  },
  mode: {
    type: String,
    default: "date",
    validator: (value) => ["date", "year", "month"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledDate: {
    type: Function,
    default: () => false,
  },
  disabledTime: {
    type: Function,
    default: () => {
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
        disabledSeconds: () => [],
      };
    },
  },
  placeholder: {
    type: Array,
    default: () => [],
  },
  width: {
    type: [String, Number],
    default: 200,
  },
});
const emits = defineEmits([
  "update:value",
  "update:startDate",
  "update:endDate",
  "change",
  "select",
]);

const startDate_ = ref(props.value[0] || props.startDate);
const endDate_ = ref(props.value[1] || props.endDate);
watch(
  () => props.startDate,
  (val) => {
    startDate_.value = val;
    if (startDate_.value && endDate_.value) {
      selectedStatus = 1;
    }
  }
);
watch(
  () => props.endDate,
  (val) => {
    endDate_.value = val;
    if (startDate_.value && endDate_.value) {
      selectedStatus = 1;
    }
  }
);
const placeholder_ = ref(["开始日期", "结束日期"]);

const pickerRef = ref(null);
const inputRef = ref(null);
const panel = ref(null);
const focusItem = ref("");
const isShowPanel = ref(false);

//format 初始化
const format_ = ref(props.format);
const timeFormat = ref("HH:mm:ss");
const dateFormat = ref("YYYY-MM-DD");

if (props.showTime) {
  if (!props.format.split(" ")[1]) {
    format_.value = `${props.format} ${timeFormat.value}`;
  }
  dateFormat.value = props.format.split(" ")[0] || "YYYY-MM-DD";
  timeFormat.value = props.format.split(" ")[1] || "HH:mm:ss";
} else {
  dateFormat.value = props.format || "YYYY-MM-DD";
}

if (props.mode === "year") {
  format_.value = "YYYY";
  placeholder_.value = ["开始年份", "结束年份"];
}
if (props.mode === "month") {
  format_.value = "YYYY-MM";
  placeholder_.value = ["开始月份", "结束月份"];
}

if (props.placeholder.length) {
  placeholder_.value = props.placeholder;
}

function focusing(type) {
  focusItem.value = type;
  isShowPanel.value = true;
}
let selectedStatus = 0;

if (startDate_.value && endDate_.value) {
  selectedStatus = 1;
}

function dateSelect(dateFormat, eventType = "click", timeFrom) {
  console.log(dateFormat, timeFrom, focusItem.value);
  //修改时间 时分秒
  if (props.showTime && timeFrom) {
    if (timeFrom === "left") {
      startDate_.value = formatDate(dateFormat);
      // console.log("开始时间", startDate_.value);
    }

    if (timeFrom === "right") {
      endDate_.value = formatDate(dateFormat);
      // console.log("结束时间", endDate_.value);
    }
    return;
  }

  //修改日期
  if (focusItem.value === "start") {
    startDate_.value = formatDate(dateFormat);
    emits("select", [startDate_.value], [new Date(startDate_.value)]);
    // console.log("开始时间", startDate_.value);

    if (eventType === "mouseenter") {
      return;
    }
    //检测此时 endDate_ 是否有值 焦点自动聚焦到 endstart
    // inputRef.value.focus("end");
    focusItem.value = "end";
    //新一轮选择，清空之前的选择
    if (selectedStatus) {
      endDate_.value = "";
      selectedStatus = 0;
    }
    checkResult();
    return;
  }

  if (focusItem.value === "end") {
    endDate_.value = formatDate(dateFormat);
    emits("select", [endDate_.value], [new Date(endDate_.value)]);
    // console.log("结束时间", endDate_.value);
    if (eventType === "mouseenter") {
      return;
    }
    //检测此时 startDate_ 是否有值 焦点自动聚焦到 start
    // inputRef.value.focus("start");
    focusItem.value = "start";
    if (selectedStatus) {
      startDate_.value = "";
      selectedStatus = 0;
    }
    checkResult();
    return;
  }
}

function checkResult() {
  if (startDate_.value && endDate_.value) {
    if (dayjs(startDate_.value).isAfter(dayjs(endDate_.value))) {
      let val = endDate_.value;
      endDate_.value = startDate_.value;
      startDate_.value = val;
    }

    selectedStatus = 1;
    // 日期合格则 emit 值
    if (!props.showTime) {
      submit();
    }
  }
}

function formatDate(date) {
  //格式化
  return dayjs(date).format(format_.value);
}

function submit() {
  if (startDate_.value && endDate_.value) {
    if (dayjs(startDate_.value).isAfter(dayjs(endDate_.value))) {
      let val = endDate_.value;
      endDate_.value = startDate_.value;
      startDate_.value = val;
    }
  }
  if (startDate_.value) startDate_.value = formatDate(startDate_.value);
  if (endDate_.value) endDate_.value = formatDate(endDate_.value);
  // emit 值
  emits("update:value", [startDate_.value, endDate_.value]);
  emits("update:startDate", startDate_.value);
  emits("update:endDate", endDate_.value);
  emits(
    "change",
    [startDate_.value, endDate_.value],
    [new Date(startDate_.value), new Date(endDate_.value)]
  );
  focusItem.value = "";
  inputRef.value.blur();
  isShowPanel.value = false;
}

function inputClear() {
  startDate_.value = "";
  endDate_.value = "";
  focusItem.value = "";
  emits("update:value", []);
  emits("update:startDate", "");
  emits("update:endDate", "");
}

//清楚面板内容
function clearPanel() {
  startDate_.value = "";
  endDate_.value = "";
  focusItem.value = "start";
  // inputRef.value.focus("start");
  emits("update:value", []);
  emits("update:startDate", "");
  emits("update:endDate", "");
}

function resetDate() {
  focusItem.value = "";

  // if (props.showTime) {
  startDate_.value = props.startDate;
  endDate_.value = props.endDate;
  if (startDate_.value && endDate_.value) {
    selectedStatus = 1;
  } else {
    selectedStatus = 0;
  }
  // }
  nextTick(() => {
    panel.value.resetPanel();
  });
}

//校验 输入框内容是否符合 format 格式
function inputChangeStart(val) {
  startDate_.value = val;
  checkResult();
}

function inputChangeEnd(val) {
  endDate_.value = val;
  checkResult();
}
</script>

<style lang="scss" scoped></style>
