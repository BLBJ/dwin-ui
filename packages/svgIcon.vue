<template>
  <span
    class="icon-span"
    :style="{
      fontSize: size + 'px',
      color: color,
      'pointer-events': disabled ? 'none' : 'auto',
    }"
  >
    <svg class="svg-icon" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>
  </span>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "SvgIcon",
  props: {
    prefix: {
      type: String,
      default: "icon",
    },
    name: {
      type: String,
      required: true,
    },

    size: {
      type: String,
      default: "14",
    },
    color: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`);
    return { symbolId };
  },
});
</script>

<style scoped lang="scss">
.icon-span {
  color: var(--color-text);
  line-height: 0;
  display: inline-flex;
  align-items: center;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  &:hover {
    color: var(--color-text-hover);
  }
}

.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  // vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
