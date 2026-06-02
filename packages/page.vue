<template>
  <div class="d_page_container">
    <div class="total" v-show="isShowTotal">总数： {{ total }}</div>
    <ul>
      <li name="left" @click="prev">
        <svg-icon name="left"></svg-icon>
      </li>
      <li
        :class="{ active: activePage === 1 }"
        @click="pageChange(1)"
        :title="1"
      >
        1
      </li>
      <li v-show="pageList_[0] > 2">
        <!-- <img src="./icons/paging_ic_morebtn_def.svg" alt="" /> -->
        ...
      </li>
      <li
        :title="n"
        @click="pageChange(n)"
        :class="{ active: activePage === n }"
        v-for="(n, i) in pageList_"
        :key="i"
      >
        {{ n }}
      </li>
      <li v-show="pageArr.length - pageList_[pageList_.length - 1] > 1">...</li>
      <li
        v-show="pageArr.length > maxPage"
        :class="{ active: activePage === pageArr.length }"
        @click="pageChange(pageArr.length)"
      >
        {{ pageArr.length }}
      </li>
      <li name="right" @click="next">
        <svg-icon name="right"></svg-icon>
      </li>
    </ul>
    <div ref="triggerEle" class="pageSizeSelect" @click.stop="showPageSelect = !showPageSelect">
      {{ pageSize_ }}条/页
      <img src="./icons/lk_ic_inputxiala_def.svg" alt="" />
    </div>
    <DropDown :triggerRef="triggerEle" :showPanel="showPageSelect" :offsetY="0">
      <ul class="selectPageList">
        <li v-for="item in pageSizeOptions" :key="item" @click="setPageSize(item)">{{item}}条/页</li>
      </ul>
    </DropDown>
  </div>
</template>

<script setup>
import SvgIcon from './svgIcon.vue';
import {watch, ref, computed, onMounted } from "vue";
import DropDown from "./public/DropDown.vue";
const triggerEle = ref(null);
let props = defineProps({
  "total":"",
  "modelValue":"",
  "pageSize":"",
  "isShowTotal":"",
  "maxpages":"",
  "pageSizeOptions":{
    "type":Array,
    "default":[10,20,30,50]
  }
});
let emits = defineEmits([
  "update:modelValue",
  "update:pageSize",
  "pageSizeChange",
  "pageChange",
]);

let maxPage = ref(props.maxpages || 6);
let pageSize_ = ref(props.pageSize || 10);
let activePage = ref(props.modelValue || 1);
const showPageSelect = ref(false);
let pageArr = computed(() =>
  [...Array(Math.ceil(props.total / pageSize_.value))].map((c, i) => i + 1)
);
let pageList_ = computed(() => {
  if (pageArr.value.length <= maxPage.value) {
    return pageArr.value.slice(1, maxPage.value);
  } else {
    let lastArr = pageArr.value.slice(
      pageArr.value.length - 3,
      pageArr.value.length
    );
    let firstArr = pageArr.value.slice(0, 3);
    const getArrByCenter = (val) => [val - 2, val - 1, val, val + 1, val + 2];
    if (lastArr.includes(activePage.value)) {
      return pageArr.value.slice(
        pageArr.value.length - 5,
        pageArr.value.length - 1
      );
    }
    if (firstArr.includes(activePage.value)) {
      return pageArr.value.slice(1, maxPage.value - 1);
    }
    return getArrByCenter(activePage.value);
  }
});

const pageChange = (pageNum) => {
  activePage.value = pageNum;
  emits("update:modelValue", pageNum);
  emits("pageChange", pageNum);
};

const setPageSize = (val) => {
  pageSize_.value = val;
  emits("update:pageSize", val);
  emits("pageSizeChange", val);
};

const prev = () => {
  if (activePage.value === 1) return;
  activePage.value--;
  pageChange(activePage.value);
};

const next = () => {
  if (activePage.value === pageArr.value[pageArr.value.length - 1]) return;
  activePage.value++;
  pageChange(activePage.value);
};

onMounted(() => {
  document.addEventListener("click", () => {
    showPageSelect.value = false;
  });
});

watch(
  () => props.modelValue,
  (val) => {
    activePage.value = val;
  }
);
</script>

<style lang="scss" scoped>
.d_page_container {
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 20px 0;
  > ul {
    list-style: none;
    >li {
      float: left;
      width: 32px;
      height: 32px;
      cursor: pointer;
      text-align: center;
      line-height: 32px;
      font-size: 14px;
      color: var(--color-text);
      margin-right: 8px;
      margin-top: 0;
      margin-bottom: 0;
      &:hover {
        border: 1px solid var(--color-primary);
      }
      &.active {
        background: var(--color-primary);
        color: #ffffff;
      }
      &.active:hover {
        border: none;
      }
    }
    li[name="left"],
    li[name="right"] {
      background: var(--color-background);
    }
  }
  .total {
    padding: 0 8px;
    border-radius: 5px;
    line-height: 32px;
    background: var(--color-background-input);
    font-size: 14px;
  }
  .pageSizeSelect {
    position: relative;
    width: 90px;
    height: 32px;
    line-height: 32px;
    background: var(--color-background-input);
    margin-left: 20px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    font-size: 14px;
    cursor: pointer;
  }
}
.selectPageList{
  width: 90px;
  list-style: none;
  margin: 0;
  padding: 0;
  background: var(--color-background-input);
  line-height: 32px;
  li {
    width: 100%;
    font-size: 14px;
    padding-left: 10px;
    cursor: pointer;
    &:hover {
      background-color: var(--color-background-hover);
      color: var(--color-text-hover);
    }
  }
}
</style>
