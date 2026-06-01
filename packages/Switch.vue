<template>
  <div class="rock_switch" @click="change" :class="[classText,disabled?'disabled':'']">
    <slot name="content">
      <span class="open" v-show="value_" :class="value_?'textLeft':''">{{ text[0] }}</span>
      <div class="icon">
        <!-- <div class="line"></div> -->
        <div class="circle"></div>
      </div>
      <span class="close" v-show="!value_">{{ text[1] }}</span>
    </slot>
  </div>
</template>

<script>
import SvgIcon from './svgIcon.vue';
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Array,
      default: () => ["启用", "禁用"],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isAuto:{
      type: Boolean,
      default: true,
    }
  },
  components:{SvgIcon},
  watch: {
    value(val) {
      this.value_ = val;
    },
  },
  computed: {
    classText() {
      return this.value_ ? "open" : "";
    },
  },
  data() {
    return {
      value_: false,
    };
  },
  methods: {
    change() {
      //如果从调用层控制
      if(!this.isAuto){
        return;
      }
      this.value_ = !this.value_;
      this.$emit("update:value", this.value_);
      this.$emit("update:modelValue", this.value_);
      this.$emit("change", this.value_);
      this.$emit("input", this.value_);
    },
    reset() {
      this.value_ = this.modelValue||this.value;
    },
  },
  mounted() {
    this.value_ = this.modelValue||this.value;
  },
};
</script>

<style scoped lang="scss">
.rock_switch {
  display: inline-block;
  width: 40px;
  height: 16px;
  background-color: #818181;
  border-radius: 12px;
  font-size: 12px;
  line-height: 16px;
  vertical-align: middle;
  &.disabled{
    pointer-events: none;
  }

  span {
    color: #ffffff;
    letter-spacing: 1px;
  }
  span.open {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 12px;
    transform: scale(0.8);
    text-align: center;
  }
  span.textLeft{
    text-indent:2px;
  }
  span.close {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 12px;
    transform: scale(0.8);
  }
  .icon {
    position: relative;
    width: 100%;
    height: 16px;
    .circle {
      position: absolute;
      left: 0;
      top: 50%;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #ffffff;
      transform: translateY(-50%);
      transition: 0.5s;
    }
  }

  &.open {
    background: var(--color-primary);
    .circle {
      left: calc(100% - 14px);
    }
    span {
      color: #ffffff;
    }
  }
}
</style>
