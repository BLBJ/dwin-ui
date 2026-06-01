<template>
  <table crocklspacing="0" crocklpadding="0" class="d-date-table">
    <tbody>
      <tr>
        <!---->

        <th>一</th>
        <th>二</th>
        <th>三</th>
        <th>四</th>
        <th>五</th>
        <th>六</th>
        <th>日</th>
      </tr>
      <tr class="d-date-table__row" v-for="(item, index) in dateList" :key="index">
        <td
          :class="[
            child.class,
            {
              today: dayjs().format('YYYY-MM-DD') === child.label,
              selected: child.label === startValue_ || child.label === endValue_,
              inRange:
                startValue_ &&
                endValue_ &&
                dateIsBetween(child.label, startValue_, endValue_),
              startDate:
                child.label ===
                dayjs.min(dayjs(startValue_), dayjs(endValue_)).format('YYYY-MM-DD'),
              endDate:
                child.label ===
                dayjs.max(dayjs(startValue_), dayjs(endValue_)).format('YYYY-MM-DD'),
              disabled: disabledDate(child.label),
            },
          ]"
          v-for="(child, index) in item"
          :key="index"
          @mouseenter="onMouseenter(child.class, child.label)"
          @mouseleave="onMouseleave(child.class)"
          @click="submit(child.label, child.class)"
        >
          <div>
            <span :title="child.label">{{ child.date }}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";

dayjs.extend(isBetween);
dayjs.extend(minMax);

let props = defineProps({
  value: {
    type: String,
    default: "",
  },
  startValue: {
    type: String,
    default: "",
  },
  endValue: {
    type: String,
    default: "",
  },
  currentYearMonth: {
    type: String,
    default: dayjs().format("YYYY-MM"),
  },
  isEnbleMouseSelect: {
    type: Boolean,
    default: false,
  },
  disabledDate: {
    type: Function,
    default: () => false,
  },
});

let emits = defineEmits(["endDateChange", "dateChange", "enbleMouseSelect"]);

let currentYearMonth_ = ref(props.currentYearMonth);
let dateList = ref([]);

const startValue_ = ref(props.startValue);
const endValue_ = ref(props.endValue);

watch(
  () => props.startValue,
  (newVal, oldVal) => {
    startValue_.value = newVal;
  }
);

watch(
  () => props.endValue,
  (newVal, oldVal) => {
    endValue_.value = newVal;
  }
);
watch(
  () => props.isEnbleMouseSelect,
  (newVal, oldVal) => {
    enableMouseSelect.value = newVal;
  }
);

setDateList(currentYearMonth_.value);

watch(
  () => props.currentYearMonth,
  (newVal, oldVal) => {
    if (newVal === oldVal) return;
    currentYearMonth_.value = newVal;
    setDateList(currentYearMonth_.value);
  }
);

function dateIsBetween(date, start, end) {
  if (!start || !end) return false;
  return dayjs(date).isBetween(start, end, "day", "[]");
}

function getDay(date) {
  let day = date.day();
  if (date.day() == 0) day = 7;
  return day - 1;
}

function setDateList(dateFormat) {
  // console.log(dateFormat);
  dateList.value = [];
  let dateSelect = dayjs(dateFormat);
  let month = dateSelect.month();
  let row = 0;
  //日历第一行   * * * 1  2  3  4
  let day = getDay(dateSelect);
  let items = [];
  for (let i = 0; i < day; i++) {
    let date = dateSelect.date(i - day + 1);
    let lastMonthDate = date.date();
    items.push({
      class: "prev-month",
      date: lastMonthDate,
      label: date.format("YYYY-MM-DD"),
    });
  }
  // console.log(items);

  while (dateSelect.month() == month) {
    items.push({
      class: "available",
      date: dateSelect.date(),
      label: dateSelect.format("YYYY-MM-DD"),
    });
    if (getDay(dateSelect) % 7 == 6) {
      dateList.value.push(items);
      row++;
      items = [];
    }
    dateSelect = dateSelect.add(1, "day");
  }
  let num = row === 4 ? 14 : 7;
  for (let i = getDay(dateSelect); i < num; i++) {
    items.push({
      class: "next-month",
      date: dateSelect.date(),
      label: dateSelect.format("YYYY-MM-DD"),
    });

    if (getDay(dateSelect) % 7 == 6) {
      dateList.value.push(items);
      items = [];
    }
    dateSelect = dateSelect.add(1, "day");
  }
  // console.log(dateList.value);
}
const enableMouseSelect = ref(false);
function submit(date, type) {
  if (type === "prev-month" || type === "next-month") return;
  if (type === "selected") return;
  if (type === "available") {
    emits("dateChange", date, "click");
  }

  enableMouseSelect.value = !enableMouseSelect.value;
  // console.log("enableMouseSelect", enableMouseSelect.value);
  emits("enbleMouseSelect", enableMouseSelect.value);
}

function onMouseenter(type, date) {
  if (type !== "available") return;
  if (!enableMouseSelect.value) return;
  emits("dateChange", date, "mouseenter");
}

function onMouseleave(type) {
  if (type !== "available") return;
  if (!enableMouseSelect.value) return;
  // enbleMouseSelectl.value = false;
  // emits("dateChange", "", "mouseenter");
}
</script>

<style lang="scss" scoped>
.d-date-table {
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14px;
  tbody {
    tr {
      height: 30px;
    }

    th {
      text-align: center;
      width: 36px;
      height: 32px;
      line-height: 32px;
      font-weight: normal;
      color: var(--color-title);
    }
    td {
      text-align: center;
      color: var(--color-text);
      cursor: pointer;
      padding: 4px 0;
      &.prev-month,
      &.next-month {
        color: var(--color-text-disabled);
        cursor: not-allowed;
      }
      &.available {
        z-index: 2;
        &:not(.selected):hover {
          > div {
            background-color: var(--picker-hover);
          }
        }
        &.today {
          > div {
            color: var(--color-primary);
            border-radius: 4px;
            // background-color: transparent;
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
            height: 26px;
            transform: translateY(-50%);
            background-color: var(--color-background-hover);
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
        &.selected {
          > div {
            color: #fff !important;
            background: var(--color-primary);
            border-radius: 4px;
          }
        }

        &.disabled {
          cursor: not-allowed;
          pointer-events: none;
          > div {
            color: var(--color-text-disabled);
            cursor: not-allowed;
          }
        }
      }

      > div {
        display: inline-block;
        width: 26px;
        height: 26px;
        line-height: 26px;
        min-width: 24px;
        z-index: 2;
        border-radius: 4px;
        font-size: 14px;
        user-select: none;
      }
    }
  }
}
</style>
