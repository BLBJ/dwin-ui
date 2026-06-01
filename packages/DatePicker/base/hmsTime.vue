<template>
  <div class="time_panel">
    <div class="header">
      {{ timeFormat }}
    </div>
    <div class="pickerHmsTime" style="height: 303px">
      <ul  v-if="localeFormat.includes('hh')">
        <li v-for="(item1, val1) in hoursArray" @mousedown.prevent="timeClick('hours', item1)" :class="{
          disable: isDisableHour(+item1),
        }">
          <span :class="(hoursActive) == (item1) ? 'liactive' : 'liactive2'
            ">{{ item1 }}</span>
        </li>
      </ul>
      <ul  v-if="localeFormat.includes('mm')">
        <li v-for="(item1, val1) in minutesArray" @mousedown.prevent="timeClick('minutes', item1)" :class="{
          disable: isDisableMinute(+item1),
        }">
          <span :class="(minutesActive) == (item1) ? 'liactive' : 'liactive2'
            ">{{ item1 }}</span>
        </li>
      </ul>
      <ul  v-if="localeFormat.includes('ss')">
        <li v-for="(item1, val1) in secondsArray" @mousedown.prevent="timeClick('seconds', item1)">
          <span :class="(secondsActive) == (item1) ? 'liactive' : 'liactive2'
            ">{{ item1 }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "hmsTime",
  props: {
    localeFormat: {
      type: String,
      default: "hh:mm:ss",
    },
    modelValue: {
      type: String,
      default: "00:00:00",
    },
    date: {
      type: Object,
    },
    disabledTime: {
      type: Function,
      default: () => false,
    },
  },
  watch: {
    modelValue(val) {
      if (val) {
        let [hour, minute, second] = this.modelValue.split(":");
        this.hoursActive = hour;
        this.minutesActive = minute;
        this.secondsActive = second;
      } else {
        this.hoursActive = '';
        this.minutesActive = '';
        this.secondsActive = '';
      }
    },
  },
  data() {
    return {
      hoursArray: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
      ],
      minutesArray: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
      ],
      secondsArray: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
      ],
      hoursActive: "",
      minutesActive: "",
      secondsActive: "",
    };
  },
  methods: {
    timeClick(type, item1) {
      if (type == "hours") {
        if (this.isDisableHour(+item1)) return;
        this.hoursActive = item1;
      } else if (type == "minutes") {
        if (this.isDisableMinute(+item1)) return;
        this.minutesActive = item1;
      } else {
        this.secondsActive = item1;
      }
      this.$emit("update:modelValue", this.timeFormat);
      this.$emit("change", this.timeFormat);
    },
    initTime() {
      if (this.modelValue) {
        let [hour, minute, second] = this.modelValue.split(":");
        this.hoursActive = hour;
        this.minutesActive = minute;
        this.secondsActive = second;
      }
    },
    isDisableHour(hour) {
      if (!this.disabledTime()) return false
      let currentSelectDate = new Date(
        this.date.year,
        this.date.month - 1,
        this.date.day,
        hour
      ).getTime();
      return currentSelectDate < this.disabledTime().getTime();
    },
    isDisableMinute(minute) {
      if (!this.disabledTime()) return false
      let currentSelectDate = new Date(
        this.date.year,
        this.date.month - 1,
        this.date.day,
        this.hoursActive,
        minute
      ).getTime();
      return currentSelectDate < this.disabledTime().getTime();
    },
  },
  mounted() {
    this.initTime();
  },
  computed: {
    timeFormat() {
      return this.localeFormat
        .replace("hh", this.hoursActive||'00')
        .replace("mm", this.minutesActive||'00')
        .replace("ss", this.secondsActive||'00');
    },
  },
};
</script>

<style lang="scss" scoped>
.time_panel {
  .header {
    line-height: 31px;
    text-align: center;
    font-size: 17px;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
  }
}

.pickerHmsTime {
  width: 100%;
  display: flex;

  >ul {
    flex: 1;
    float: left;
    height: 100%;
    margin: 4px 0;
    overflow-y: hidden;
    padding: 0;
    width: 56px;
    scrollbar-gutter: stable;
    &:hover {
      overflow-y: auto;
    }

    &:not(:first-child) {
      border-inline-start: 1px solid rgba(5, 5, 5, 0.06);
    }

    li {
      list-style: none;
      text-align: center;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      font-size: 14px;

      &.disable {
        span {
          color: var(--color-disabled);
        }

        &:hover span {
          color: var(--color-disabled);
          background: none;
          padding: 0;
        }
      }
    }

    li:hover span {
      background: var(--color-border);
      // color: var(--color-primary);
      padding: 2px 6px;
    }
  }

  ul:hover {
    overflow: auto;
  }

  .liactive {
    background: var(--color-primary);
    color: #fff;
    padding: 2px 6px;
  }

  .liactive2 {
    background: none;
    color: var(--color-text);
  }
}

.centerHms {
  // border-right: 1px solid var(--color-border);
}

.centerHms2 {
  border-left: 1px solid var(--color-border);
  margin-left: 2px;
}
</style>
