<template>
  <div class="d-picker-year-panel">
    <div class="d-picker-header">
      <div class="icon-left">
        <svg-icon
          class="icon-span"
          v-show="showLeftYearIcon"
          name="double-left"
          @click="handlePrevYearRange"
        ></svg-icon>
        <svg-icon
          class="icon-span"
          v-show="showLeftMonthIcon"
          name="left"
          @click="handlePrevYearRangeOneYear"
        ></svg-icon>
      </div>
      <div class="d-picker-header-view d-date-range-picker__header-title">
        <button v-show="mode_ === 'year'" type="button" class="d-picker-decade-btn">
          {{ year_range_ }}
        </button>
        <button
          v-show="mode_ === 'month'"
          type="button"
          class="d-picker-year-btn"
          @click="handleYearClick(year_)"
        >
          {{ year_ }}年
        </button>
      </div>
      <div class="icon-right">
        <svg-icon
          class="icon-span"
          v-show="showRightYearIcon"
          name="double-right"
          @click="handleNextYearRange"
        ></svg-icon>
        <svg-icon
          class="icon-span"
          v-show="showRightMonthIcon"
          name="right"
          @click="handleNextYearRangeOneYear"
        ></svg-icon>
      </div>
    </div>
    <div class="d-picker-body">
      <table class="d-picker-content" v-show="mode_ === 'year'">
        <tbody>
          <tr v-for="(year, index) in yearList" :key="index">
            <td
              v-for="(item, index) in year"
              :key="index"
              :title="item.value"
              class="d-picker-cell"
              @click="handleClick(item.value)"
              :class="[
                item.class,
                {
                  inRange:
                    type === 'year' &&
                    startValue_ &&
                    endValue_ &&
                    ((item.title >= startValue_ && item.title <= endValue_) ||
                      (item.title >= endValue_ && item.title <= startValue_)),
                  selected:
                    type === 'year' &&
                    (item.title === startValue_ || item.title === endValue_),
                  startDate: type && item.title === startValue_,
                  endDate: type && item.title === endValue_,
                },
              ]"
              @mouseenter="onMouseenter(item.title)"
            >
              <div class="d-picker-cell-inner">{{ item.value }}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table class="d-picker-content" v-show="mode_ === 'month'">
        <tbody>
          <tr v-for="(year, index) in monthList" :key="index">
            <td
              v-for="(item, index) in year"
              :key="index"
              :title="item.title"
              class="d-picker-cell view"
              @click="handleMonthClick(item.title)"
              :class="[
                item.class,
                {
                  inRange:
                    type &&
                    startValue_ &&
                    endValue_ &&
                    ((item.title >= startValue_ && item.title <= endValue_) ||
                      (item.title >= endValue_ && item.title <= startValue_)),
                  selected:
                    type && (item.title === startValue_ || item.title === endValue_),
                  startDate: type && item.title === startValue_,
                  endDate: type && item.title === endValue_,
                },
              ]"
              @mouseenter="onMouseenter(item.title)"
            >
              <div class="d-picker-cell-inner">{{ item.value }}月</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  value: {
    type: [String, Number],
    default: dayjs().year(),
  },
  range: {
    type: Array,
    default: () => [],
  },
  rangeType: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "year",
  },
  startValue: {
    type: String,
    default: "",
  },
  endValue: {
    type: String,
    default: "",
  },
  isEnbleMouseSelect: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["yearChange", "monthChange", "enbleMouseSelect"]);

const mode_ = ref(props.type);
const year_ = ref(props.value);
const yearList = ref([]);
const monthList = ref([]);

const startValue_ = computed(() => {
  if (props.startValue === "") return "";
  else
    return props.type === "year"
      ? dayjs(props.startValue).format("YYYY")
      : dayjs(props.startValue).format("YYYY-MM");
});
const endValue_ = computed(() => {
  if (props.endValue === "") return "";
  else
    return props.type === "year"
      ? dayjs(props.endValue).format("YYYY")
      : dayjs(props.endValue).format("YYYY-MM");
});

const enableMouseSelect = ref(false);

watch(
  () => props.value,
  (val) => {
    year_.value = val;
    setYearList();
  }
);

watch(
  () => props.isEnbleMouseSelect,
  (newVal, oldVal) => {
    enableMouseSelect.value = newVal;
  }
);

//计算 年的区间值
const year_range_ = computed(() => {
  const year = parseInt(year_.value);
  const start = year - (year % 10);
  const end = start + 9;
  return `${start}-${end}`;
});

const showLeftMonthIcon = computed(() => {
  if (!props.rangeType || props.rangeType === "start") {
    return mode_.value === "month";
  } else if (props.rangeType === "end") {
    return props.range[1] - props.range[0] > 1 && mode_.value === "month";
  }
});

const showRightMonthIcon = computed(() => {
  if (!props.rangeType || props.rangeType === "end") {
    return mode_.value === "month";
  } else if (props.rangeType === "start") {
    return props.range[1] - props.range[0] > 1 && mode_.value === "month";
  }
});

const showLeftYearIcon = computed(() => {
  if (!props.rangeType || props.rangeType === "start") {
    return mode_.value === "year";
  } else if (props.rangeType === "end") {
    return props.range[1] - props.range[0] > 10 && mode_.value === "year";
  }
});

const showRightYearIcon = computed(() => {
  if (!props.rangeType || props.rangeType === "end") {
    return mode_.value === "year";
  } else if (props.rangeType === "start") {
    return props.range[1] - props.range[0] > 10 && mode_.value === "year";
  }
});

function onMouseenter(value) {
  if (!enableMouseSelect.value) return;
  if (props.type === "year") {
    emits("yearChange", value, "mouseenter");
  }
  if (props.type === "month") {
    emits("monthChange", value, "mouseenter");
  }
}

function setYearList() {
  yearList.value = [];
  const year = parseInt(year_.value);
  const start = year - (year % 10);
  const end = start + 9;
  let items = [];
  items.push({
    class: "",
    value: start - 1,
    title: start - 1 + "",
  });
  for (let i = start; i <= end; i++) {
    items.push({
      class: "view",
      value: i,
      title: i + "",
    });
    if (items.length % 3 === 0) {
      yearList.value.push(items);
      items = [];
    }
  }
  if (items.length > 0) {
    items.push({
      class: "",
      value: end + 1,
      title: end + 1 + "",
    });
    yearList.value.push(items);
  }
}

function setMonthList() {
  monthList.value = [];
  let items = [];
  for (let i = 1; i <= 12; i++) {
    items.push({
      class: "",
      value: i,
      title: dayjs()
        .year(year_.value)
        .month(i - 1)
        .format("YYYY-MM"),
    });
    if (items.length % 3 === 0) {
      monthList.value.push(items);
      items = [];
    }
  }
}

setYearList();
setMonthList();

function handleClick(value) {
  if (props.type === "year") {
    year_.value = value;
    enableMouseSelect.value = !enableMouseSelect.value;
    emits("enbleMouseSelect", enableMouseSelect.value);
    emits("yearChange", value);
    setYearList();
  }

  if (props.type === "month") {
    year_.value = value;
    mode_.value = "month";
    emits("yearChange", value, props.type);
    setMonthList();
  }
}

function handlePrevYearRange() {
  year_.value -= 10;
  setYearList();
  emits("changeYearRange", year_.value);
}

function handleNextYearRange() {
  year_.value += 10;
  setYearList();
  emits("changeYearRange", year_.value);
}
function handleNextYearRangeOneYear() {
  year_.value += 1;
  emits("changeYearRange", year_.value);
  setYearList();
  setMonthList();
}
function handlePrevYearRangeOneYear() {
  year_.value -= 1;
  emits("changeYearRange", year_.value);
  setYearList();
  setMonthList();
}

function handleYearClick(year) {
  mode_.value = "year";
  year_.value = year;
  setYearList();
  emits("showYearPanel", year);
}

function handleMonthClick(month) {
  enableMouseSelect.value = !enableMouseSelect.value;
  emits("enbleMouseSelect", enableMouseSelect.value);
  emits("monthChange", month);
}
</script>

<style lang="scss" scoped>
.d-picker-year-panel {
  width: 200px;

  .d-picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    padding: 8px;
    box-sizing: border-box;
    color: var(--color-text);
    border-bottom: 1px solid var(--color-border);
    .d-picker-header-view {
      button {
        background-color: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text);
      }
    }
    .icon-span {
      color: var(--color-text);
      &:hover{
        color: var(--color-text-selected);
      }
    }
    .icon-left,
    .icon-right {
      width: 24px;
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }

    .d-date-range-picker__header-title {
      flex: 1;
      font-weight: 500;
      cursor: pointer;
      text-align: center;
      font-size: 14px;
      user-select: none;
      color: var(--color-text);
    }
  }
  .d-picker-body {
    padding: 0 8px 8px 8px;
    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      td {
        position: relative;
        width: 33%;
        text-align: center;
        padding: 5px;
        box-sizing: border-box;
        cursor: pointer;
        z-index: 2;
         color: var(--color-text-disabled);
        > div {
          z-index: 2;
        }
        &.d-picker-cell {
          font-size: 14px;
          //   font-weight: 500;
          color: var(--color-text-disabled);
        }
        &.view {
          color: var(--color-text);
        }
        // &.d-picker-cell-disabled {
        //   color: rgba(0, 0, 0, 0.38);
        //   cursor: not-allowed;
        // }
        &.selected {
          > div {
            color: #fff;
            background: var(--color-text-active);
            border-radius: 4px;
          }
        }
        &.inRange {
          &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 23px;
            transform: translateY(-50%);
            background-color: var(--color-background-hover);
          }
        }
        &.startDate {
          background-color: transparent;
          &::before {
            left: 50%;
            width: 50%;
          }
        }
        &.endDate {
          background-color: transparent;
          &::before {
            right: 50%;
            width: 50%;
          }
        }
      }
    }
  }
}
</style>
