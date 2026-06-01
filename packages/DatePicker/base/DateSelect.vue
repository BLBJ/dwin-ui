<template>
  <div class="date-select-panel">
    <div class="month-content" @mousedown.prevent="clickHandle">
      <span v-for="v in list" :key="v" :data-value="v" :class="{
        selected: (v === month && initYear === year) || v === initYear,
        disabled: disabledFn(v),
      }"> {{ v }}{{ selectType === "month" ? "月" : "" }}</span>
    </div>
  </div>
</template>

<script>
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
    selectType: {
      type: String,
      default: "month",
    },
    disabledDate: {
      type: Function,
      default: () => false,
    },
  },
  data() {
    return {
      initYear: this.year,
    };
  },
  computed: {
    list() {
      if (this.selectType === "year") {
        return [...Array(12)].map((v, i) => i + this.year);
      }
      if (this.selectType === "month") {
        return [...Array(12)].map((v, i) => i + 1);
      }
      return [];
    },
  },
  methods: {
    clickHandle(event) {
      if (event.target.tagName === "SPAN") {
        let val = +event.target.dataset.value || NaN;
        this.$emit("select-" + this.selectType, val);
      }
    },
    disabledFn(v) {
      if (this.selectType === "month") return this.disabledDate(new Date(this.year, v-1))
      if (this.selectType === "year") return this.disabledDate(new Date(v,0))
    }
  },
};
</script>

<style lang="scss" scoped>
.date-select-panel {
  .month-content {
    padding: 10px;

    span {
      display: inline-block;
      width: 33.3%;
      line-height: 50px;
      text-align: center;
      box-sizing: border-box;
      border: 1px solid transparent;
      color: var(--color-text);
      cursor: pointer;

      &:hover {
        color: var(--color-text-hover);
        background: var(--color-background-hover);
      }

      &.disabled {
        color: #888;
        pointer-events: none;
        cursor: no-drop;
      }
    }

    .active {
      background: var(--color-primary);
      color: var(--color-text-active);
    }

    .select {
      color: var(--color-text-selected);
      background: var(--color-background-active);
    }

    .selected {
      border: 1px solid var(--color-primary);
    }
  }
}
</style>
