<template>
  <div class="d-date-range-picker-content">
    <div class="d-date-range-picker__header" v-if="showPanelType === 'date'">
      <div class="icon-left">
        <svg-icon
          name="double-left"
          size="14"
          v-show="type === 'left'"
          @click="prevYear"
        ></svg-icon>
        <svg-icon
          name="left"
          size="14"
          v-show="type === 'left'"
          @click="prevMonth"
        ></svg-icon>
      </div>

      <div class="d-date-range-picker__header-title">
        <span @click="emits('showType', type, 'year', year)">{{ year }}年</span>
        <span @click="emits('showType', type, 'month', [year, month])"
          >{{ month }}月</span
        >
      </div>
      <div class="icon-right">
        <svg-icon
          name="right"
          size="14"
          v-show="type === 'right'"
          @click="nextMonth"
        ></svg-icon>
        <svg-icon
          name="double-right"
          size="14"
          v-show="type === 'right'"
          @click="nextYear"
        ></svg-icon>
      </div>
    </div>
    <div class="d-date-range-picker__header" v-if="showPanelType === 'time'">
      <div class="d-date-range-picker__header-title">请选择时间</div>
    </div>

    <div class="d-date-range-picker__body">
      <Calendar
        :value="date"
        :currentYearMonth="currentYearMonth"
        v-bind="$attrs"
        v-if="showPanelType === 'date'"
        @date-change="handleDateChange"
      />
      <TimePanel
        :value="time"
        :type="type=== 'left' ? 'start' : 'end'"
        :date="date"
        :timeFormat="timeFormat"
        @time-change="handleTimeChange"
         v-bind="$attrs"
        v-if="showPanelType === 'time'"
      />
    </div>

    <div class="d-date-range-picker__footer" v-show="showTime">
      <div class="d-date-range-picker__footer-item">
        <svg-icon name="calendar" size="14"></svg-icon>
        <input
          type="text"
          :value="date"
          :placeholder="type === 'left' ? '开始日期' : '结束日期'"
          @click="showDatePanel"
          @input="handleDateInputChange"
        />
      </div>
      <div class="d-date-range-picker__footer-item">
        <svg-icon name="clock-circle" size="14"></svg-icon>
        <input
          type="text"
          :placeholder="type === 'left' ? '开始时间' : '结束时间'"
          :value="time"
          @click="showTimePanel"
          @input="handleTimeInputChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Calendar from "./Calendar.vue";
import TimePanel from "./TimePanel.vue";
import dayjs from "dayjs";

const props = defineProps({
  startDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
  startTime: {
    type: String,
    default: "",
  },
  endTime: {
    type: String,
    default: "",
  },
  selectValue: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "left",
  },
  showTime: {
    type: Boolean,
    default: false,
  },
  timeFormat: {
    type: String,
    default: "HH:mm:ss",
  },
  dateFormat: {
    type: String,
    default: "YYYY-MM-DD",
  },
  selectPanal: {
    type: String,
    default: "date",
  },
  currentYearMonth: {
    type: String,
    default: dayjs().format("YYYY-MM"),
  },
  focusItem: {
    type: String,
    default: "",
  },
});

const emits = defineEmits([
  "update:value",
  "yearChange",
  "monthChange",
  "showType",
  "date-select",
  "selectPanel",
  "startTime",
  "endTime"
]);

const showPanelType = ref("date");

const date = ref(dayjs().format(props.dateFormat));

const defaultTime = props.timeFormat
  .replace("HH", "00")
  .replace("mm", "00")
  .replace("ss", "00");

const time = ref(defaultTime);

const year = computed(() => dayjs(props.currentYearMonth).year());
const month = computed(() => dayjs(props.currentYearMonth).month() + 1);

//初始化 设置日期
if (props.startDate) {
  if (props.type === "left") {
    date.value = props.startDate.split(" ")[0];
    if (props.showTime) {
      time.value = props.startDate.split(" ")[1];
    }
  }
}

if (props.endDate) {
  if (props.type === "right") {
    date.value = props.endDate.split(" ")[0];
    if (props.showTime) {
      time.value = props.endDate.split(" ")[1];
    }
  }
}

watch(
  () => props.startDate,
  (newVal, oldVal) => {
    if (newVal) {
      if (props.type === "left") {
        date.value = newVal.split(" ")[0];
        if (props.showTime) {
          time.value = newVal.split(" ")[1];
        }
      }
    }
  }
);
watch(
  () => props.endDate,
  (newVal, oldVal) => {
    if (newVal) {
      if (props.type === "right") {
        date.value = newVal.split(" ")[0];
        if (props.showTime) {
          time.value = newVal.split(" ")[1];
        }
      }
    }
  }
);

watch(
  () => props.selectPanal,
  (newVal) => {
    showPanelType.value = newVal;
  }
);

function prevYear() {
  let currentYearMonth = dayjs(props.currentYearMonth)
    .subtract(1, "year")
    .format("YYYY-MM");
  emits("yearChange", currentYearMonth, "left");
}

function prevMonth() {
  let currentYearMonth = dayjs(props.currentYearMonth)
    .subtract(1, "month")
    .format("YYYY-MM");
  emits("monthChange", currentYearMonth, "left");
}

function nextYear() {
  let currentYearMonth = dayjs(props.currentYearMonth).add(1, "year").format("YYYY-MM");
  emits("yearChange", currentYearMonth, "right");
}

function nextMonth() {
  let currentYearMonth = dayjs(props.currentYearMonth).add(1, "month").format("YYYY-MM");
  emits("monthChange", currentYearMonth, "right");
}

function handleTimeInputChange(event) {
  const value = event.target.value;
  //校验 时间值满足格式 HH:mm:ss HH(00-23) mm(00-59) ss(00-59)
  if (!/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/.test(value)) {
    console.log("时间格式不正确");
    return;
  }
  handleTimeChange(value);
}

function handleDateInputChange(event) {
  if (dayjs(event.target.value, props.dateFormat, "es", true).isValid()) {
    date.value = event.target.value;
    if (props.type === "left") {
      emits("date-select", `${date.value} ${getStartTime()}`, "click");
    }
    if (props.type === "right") {
      emits("date-select", `${date.value} ${getEndTime()}`, "click");
    }
  } else {
    console.log("日期格式不正确");
    // date.value = dayjs().format(props.dateFormat);
  }
}

function showDatePanel() {
  showPanelType.value = "date";
  emits("selectPanel", "date");
}

function showTimePanel() {
  showPanelType.value = "time";
  emits("selectPanel", "time");
}

function handleTimeChange(value) {
  time.value = value;
  if (props.type === "left") {
    emits("startTime", value);
  }
  if (props.type === "right") {
    emits("endTime", value);
  }
  if (props.startDate || props.endDate) {
    emits("date-select", `${date.value} ${value}`, "click", props.type);
  }
}

function getStartTime() {
  return props.startTime || defaultTime;
}

function getEndTime() {
  return props.endTime || defaultTime;
}

function handleDateChange(value, eventType) {
  if (!value) return;
  if (props.showTime) {
    if (eventType === "click") {
      if (props.focusItem === "start") {
        emits("date-select", `${value} ${getStartTime()}`, eventType);
      }
      if (props.focusItem === "end") {
        emits("date-select", `${value} ${getEndTime()}`, eventType);
      }
    }
    if (eventType === "mouseenter") {
      emits("date-select", `${value} ${getEndTime()}`, eventType);
    }
  } else {
    emits("date-select", value, eventType);
  }
}
</script>

<style lang="scss" scoped>
.d-date-range-picker-content {
  position: relative;
  min-width: 260px;
  width: 260px;
}
.d-date-range-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 8px;
  box-sizing: border-box;
  color: var(--color-title);
  border-bottom: 1px solid var(--color-border);
  .icon-span {
    width: 22px;
  }
  .icon-left,
  .icon-right {
    width: 50px;
    display: flex;
    align-items: center;
    cursor: pointer;
    //禁止选中
    user-select: none;
  }

  .d-date-range-picker__header-title {
    flex: 1;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    user-select: none;
  }
}
.d-date-range-picker__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);

  > div {
    width: 50%;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    &:first-child {
      border-right: 1px solid var(--color-border);
    }
    > input {
      display: inline-block;
      width: 100%;
      height: 50px;
      padding: 0 10px;
      border: none;
      background-color: transparent;
      font-size: 14px;
      color: var(--color-text);
      outline: none;
      &::placeholder {
        font-size: 13px;
      }
    }
  }
}
.d-date-range-picker__body {
  padding: 8px;
  height: 254px;
}
</style>
