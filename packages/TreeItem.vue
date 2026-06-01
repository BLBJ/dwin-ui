<template>
  <div class="treeItem">
    <div class="title">
      <span class="tree_label" @click.stop="expandChange(data_)">
        <svg-icon v-show="data_.children &&
          data_.children.length &&
          !expandKeys.includes(data_.key)
          " name="caret-right"></svg-icon>
        <svg-icon v-show="data_.children &&
          data_.children.length &&
          expandKeys.includes(data_.key)
          " name="caret-down"></svg-icon>
      </span>
      <div class="checkwrap" v-show="checkable" :class="{ disabled: data_.disabled }">
        <svg-icon class="checkbox" :disabled="data_.disabled" v-if="currentChecks.includes(data_.value)" name="check"
          @click.stop="labelCheckClick(2, data_.value)"></svg-icon>
        <svg-icon class="checkbox" :disabled="data_.disabled" @click.stop="labelCheckClick(1, data_.value)"
          v-else-if="currentChecksNotAll.includes(data_.value)" name="minus"></svg-icon>
        <span class="checkbox noCheck" @click.stop="labelCheckClick(0, data_.value)" v-else>
        </span>
      </div>
      <span class="title_text" :class="{ active: currentKey.includes(data_.value), disabled: data_.disabled }"
        @contextmenu.prevent="contextmenu" @click.stop="labelClick({ ...data_})" :data-value="data_.value">
        <slot name="label" :data="data_"> {{ data_.title.trim() || "--" }} </slot>
      </span>
    </div>

    <ul v-show="expandKeys.includes(data_.key)">
      <li v-for="(item, index) in data_.children" :key="index" :class="{ bottomNodeRow: checkBottomNode(item) }">
        <TreeItem v-bind="$attrs" :label-key="labelKey" :value-key="valueKey" :value-key-fn="valueKeyFn"
          :label-key-fn="labelKeyFn" :currentKey="currentKey" :checkable="checkable" :currentChecks="currentChecks"
          :currentChecksNotAll="currentChecksNotAll" :expandKeys="expandKeys" :checkBottomNodeFn="checkBottomNodeFn"
          :isDisableSelect="isDisableSelect" :data="{
            check: 0,
            selectable:true,
            ...item,
            isOpen: isDeafultOpen,
            title: getLabel(item),
            value: getValue(item),
            label: item.title || item[labelKey],
            key: data_.key + '_' + (index + 1),
            level:
              (data_.key + '_' + (index + 1)).split('_').length ||
              item['level'],
             isLeaf: !(item.children && item.children.length)
          }">
          <template #label="{ data }">
            <slot name="label" :data="data"></slot>
          </template>
        </TreeItem>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import SvgIcon from './svgIcon.vue';
let props = defineProps([
  "data",
  "labelKey",
  "currentKey",
  "valueKey",
  "labelKeyFn",
  "valueKeyFn",
  "isDeafultOpen",
  "checkable",
  "currentChecks",
  "checkBottomNodeFn",
  "isDisableSelect",
  "expandKeys",
  "currentChecksNotAll",
]);
const emit = defineEmits();
let data_ = ref(props.data);
watch(()=>props.data,(val)=>{
  data_.value = val;
})
const labelClick = (item) => {
  // console.log(item.value);
  if (props.isDisableSelect) return;
  if(!item.selectable) return;
  emit("selectChange", item.value);
  emit("change", { ...item, children: [] });
};

const contextmenu = (event) => {
  let page = [event.pageX, event.pageY];
  emit("contextmenu_", page, data_.value, data_.level_);
};

const labelCheckClick = (type, value) => {
  emit("checkChange", type, +value);
  data_.check = type;
};
const checkBottomNode = (data) => {
  if (
    props.checkBottomNodeFn &&
    typeof props.checkBottomNodeFn === "function"
  ) {
    return props.checkBottomNodeFn(data);
  }
  return false;
};

const expandChange = (data_) => {
  emit("expandChange", data_.key);
};

function getValue(item) {
  if (props.valueKeyFn) {
    return props.valueKeyFn(item)
  }
  if (props.valueKey) {
    return item[props.valueKey]
  }
  return item.id || item.value

}

function getLabel(item) {
  if (props.labelKeyFn) {
    return props.labelKeyFn(item)
  }
  if (props.labelKey) {
    return item[props.labelKey]
  }
  return item.title || '未知项'
}
</script>

<style lang="scss" scoped>
.treeItem {
  clear: both;

  >ul {
    margin-bottom: 0;
    margin-top: 0;

    >li {
      list-style: none;
      margin: 0;
    }
  }

  .tree_label {
    display: inline-block;
    width: 14px;
  }

  .title {
    min-height: 32px;
    line-height: 32px;
    display: flex;
    align-items: center;

    >span {
      display: inline-block;
      cursor: pointer;
      line-height: 24px;
    }

    .title_text {
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: var(--color-text);
      padding: 0 8px;

      &:hover {
        color: var(--color-text-hover);
      }

      &.active {
        background: var(--color-primary);
        color: #ffffff;
      }

      &.disabled {
        color: rgba(0, 0, 0, 0.25);
        cursor: not-allowed;
      }
    }
  }

  .checkwrap {
    display: inline-flex;

    &.disabled {
      color: rgba(0, 0, 0, 0.25);
      cursor: not-allowed;

      >span {
        background-color: #b9b9b9;
        pointer-events: none;
      }

    }
  }

  .checkbox {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    direction: ltr;
    background-color: var(--color-primary);
    border: 1px solid var(--color-border);
    border-radius: 2px;
    border-collapse: separate;
    transition: all 0.3s;
    cursor: pointer;
    color: #fff !important;

    &.noCheck {
      background-color: transparent;
      border-width: 2px;
    }

    >span {
      color: #fff !important;
      line-height: 16px;
    }
  }

  .bottomNodeRow {
    display: inline-block;
  }


}
</style>
