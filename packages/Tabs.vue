<template>
  <div class="tabs_nav_wrap">
    <div class="tab_list">
      <span class="tab_nav" v-show="!item.hidden" v-for="(item) in list" @click.stop="handleActive(item)"
        :class="active == item.value ? 'active' : ''">
        {{ item.label }}
      </span>
    </div>
    <div class="tab_content">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
import { toRef, toRefs, provide, ref } from 'vue';

const props = defineProps(['active']);
const emit = defineEmits(['update:active', 'tabClick'])
const { active } = toRefs(props);
const currentName = active;
const list = ref([]);
const addPane = (obj) => {
  if (!list.value.find(ele => ele.value === obj.value)) {
    list.value.push(obj);
  }
}
const removePane = (obj) => {
  let idx = list.value.findIndex(ele => ele.value === obj.value);
  if (idx >= 0) {
    list.value.splice(idx, 1);
  }
}
provide('tabs', {
  props,
  currentName,
  addPane,
  removePane,
})

const handleActive = (item) => {
  if (['string', 'number'].includes(typeof item.value) && item.value !== active.value) {
    emit('update:active', item.value)
    emit('tabClick', item.value)
  }
}
</script>

<style scoped lang="scss">
.tabs_nav_wrap {
  width: 100%;
  height: 100%;
  text-align: left;
  border-radius: 2px 2px 0 0;
  border-collapse: collapse;

  .tab_list {
    width: 100%;
    height: 37px;
    overflow-y: hidden;
    border-bottom: 1px solid var(--color-border);
    box-sizing: border-box;
    overflow-x: auto;
    white-space: nowrap;

    .tab_nav {
      padding: 12px 24px;
      // margin: 0 0 0 32px;
      font-size: 13px;
      margin-right: 32px;
      cursor: pointer;
      display: inline;
      // float: left;
    }

    .active {
      border-bottom: 3px solid var(--color-primary);
      color: var(--color-primary);
      font-weight: 600;
      text-shadow: 0 0 0.25px #1890ff;
    }
  }

  .tab_content {
    clear: both;
    padding: 10px 0;
  }
}</style>
