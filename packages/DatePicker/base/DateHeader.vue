<template>
  <div @mousedown.prevent="clickHandle" class="header">
    <span class="title" v-show="selectType === 'day'" data-type="select_day">{{ year }}年 {{ month }}月</span>
    <span class="title" v-show="selectType === 'month'" data-type="select_month">{{ year }}年
    </span>
    <span class="title" v-show="selectType === 'year'" data-type="select_year">{{ year }}-{{ year + 11 }}
    </span>
    <span class="arrow" data-type="select_prev">
      <svgIcon name="left"></svgIcon>
    </span>


    <span class="arrow" data-type="select_next">
      <svgIcon name="right"></svgIcon>
    </span>
  </div>
</template>

<script>
import { ref, computed, watch, toRefs } from "vue";
import svgIcon from "../../svgIcon.vue";
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
      default: "day",
    },
  },
  components:{svgIcon},
  data() {
    return {};
  },
  setup(props, { emit }) {
    const prev = () => {
      emit("date-change-prev");
    };
    const next = () => {
      emit("date-change-next");
    };
    const clickHandle = (event) => {
      let target = event.target.closest('span[data-type]');
      if (!target) return;
      const TYPE = target.dataset.type || "";
      switch (TYPE) {
        case "select_prev":
          prev();
          break;
        case "select_next":
          next();
          break;
        case "select_day":
          emit("to-select-month");
          break;
        case "select_month":
          emit("to-select-year");
          break;
        default:
          break;
      }
    };
    return {
      next,
      prev,
      clickHandle,
    };
  },
};
</script>

<style scoped lang="scss">
.header {
  text-align: center;
  user-select: none;
  border-bottom: 1px solid var(--color-border);
  padding: 0 10px;
  min-width: 250px;
  border-right: 1px solid var(--color-border);

  span {
    line-height: 30px;
    padding: 0 10px;
    color: var(--color-text);
    font-size: 17px;
    cursor: pointer;
  }

  .title {
    display: inline-block;

    background: transparent;
    margin-right: 5px;
  }

  .arrow {
    color: var(--color-text);

    &:hover {
      color: var(--color-text-hover);
    }
  }
}</style>
