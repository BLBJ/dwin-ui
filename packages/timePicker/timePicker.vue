<template>
  <div
    class="d_date_select"
    data-name="d_date_select"
    :style="{ width: width + 'px' }"
    :data-error="error"
    :class="{ error: error }"
  >
    <div
      class="input"
      :class="{ active: isShowPanel, placeholderStyle: value == placeholder }"
      @mousedown="inputClick"
      tabindex="0"
      @blur="inputBlur"
      @mouseleave="isClose = false"
    >
      <span>{{ label || placeholder }}</span>
    </div>
    <svg-icon
      v-show="isClose"
      @click.stop="reset"
      name="close"
      size="14"
      class="close"
    ></svg-icon>
    <svg-icon
      v-show="!isClose"
      @mouseenter="showClose"
      name="calendar"
      size="14"
      class="close"
    ></svg-icon>
    <div class="dropdown" v-show="isShowPanel">
      <div class="picker-datetime-panel">
        <HmsTime
          ref="hms"
          v-model="value"
          :localeFormat="format"
          @change="timeChange"
          :disabled-time="disabledDate"
        >
        </HmsTime>
      </div>
      <div class="picker-footer">
        <span class="now text" @mousedown.prevent="toNow">此刻</span>
        <button
          class="btn"
          :class="{ disabled: !label }"
          :disabled="!label"
          @mousedown.prevent="submit"
        >
          确 定
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { doubleNum } from "./base/util";
import HmsTime from "./base/hmsTime.vue";
import SvgIcon from "../svgIcon.vue";
export default {
  components: { SvgIcon, HmsTime },
  props: {
    picker: {
      type: String,
      default: "date",
    },
    format: {
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
      default: "请选择时间",
    },
    error: "",
    disabledDate: {
      type: Function,
      default: () => false,
    },
    disabled: {
      type: Function,
      default: () => false,
    },
  },
  data() {
    return {
      isShowPanel: false,
      value: this.modelValue,
      label: this.modelValue,
      isClose: false,
      showTime: true,
      originValue: this.modelValue,
    };
  },
  mounted() {
    // this.on_body_event();
    if (this.modelValue) {
      this.value = this.modelValue || this.placeholder;
      this.originValue = this.modelValue;
    }
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.value = val;
        this.label = val;
        this.originValue = val;
        return;
      }
    },
  },
  methods: {
    on_body_event() {
      window.addEventListener("click", this.eventHandle);
    },

    initTime() {
      this.value = this.format
        .replace("hh", "00")
        .replace("mm", "00")
        .replace("ss", "00");
    },
    inputClick() {
      this.isShowPanel = !this.isShowPanel;
    },
    inputBlur() {
      this.isShowPanel = false;
      this.label = this.originValue;
      this.$refs.hms.resetData();
    },
    toNow() {
      let date = new Date();
      if (this.showTime) {
        this.value = this.format
          .replace("hh", doubleNum(date.getHours()))
          .replace("mm", doubleNum(date.getMinutes()))
          .replace("ss", doubleNum(date.getSeconds()));
      }
      this.submit();
    },
    eventHandle(event) {
      if (event.target.closest(".dropdown")) return;
      this.isShowPanel = false;
    },

    timeChange(value) {
      this.label = value;
    },
    showClose() {
      if (this.value) {
        this.isClose = true;
      }
    },
    reset() {
      this.label = this.placeholder;
      this.value = "";
      this.$emit("update:modelValue", "");
      this.$refs.hms.resetData();
      this.originValue = "";
      // this.initTime();
    },
    submit() {
      this.$emit("update:modelValue", this.value);
      this.$emit("change", {
        time: this.value,
      });
      this.label = this.value;
      this.isShowPanel = false;
      console.log(this.value);
      this.originValue = this.value;
    },
  },
  beforeUnmount() {
    window.removeEventListener("click", this.eventHandle);
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
    text-align: left;

    &.active {
      border: 1px solid var(--color-primary);
    }
  }
  > .close {
    position: absolute;
    right: 5px;
    top: 0px;
    bottom: 0;
    z-index: 10;
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

  .dropdown {
    position: absolute;
    left: 0;
    top: calc(100% + 4px);
    z-index: 9999;
    display: inline-block;
    background: var(--color-background);
    box-shadow: 0 2px 7px rgba(117, 117, 117, 0.15);
  }

  .picker-datetime-panel {
    display: flex;
  }

  .picker-footer {
    border-top: 1px solid var(--color-border);
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;

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
