<template>
  <button class="d-button" :disabled='disabled' :class="{ ['d-' + type]: !!type, 'd-disabledBg': disabled }">
    <svg-icon class="action" v-if="icon" :name="icon" :color="iconColor"></svg-icon>
    <span :style="{color:textColor}">
      <slot>
        {{ text }}
      </slot>
    </span>
  </button>
</template>

<script setup>
import SvgIcon from './svgIcon.vue';
defineProps({
  type: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean
  },
  textColor:{
    type:String,
    default:''
  },
  icon: {
    type: String,
  },
  iconColor:{
    type:String,
    default:'#ffffff'
  },
  text: "",
});
</script>

<style lang="scss" scoped>
.d-button {
  // min-width: 88px;
  padding: 4px 15px;
  height: 32px;
  background: var(--color-primary);
  border-radius: 2px;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 1px;
  // box-sizing: border-box;

  // line-height: 1.5;
  // display: flex;
  // align-items: center;
  >span {
    display: inline-block;
  }

  >.action+span {
    margin-inline-start: 8px;
  }
}

.d-disabledBg {
  background: var(--map-tab-back) !important;
  cursor: no-drop;
}

.d-primary {
  background: var(--color-primary);
  color: #ffffff;
  border: 1px solid transparent;
}

.d-border {
  background: transparent;
  border: 1px solid var(--color-border);
  >span{
    color: var(--color-text);
  }
}

.d-text {
  background: transparent;
  border: 1px solid transparent;
  >span{
    color: var(--color-text);
  }
}

.d-warning {
  background: var(--color-warning);
  color: #ffffff;
  border: 1px solid transparent;
}

.d-success {
  background: var(--color-success);
  color: #ffffff;
  border: 1px solid transparent;
}

.d-error {
  background: var(--color-error);
  color: #ffffff;
  border: 1px solid transparent;
}
</style>
