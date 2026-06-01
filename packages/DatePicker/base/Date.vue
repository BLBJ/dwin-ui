<template>
  <div class="container">
    <DataHeader :year="year" :month="month" :selectType="selectType" @date-change-prev="prev" @date-change-next="next"
      @to-select-month="toSelectMonth" @to-select-year="toSelectYear"></DataHeader>
    <DateContent :picker="picker" :year="year" :month="month" :day="day" :date="value" v-bind="$attrs" v-if="picker === 'date' && !isShowSelectPanel"
      :disabled-date="disabledDate"></DateContent>
    <DateSelect :year="year" :month="month" :selectType="selectType" @select-month="selectMonth" @select-year="selectYear"
      v-if="isShowSelectPanel" :disabled-date="disabledDate"></DateSelect>
  </div>
</template>

<script>
import DataHeader from "./DateHeader.vue";
import DateContent from "./DateContent.vue";
import DateSelect from "./DateSelect.vue";
export default {
  components: { DataHeader, DateContent, DateSelect },
  props: {
    value: {
      type: Object,
      dafault: () => {
        return {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate(),
        };
      },
    },
    showTime: {
      type: Boolean,
      default: false,
    },
    disabledDate: {
      type: Function,
      default: () => false
    },
    picker: {
      type: String,
      default: 'date'
    },
  },
  data() {
    return {
      year: this.value.year,
      month: this.value.month,
      day: this.value.day,
      isShowSelectPanel: false,
      selectType: "day",
    };
  },
  watch: {
    value() {
      this.year = this.value.year;
      this.month = this.value.month;
      this.day = this.value.day;
    },
  },
  mounted() {
    if (!this.value) {
      this.year = new Date().getFullYear();
      this.month = new Date().getMonth() + 1;
      this.day = new Date().getDate();
    }

    if (this.picker === 'month') {
      this.toSelectMonth()
    }
    if (this.picker === 'year') {
      this.toSelectYear()
    }
  },
  methods: {
    toSelectMonth() {
      this.isShowSelectPanel = true;
      this.selectType = "month";
    },
    toSelectYear() {
      this.selectType = "year";
      this.isShowSelectPanel = true;
    },
    selectMonth(val) {
      this.month = val;
      if (this.picker === 'year') {
        this.$emit("month-select", {
          year: this.year,
        });
      }
      if (this.picker === 'month') {
        !this.year && (this.year = new Date().getFullYear());
        this.$emit("month-select", {
          year: this.year,
          month: this.month,
        });
      }

      if (this.picker === 'date') {
        this.selectType = "day";
        this.$emit("date-select", {
          year: this.year,
          month: this.month,
        });
      }
      this.isShowSelectPanel = false;

    },
    selectYear(val) {
      this.year = val;
      this.selectType = "month";
      this.$emit("date-select", {
        year: this.year,
        month: this.month,
      });
    },
    prev() {
      if (this.selectType === "month") {
        this.year--;
      } else if (this.selectType === "year") {
        this.year -= 12;
      } else {
        if (this.month === 1) {
          this.month = 12;
          this.year--;
        } else {
          this.month--;
        }
      }
    },
    next() {
      if (this.selectType === "month") {
        this.year++;
      } else if (this.selectType === "year") {
        this.year += 12;
      } else {
        if (this.month === 12) {
          this.month = 1;
          this.year++;
        } else {
          this.month++;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .container{
    transition: 0.2s all;
  }
</style>
