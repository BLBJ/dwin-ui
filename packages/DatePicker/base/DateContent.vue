<template>
  <div class="date-content">
    <div class="date-content-in">
      <div class="date-weeks">
        <span v-for="val in weeks" :key="val">{{ val }}</span>
      </div>

      <transition-group
        name="list"
        tag="div"
        @mouseover="mouseover"
        @mouseout="mouseout"
        @mousedown.prevent="clickHandle"
      >
        <span
          :title="item.date"
          v-for="(item, index) in daysArr"
          :key="index"
          :data-value="item.value"
          :data-type="item.type"
          :class="{
            active: isActive && item.value === new Date().getDate(),
            disable: disabledDate(new Date(item.date + ' 00:00:00')),
            selected:
              item.type === 'current' &&
              year === selectedDate.year &&
              month === selectedDate.month &&
              item.value === selectedDate.day,
          }"
          >{{ item.value }}</span
        >
      </transition-group>
      <div v-if="showTime">
        <div class="today" @mousedown.prevent="toToday">今天</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, toRefs, ref, watch } from "vue";
import { get_days_by_year_month, get_next_year_month, get_prev_year_month } from "./util";

let currentEle = null;
export default {
  props: {
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    month: {
      type: Number,
      default: new Date().getMonth() + 1,
    },
    day: {
      type: Number,
      default: new Date().getDate(),
    },
    disabledDate: {
      type: Function,
      default: () => false,
    },
    showTime: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Object,
      dafault: () => {
        return {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate(),
        };
      },
    },
  },
  setup(props, { emit }) {
    const weeks = ["一", "二", "三", "四", "五", "六", "日"];

    //星期数转化 周一周日 0~6
    let getDay = (date) => {
      let day = date.getDay();
      if (day === 0) day = 7;
      return day - 1;
    };
    let { year, month, day,date } = toRefs(props);
    const selectedDate = ref({
      year:date.value.year,
      month:date.value.month,
      day:date.value.day,
    });
    let daysArr = computed(() => {
      let mon = month.value - 1;
      let date_select = new Date(year.value, mon);
      let before_arr = [],
        current_month_arr = [],
        after_arr = [];
      let box_num = 0;
      let day_num = getDay(date_select);
      let date_select_ = new Date(year.value, mon);
      //* * * * 1 2 3 上个月的日历，如果存在
      while (day_num > 0) {
        date_select_.setDate(date_select_.getDate() - 1);
        before_arr.unshift({
          type: "before",
          value: date_select_.getDate(),
          date: date_select_.format("YYYY-MM-DD"),
        });
        day_num--;
        box_num++;
      }
      //month 当前日历数组
      while (date_select.getMonth() === mon) {
        current_month_arr.push({
          value: date_select.getDate(),
          type: "current",
          date: date_select.format("YYYY-MM-DD"),
        });
        date_select.setDate(date_select.getDate() + 1);
        box_num++;
      }

      //下月补齐 27 28 29 39 * * *
      if (getDay(date_select) !== 0) {
        let num = getDay(date_select);
        for (let i = num; i < 7; i++) {
          after_arr.push({
            value: i - num + 1,
            type: "after",
            date: date_select.format("YYYY-MM-DD"),
          });
          date_select.setDate(date_select.getDate() + 1);
          box_num++;
        }
      }
      if (box_num < 42) {
        for (let i = 0; i < 7; i++) {
          after_arr.push({
            value: date_select.getDate(),
            type: "after",
            date: date_select.format("YYYY-MM-DD"),
          });
          date_select.setDate(date_select.getDate() + 1);
        }
      }
      return [...before_arr, ...current_month_arr, ...after_arr];
    });
    let isActive = computed(() => {
      let year_value = year.value;
      let month_value = month.value;
      let date = new Date();
      return year_value === date.getFullYear() && month_value === date.getMonth() + 1;
    });
    const clickHandle = (event) => {
      if (event.target.tagName === "SPAN") {
        let day = event.target.dataset.value || "";
        console.log(year.value, month.value, +day);
        selectedDate.value = {
          year: year.value,
          month: month.value,
          day: +day,
        };
        emit("date-select", {
          year: year.value,
          month: month.value,
          day: +day,
        });
      }
    };
    return {
      weeks,
      daysArr,
      isActive,
      clickHandle,
      selectedDate,
    };
  },
  methods: {
    mouseover(event) {
      if (currentEle) return;
      if (event.target.tagName === "SPAN") {
        event.target.classList.add("select");
        currentEle = event.target;
      }
    },
    mouseout(event) {
      if (!currentEle) return;
      if (event.target.tagName === "SPAN") {
        currentEle.classList.remove("select");
        currentEle = null;
      }
    },
    toToday() {
      this.$emit("date-select", {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      });
    },
  },
  computed: {
    initDate() {
      return {
        year: this.year,
        month: this.month,
        day: this.day,
      };
    },
  },
};
</script>

<style scoped lang="scss">
$width: 40px;
$height: 40px;

.date-content {
  padding: 10px;
  width: 310px;
  box-sizing: border-box;
  border-right: 1px solid var(--color-border);

  .date-content-in {
    span {
      display: inline-block;
      width: $width;
      line-height: $height;
      height: $height;
      text-align: center;
      box-sizing: border-box;
      cursor: pointer;
      border: 1px solid transparent;
      color: var(--color-text);
      font-size: 14px;

      &.disable {
        color: var(--color-disabled);
        pointer-events: none;
      }
    }

    .date-weeks {
      span {
        color: var(--color-disabled);
      }
    }

    span[data-type="before"],
    span[data-type="after"] {
      color: var(--color-disabled);
      pointer-events: none;
    }

    span[data-type="current"] {
      &.active {
        border-radius: 50%;
        border: 1px solid var(--color-primary);
      }
    }

    .select {
      color: var(--color-text-selected);
      background: var(--color-background-active);
      border-radius: 50%;
    }

    .selected {
      background: var(--color-primary);
      color: #fff;
      border-radius: 50%;
    }

    .today {
      font-size: 13px;
      color: var(--color-primary);
      padding: 5px;
      cursor: pointer;
      text-align: right;
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
