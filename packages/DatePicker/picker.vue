<template>
  <div
    class="d_date_select"
    data-name="d_date_select"
    :style="{ width: width + 'px' }"
    :data-error="error"
    :class="{ error: error, disabled: disabled }"
  >
    <div
      class="input"
      :class="{ active: isShowPanel, placeholderStyle: !value }"
      @mousedown="isShowPanel = !isShowPanel"
      tabindex="0"
      @blur="blur"
      @focus="()=>{}"
      @mouseenter="showClose"
      @mouseleave="isClose = false"
      ref="triggerEle"
    >
      {{ value ? formatFn(value) : placeholder }}
      <svg-icon
        v-show="isClose"
        @click.stop="reset"
        name="close"
        size="14"
        class="close"
      ></svg-icon>
      <svg-icon v-show="!isClose" name="calendar" size="14" class="close"></svg-icon>
    </div>
    <DropDown :triggerRef="triggerEle" :showPanel="isShowPanel" >
      <div class="dropdown">
        <DataPanel
          v-if="!showTime"
          :value="value_"
          @date-select="dateSelect"
          @month-select="dateSelect"
          :disabled-date="disabledDate"
          :picker="picker"
        ></DataPanel>
        <div class="picker-datetime-panel" v-if="showTime">
          <DataPanel
            :value="value_"
            @date-select="dateSelect"
            @month-select="dateSelect"
            :disabled-date="disabledDate"
            :picker="picker"
          ></DataPanel>
          <HmsTime
            v-model="time"
            @change="timeChange"
            :disabled-time="disabledTime"
            :date="value_"
            :localeFormat="timeFormat"
          ></HmsTime>
        </div>
        <div class="picker-footer" v-if="showTime">
          <span class="now text" @mousedown.prevent="toNow">此刻</span>
          <button
            class="btn"
            :class="{ disabled: !value_ || !time }"
            :disabled="!value_ || !time"
            @mousedown.prevent="submit"
          >
            确 定
          </button>
        </div>
      </div>
    </DropDown>
  </div>
</template>
<script setup>
import { ref } from "vue";
import DropDown from "../public/DropDown.vue";
const triggerEle = ref(null);
</script>

<script>
import DataPanel from "./base/Date.vue";
import { doubleNum } from "./base/util";
import HmsTime from "./base/hmsTime.vue";
import SvgIcon from "../svgIcon.vue";
export default {
  components: { SvgIcon, DataPanel, HmsTime },
  props: {
    picker: {
      type: String,
      default: "date",
    },
    format: {
      type: String,
      default: "YYYY-MM-DD",
    },
    timeFormat: {
      type: String,
      default: "hh:mm:ss",
    },
    width: [Number, String],
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "请选择日期",
    },
    error: "",
    showTime: {
      type: Boolean,
      default: false,
    },
    disabledDate: {
      type: Function,
      default: () => false,
    },
    disabledTime: {
      type: Function,
      default: () => false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    formatFn: {
      type: Function,
      default: (value) => value,
    },
  },
  data() {
    return {
      isShowPanel: false,
      value: this.modelValue,
      value_: {},
      isClose: false,
      time: "",
    };
  },
  mounted() {
    // this.on_body_event();
    if (this.modelValue) {
      this.dateHandle();
    } else {
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      this.value_ = { year, month, day };
    }
  },
  watch: {
    modelValue(val) {
      if (!val) {
        return;
      }
      if (this.value === val) return;
      this.dateHandle();
      this.resetValue(this.value_);
    },
  },
  methods: {
    blur() {
      this.isShowPanel = false;
      console.log("失去焦点");
    },
    dateHandle() {
      let year, month, day;
      let date = new Date(this.modelValue);
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
      this.value_ = { year, month, day };
      if (this.modelValue.split(" ")[1]) {
        this.time = this.modelValue.split(" ")[1];
      } else {
        let date = new Date();
        this.time =
          doubleNum(date.getHours()) +
          ":" +
          doubleNum(date.getMinutes()) +
          ":" +
          doubleNum(date.getSeconds());
      }
    },
    resetValue({ year, month, day }) {
      let FORMAT = this.format;
      if (this.picker === "year") {
        FORMAT = "YYYY";
      }
      this.value = FORMAT.replace("YYYY", year)
        .replace("MM", doubleNum(month))
        .replace("DD", doubleNum(day));
      if (this.showTime) {
        this.value = this.value + " " + this.time;
      }
    },

    toNow() {
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      this.value_ = { year, month, day };
      if (this.showTime) {
        let date = new Date();
        this.time =
          doubleNum(date.getHours()) +
          ":" +
          doubleNum(date.getMinutes()) +
          ":" +
          doubleNum(date.getSeconds());
      }
      this.resetValue(this.value_);
      this.submit();
    },
 
    dateSelect({ year, month = "", day = "" }) {
      if (year) {
        this.value_.year = year;
      }
      if (month) {
        this.value_.month = month;
      }
      if (day) {
        this.value_.day = day;
      }
      this.resetValue(this.value_);

      if (!this.showTime) {
        this.isShowPanel = false;
        this.$emit("update:modelValue", this.value);
        this.$emit("date-change", {
          ...this.value_,
          format: this.value,
        });
      } else {
        this.$emit("update:modelValue", this.value);
        this.$emit("date-change", {
          ...this.value_,
          format: this.value,
        });
      }
    },

    timeChange() {
      console.log(this.time);
      this.resetValue(this.value_);
    },
    showClose() {
      if (this.modelValue) {
        this.isClose = true;
      }
    },
    reset() {
      this.value = "";
      this.value_ = {};
      if (this.showTime) this.time = "";
      this.$emit("update:modelValue", "");
    },
    submit() {
      let { year, month, day } = this.value_;
      this.$emit("update:modelValue", this.value);
      this.$emit("date-change", {
        year,
        month,
        day,
        time: this.time,
        format: this.value,
      });
      this.isShowPanel = false;
    },
  },
 
};
</script>

<style lang="scss" scoped>
.d_date_select {
  position: relative;
  display: inline-block;

  > .input {
    position: relative;
    width: 100%;
    min-width: 100px;
    height: 32px;
    line-height: 32px;
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: 2px;
    outline: none;
    padding-left: 11px;
    font-size: 14px;
    cursor: pointer;

    &.active {
      border: 1px solid var(--color-primary);
    }

    > .close {
      position: absolute;
      right: 5px;
      top: 0;
      bottom: 0;
    }
  }

  &.error {
    border: 1px solid var(--color-error);
  }

  &.error:after {
    content: attr(data-error);
    position: absolute;
    bottom: -22px;
    left: 0;
    z-index: 100;
    color: var(--color-error);
    font-size: 12px;
    width: max-content;
  }

  .placeholderStyle {
    color: var(--color-text-ploceholder);
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
    border: 1px solid var(--color-text-disabled);
    > .input {
      > .close {
        pointer-events: none !important;
        opacity: 0.5;
        cursor: auto;
        color: var(--color-text-disabled);
      }
    }
  }
}
.dropdown { 
    background: var(--color-background);
    box-shadow: 0 2px 7px rgba(117, 117, 117, 0.15);
  .picker-datetime-panel {
    display: flex;
  }

  .picker-footer {
    border-top: 1px solid var(--color-border);
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    font-size:14px;
    .now {
      cursor: pointer;
    }

    button {
      color: #ffffff;
      background: var(--color-primary);
      font-size: 14px;
      border: none;
      cursor: pointer;
      &.disabled {
        cursor: not-allowed;
        background-color: rgb(137, 137, 137);
        color: #494949;
      }
    }
  }
}
</style>
