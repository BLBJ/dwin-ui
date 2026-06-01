<template>
  <div class="d-date-range-picker d-popper has-time" x-placement="bottom-end">
    <div x-arrow="" class="popper__arrow" style="left: 283px"></div>
    <div class="d-picker-container" v-if="mode === 'date' && showType === 'date'">
      <div class="d-picker-panel__body-wrapper">
        <!---->
        <div class="d-picker-panel__body">
          <DatePanel
            :show-time="showTime"
            :time-format="timeFormat"
            :date-format="dateFormat"
            :startDate="leftDate"
            :endDate="rightDate"
            :startValue="startValue"
            :endValue="endValue"
            :startTime="startTime"
            :endTime="endTime"
            @startTime="(val) => (startTime = val)"
            @endTime="(val) => (endTime = val)"
            type="left"
            @monthChange="dateChange"
            @yearChange="dateChange"
            v-bind="$attrs"
            @showType="showYearMonthPanel"
            @enbleMouseSelect="enbleMouseSelect"
            :isEnbleMouseSelect="isEnbleMouseSelect"
            @selectPanel="(val) => (selectPanal = val)"
            :selectPanal="selectPanal"
            ref="datePanel1"
            :currentYearMonth="currentYearMonth1"
          />
          <DatePanel
            :show-time="showTime"
            :time-format="timeFormat"
            :date-format="dateFormat"
            :startDate="leftDate"
            :endDate="rightDate"
            :startValue="startValue"
            :endValue="endValue"
            :startTime="startTime"
            :endTime="endTime"
            @startTime="(val) => (startTime = val)"
            @endTime="(val) => (endTime = val)"
            type="right"
            @monthChange="dateChange"
            @yearChange="dateChange"
            v-bind="$attrs"
            @showType="showYearMonthPanel"
            @enbleMouseSelect="enbleMouseSelect"
            :isEnbleMouseSelect="isEnbleMouseSelect"
            @selectPanel="(val) => (selectPanal = val)"
            :selectPanal="selectPanal"
            ref="detePanelChild"
            :currentYearMonth="currentYearMonth2"
          />
        </div>
      </div>
      <div class="d-picker-panel__footer" v-show="showTime">
        <button
          type="button"
          @click="
            $emit('clear');
            resetPanel();
          "
          class="d-button d-button--text clear"
        >
          <span> 清空 </span>
        </button>
        <button
          type="button"
          class="d-button active submit"
          :disabled="!startDate || !endDate"
          @click="submit"
        >
          <span> 确定 </span>
        </button>
      </div>
    </div>
    <div
      class="d-picker-container"
      v-if="mode === 'date' && (showType === 'year' || showType === 'month')"
    >
      <YearMonthPanel
        :type="showType"
        :value="year_"
        @yearChange="yearChange"
        @monthChange="monthChange"
      />
    </div>

    <div class="d-picker-container" v-if="mode === 'year' || mode === 'month'">
      <div class="d-picker-panel__body">
        <YearMonthPanel
          :type="mode"
          v-show="
            mode === 'year' ||
            (!yearFrom && mode === 'month') ||
            (yearFrom === 'start' && mode === 'month')
          "
          rangeType="start"
          :value="year_"
          :range="range"
          :startValue="startValue"
          :endValue="endValue"
          @yearChange="yearChange"
          @monthChange="monthChange"
          @changeYearRange="(val) => (range[0] = val)"
          @showYearPanel="
            currentMonthShowType = 'year';
            yearFrom = 'start';
          "
          @enbleMouseSelect="enbleMouseSelect"
          :isEnbleMouseSelect="isEnbleMouseSelect"
        />
        <YearMonthPanel
          v-show="
            mode === 'year' ||
            (!yearFrom && mode === 'month') ||
            (yearFrom === 'end' && mode === 'month')
          "
          :type="mode"
          rangeType="end"
          :value="mode === 'year' ? nextYear10 : nextYear"
          :range="range"
          :startValue="startValue"
          :endValue="endValue"
          @yearChange="yearChange"
          @monthChange="monthChange"
          @changeYearRange="(val) => (range[1] = val)"
          @showYearPanel="
            currentMonthShowType = 'year';
            yearFrom = 'end';
          "
          @enbleMouseSelect="enbleMouseSelect"
          :isEnbleMouseSelect="isEnbleMouseSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import DatePanel from "./DatePanel.vue";
import YearMonthPanel from "./YearMonthPanel.vue";

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
  showTime: {
    type: Boolean,
    default: false,
  },
  dateFormat: {
    type: String,
    default: "YYYY-MM-DD",
  },
  timeFormat: {
    type: String,
    default: "HH:mm:ss",
  },
  mode: {
    type: String,
    default: "date",
    validator: (value) => ["date", "year", "month"].includes(value),
  },
});

const emits = defineEmits(["submit", "clear", "yearChange", "monthChange"]);

const showType = ref("date");
const leftDate = ref("");
const rightDate = ref("");

const currentMonthShowType = ref("month");
const yearFrom = ref("");

const startTime = ref("");
const endTime = ref("");

const currentYearMonth1 = ref(dayjs().format("YYYY-MM"));
const currentYearMonth2 = ref(
  dayjs(currentYearMonth1.value).add(1, "month").format("YYYY-MM")
);
const year_ = ref(dayjs(currentYearMonth1.value).year());
const month_ = ref(dayjs(currentYearMonth1.value).month() + 1);

const nextYear10 = ref(dayjs(currentYearMonth1.value).add(10, "year").year());
const nextYear = ref(dayjs(currentYearMonth1.value).add(1, "year").year());

const range = ref([year_.value, nextYear.value]);
if (props.mode === "year") {
  range.value = [year_.value, nextYear10.value];
}
if (props.mode === "month") {
  range.value = [year_.value, nextYear.value];
}

const selectPanal = ref("date");

const detePanel1 = ref(null);
const datePanelChild = ref(null);

const startValue = ref("");
const endValue = ref("");
const dateClickFlag = ref(0);

if (props.startDate) {
  leftDate.value = props.startDate;
  currentYearMonth1.value = dayjs(leftDate.value).format("YYYY-MM");
  currentYearMonth2.value = dayjs(currentYearMonth1.value)
    .add(1, "month")
    .format(props.dateFormat);
  startValue.value = dayjs(leftDate.value).format("YYYY-MM-DD");
}
if (props.endDate) {
  rightDate.value = props.endDate;
  currentYearMonth2.value = dayjs(leftDate.value).format("YYYY-MM");
  currentYearMonth1.value = dayjs(currentYearMonth1.value)
    .subtract(1, "month")
    .format(props.dateFormat);
  endValue.value = dayjs(rightDate.value).format("YYYY-MM-DD");
}

watch(
  () => props.startDate,
  (newVal, oldVal) => {
    leftDate.value = newVal;
    startValue.value = newVal ? dayjs(newVal).format("YYYY-MM-DD") : "";
  }
);
watch(
  () => props.endDate,
  (newVal, oldVal) => {
    rightDate.value = newVal;
    endValue.value = newVal ? dayjs(newVal).format("YYYY-MM-DD") : "";
  }
);
function dateChange(dateFormat, type) {
  if (type === "left") {
    currentYearMonth1.value = dateFormat;
    currentYearMonth2.value = dayjs(dateFormat).add(1, "month").format("YYYY-MM");
  } else {
    currentYearMonth2.value = dateFormat;
    currentYearMonth1.value = dayjs(dateFormat).subtract(1, "month").format("YYYY-MM");
  }
}

const isEnbleMouseSelect = ref(false);
function enbleMouseSelect(val) {
  isEnbleMouseSelect.value = val;
}

let year_position = ref("left");
function showYearMonthPanel(position, type, val) {
  showType.value = type;
  year_position.value = position;
  if (type === "year") year_.value = val;
  if (type === "month") {
    year_.value = val[0];
    month_.value = val[1];
  }
}

function yearChange(year, eventType = "click") {
  if (props.mode === "year") {
    emits("yearChange", `${year}`, eventType);
    return;
  }
  //改变年 选取月份
  if (props.mode === "month") {
    currentMonthShowType.value = "month";

    if (yearFrom.value === "start") {
      nextYear.value = dayjs(year + "")
        .add(1, "year")
        .year();
    }
    if (yearFrom.value === "end") {
      year_.value = dayjs(year + "")
        .subtract(1, "year")
        .year();
    }
    yearFrom.value = "";
    return;
  }
  showType.value = "date";
  dateChange(
    dayjs(year + "-" + month_.value).format(props.dateFormat),
    year_position.value
  );
}
function monthChange(month, eventType = "click") {
  if (props.mode === "month") {
    emits("monthChange", dayjs(month).format(props.dateFormat), eventType);
    return;
  }
  showType.value = "date";
  dateChange(dayjs(month).format(props.dateFormat), year_position.value);
}

function submit() {
  emits("submit");
  selectPanal.value = "date";
}

function resetPanel() {
  selectPanal.value = "date";
  showType.value = "date";
  isEnbleMouseSelect.value = false;
  if (props.startDate) {
    leftDate.value = props.startDate;
    currentYearMonth1.value = dayjs(leftDate.value).format("YYYY-MM");
    currentYearMonth2.value = dayjs(currentYearMonth1.value)
      .add(1, "month")
      .format(props.dateFormat);
  } else {
    currentYearMonth1.value = dayjs().format("YYYY-MM");
    currentYearMonth2.value = dayjs(currentYearMonth1.value)
      .add(1, "month")
      .format("YYYY-MM");
  }
}

defineExpose({ resetPanel });
</script>

<style lang="scss" scoped>
.d-date-range-picker {
  box-sizing: border-box;
  // padding: 10px;
  overflow: hidden;
  vertical-align: top;
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 5px 10px 0 var(--color-box-shadow1),
    0 1px 10px 0px var(--color-box-shadow2);
  transition: margin 0.3s;
  .d-picker-panel__body {
    display: flex;
    > :first-child {
      border-right: 1px solid var(--color-border);
    }
  }
  .d-picker-panel__footer {
    height: 50px;
    display: flex;
    justify-content: right;
    align-items: center;
    button {
      outline: none;
      border: none;
      border-radius: 4px;
      padding: 0 10px;
      height: 25px;
      line-height: 25px;
      margin-right: 10px;
      font-size: 12px;
      cursor: pointer;
      width:50px;
      &.clear{
        color: var(--color-primary);
        background-color: transparent;
      }
      &.submit {
        color: #fff;
        background-color: var(--color-primary);
      }
      &[disabled] {
        color: var(--color-text);
        background-color: var(--color-disabled);
        border: 1px solid transparent;
        cursor: not-allowed;
      }
    }
  }
}
</style>
