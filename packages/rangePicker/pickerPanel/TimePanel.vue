<template>
  <div class="d-picker-time-panel">
    <div class="d-picker-content" ref="timePickerEle">
      <ul
        class="d-picker-time-panel-column"
        style="position: relative"
        v-show="timeFormat.includes('HH')"
      >
        <li
          class="d-picker-time-panel-cell"
          :class="[
            { active: hour == val },
            'hour' + val,
            {
              disabled: disabledTime(
                date + ' ' + formatTime(hour, minute, second),
                type
              ).disabledHours().includes(+val),
            },
          ]"
          v-for="val in hourList"
          :key="val"
          @click="handleClickHour($event, val)"
        >
          <div class="d-picker-time-panel-cell-inner">{{ val }}</div>
        </li>
      </ul>
      <ul
        class="d-picker-time-panel-column"
        style="position: relative"
        v-show="timeFormat.includes('mm')"
      >
        <li
          class="d-picker-time-panel-cell"
          :class="[
            { active: minute == val },
            'minute' + val,
            {
              disabled: disabledTime(
                date + ' ' + formatTime(hour, minute, second),
                type
              ).disabledMinutes().includes(+val),
            },
          ]"
          v-for="val in minuteList"
          :key="'minute' + val"
          @click="handleClickMinute($event, val)"
        >
          <div class="d-picker-time-panel-cell-inner">{{ val }}</div>
        </li>
      </ul>
      <ul
        class="d-picker-time-panel-column"
        style="position: relative"
        v-show="timeFormat.includes('ss')"
      >
        <li
          class="d-picker-time-panel-cell"
          :class="[
            { active: second == val },
            'second' + val,
            {
              disabled: disabledTime(
                date + ' ' + formatTime(hour, minute, second),
                type
              ).disabledSeconds().includes(+val),
            },
          ]"
          v-for="val in secondList"
          :key="'second' + val"
          @click="handleClickSecond($event, val)"
        >
          <div class="d-picker-time-panel-cell-inner">{{ val }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  value: {
    type: String,
    default: "00:00:00",
  },
  timeFormat: {
    type: String,
    default: "HH:mm:ss",
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
  type: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["timeChange"]);

const hourList = ref([]);
const minuteList = ref([]);
const secondList = ref([]);

const hour = ref(props.value.split(":")[0]);
const minute = ref(props.value.split(":")[1]);
const second = ref(props.value.split(":")[2]);

hourList.value = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : i + ""));
minuteList.value = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : i + ""));
secondList.value = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : i + ""));

onMounted(() => {
  initTime(props.value);
});

const timePickerEle = ref(null);
watch(
  () => props.value,
  (value) => {
    setSelectedStatus(value);
  }
);

function setSelectedStatus(value) {
  let h = value.split(":")[0];
  let m = value.split(":")[1];
  let s = value.split(":")[2];
  if (h && h !== hour.value) {
    hour.value = h;
    timePickerEle.value.querySelector(`.hour${h}`).scrollIntoView({ behavior: "smooth" });
  }
  if (m && m !== minute.value) {
    minute.value = m;
    timePickerEle.value
      .querySelector(`.minute${m}`)
      .scrollIntoView({ behavior: "smooth" });
  }
  if (s && s !== second.value) {
    second.value = s;
    timePickerEle.value
      .querySelector(`.second${s}`)
      .scrollIntoView({ behavior: "smooth" });
  }
}
function initTime(value) {
  let h = value.split(":")[0];
  let m = value.split(":")[1];
  let s = value.split(":")[2];
  if (h) {
    hour.value = h;
    timePickerEle.value.querySelector(`.hour${h}`).scrollIntoView();
  }
  if (m) {
    minute.value = m;
    timePickerEle.value.querySelector(`.minute${m}`).scrollIntoView();
  }
  if (s) {
    second.value = s;
    timePickerEle.value.querySelector(`.second${s}`).scrollIntoView();
  }
}

function formatTime(hour, minute, second) {
  let time = props.timeFormat
    .replace("HH", hour)
    .replace("mm", minute)
    .replace("ss", second);
  return time;
}
function handleClickHour(event, value) {
  event.target.scrollIntoView({ behavior: "smooth" });
  hour.value = value;
  emits("timeChange", formatTime(value, minute.value, second.value));
}

function handleClickMinute(event, value) {
  event.target.scrollIntoView({ behavior: "smooth" });
  minute.value = value;
  emits("timeChange", formatTime(hour.value, value, second.value));
}

function handleClickSecond(event, value) {
  event.target.scrollIntoView({ behavior: "smooth" });
  second.value = value;
  emits("timeChange", formatTime(hour.value, minute.value, value));
}
</script>

<style lang="scss" scoped>
.d-picker-time-panel {
  position: relative;
  height: 100%;
  width: 100%;
  // background-color: #fff;
  // box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  overflow: hidden;
  height: 254px;
  .d-picker-content {
    position: relative;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    height: 100%;
    .d-picker-time-panel-column {
      flex: 1 0 auto;
      width: 56px;
      margin: 0 4px;
      padding: 0;
      overflow-y: auto;
      text-align: start;
      list-style: none;
      transition: background-color 0.1s;
      overflow-x: hidden;
      height: 100%;

      &::-webkit-scrollbar {
        width: 0;
      }

      &:after {
        display: block;
        height: 230px;
        content: "";
      }

      li {
        position: relative;
        margin: 3px 0;

        .d-picker-time-panel-cell-inner {
          text-align: center;
          cursor: pointer;
          font-size: 14px;
          height: 25px;
          line-height: 25px;
          color: var(--color-text);
          border-radius: 4px;
        }
        &.active {
          .d-picker-time-panel-cell-inner {
            background-color: var(--color-text-active);
            color: #fff;
          }
        }
        &:hover {
          .d-picker-time-panel-cell-inner {
            background-color: var(--color-background-hover);
            color: var(--color-text-hover);
          }
        }

        &.disabled {
          pointer-events: none;
          display: none;
          .d-picker-time-panel-cell-inner {
            color: var(--color-text-disabled);
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>
