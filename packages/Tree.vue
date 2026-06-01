<template>
  <div class="rock_tree_container" ref="tree_container" v-if="treeData_.length">
    <TreeItem v-bind="$attrs" v-for="(item, index) in treeData_" :label-key="labelKey" :value-key="valueKey" :key="index"
      :value-key-fn="valueKeyFn" :label-key-fn="labelKeyFn" :multiple="multiple" :currentKey="currentKey"
      :currentChecks="currentChecks" :currentChecksNotAll="currentChecksNotAll" :expandKeys="currentExpandKeys"
      :isDeafultOpen="isDeafultOpen" :checkable="checkable" :checkBottomNodeFn="checkBottomNodeFn"
      :isDisableSelect="isDisableSelect" :data="{
        isOpen: isDeafultOpen,
        check: 0,
        selectable:true,
        ...item,
        title: getLabel(item),
        value: getValue(item),
        label: item[labelKey] || item.title,
        key: index + 1 + '',
        level: (index + 1 + '').split('_').length || item['level'],
        isLeaf: !(item.children && item.children.length)
      }" @selectChange="selectChange" @contextmenu_="contextmenu" @checkChange="checkChange"
      @expandChange="expandChange">
      <template #label="{ data }">
        <slot name="label" :data="data"></slot>
      </template>
    </TreeItem>
    <div class="menuContent" :style="menuContentStyle">
      <slot name="rightMenu" :data="menuContentInfo"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from "vue";
import TreeItem from "./TreeItem.vue";
let props = defineProps([
  "treeData",
  "labelKey",
  "labelKeyFn",
  "valueKey",
  "valueKeyFn",
  "multiple",
  "isDeafultOpen",
  "mode",
  "checkable",
  "checkBottomNodeFn",
  "checkedKeys",
  "isDisableSelect",
  "expandKeys",
]);

let emits = defineEmits(["selectChange", "update:checkedKeys", "update:expandKeys"]);
let currentKey = ref([]);
let treeData_ = ref(props.treeData);
let tree_container = ref("null");

function getTreeDateWithParentFlat(list) {
  return list.reduce((pre, cur) => {
    if (cur.children && cur.children.length) {
      let values = Object.values(
        getTreeDateWithParentFlat(cur.children)
      ).reduce((v, c) => [...new Set([...c, ...v])], []);
      // console.log(values);
      pre[cur.value] = [cur.value, ...values];
      pre = { ...pre, ...getTreeDateWithParentFlat(cur.children) };
    } else {
      pre[cur.value] = [cur.value];
    }
    return pre;
  }, {});
}
function getParent(list) {
  return list.reduce((pre, cur) => {
    if (cur.children && cur.children.length) {
      pre[cur.value] = cur.children.map((c) => c.value);
      pre = { ...pre, ...getParent(cur.children) };
    } else {
      pre[cur.value] = [];
    }
    return pre;
  }, {});
}

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
let reTreeData = ref({});
let treeParent = ref({});

//右键功能
let menuContent = ref([]);
let menuContentInfo = ref({});
let menuContentStyle = computed(() => {
  return {
    left: menuContent.value[0] + "px",
    top: menuContent.value[1] + "px",
  };
});
const contextmenu = (page, info) => {
  // console.log(page, info);
  let [Childx, childy] = page;
  let { left, top } = tree_container.value.getBoundingClientRect();
  menuContent.value = [Childx - left, childy - top];
  menuContentInfo.value = info;
};
watch(
  () => props.treeData,
  (val) => {
    treeData_.value = [];
    nextTick(() => {
      treeData_.value = val;
      console.log(reTreeData.value)
      reTreeData.value = getTreeDateWithParentFlat(treeData_.value);
      console.log(reTreeData.value)
      treeParent.value = getParent(treeData_.value);
      initCurrentChecksNotAll();
      initCurrentChecks();
    });
  }, { immediate: true }
);

const selectChange = (key) => {
  if (props.mode === "multiple") {
    if (currentKey.value.includes(key)) {
      currentKey.value = currentKey.value.filter((item) => item !== key);
    } else {
      currentKey.value.push(key);
    }
  } else {
    currentKey.value = currentKey.value.includes(key) ? [] : [key];
  }
};

const reset = (val) => {
  currentKey.value = val;
};
defineExpose({ reset });

//勾选
const currentChecks = ref(props.checkedKeys || []);
watch(
  () => props.checkedKeys,
  (val) => {
    currentChecks.value = val;
    initCurrentChecks();
    initCurrentChecksNotAll();
  }
);

const currentChecksNotAll = ref([]);
const initCurrentChecksNotAll = () => {
  currentChecksNotAll.value = []
  Object.entries(reTreeData.value).forEach(([key, value]) => {
    value.forEach((v) => {
      if (currentChecks.value.includes(v)) {
        if (!currentChecksNotAll.value.includes(+key)) {
          currentChecksNotAll.value.push(+key);
        }
      }
    });
  });
};

//初始化 
function initCurrentChecks() {
  Object.entries(treeParent.value).forEach(([key, value]) => {
    if (
      value.length &&
      value.every((v) => currentChecks.value.includes(v)) &&
      !currentChecks.value.includes(+key)
    ) {
      currentChecks.value = [...new Set([...currentChecks.value, +key])];
    }
  });
}

// watch(
//   () => currentChecks.value,
//   (val, oldVal) => {
//     if(val.length === oldVal.length) return;
//     if (val.length > oldVal.length) {
//       Object.entries(treeParent.value).forEach(([key, value]) => {
//         if (
//           value.length &&
//           value.every((v) => currentChecks.value.includes(v)) &&
//           !currentChecks.value.includes(+key)
//         ) {
//           currentChecks.value = [...new Set([...currentChecks.value, +key])];
//         }
//       });
//     } else {
//       Object.entries(treeParent.value).forEach(([key, value]) => {
//         if (
//           value.length &&
//           value.some((v) => !currentChecks.value.includes(v)) &&
//           currentChecks.value.includes(+key)
//         ) {
//           currentChecks.value = currentChecks.value.filter((c) => c !== +key);
//         }
//       });
//     }
//   }
// );

const checkChange = (type, value) => {
  let checks = reTreeData.value[value];
  console.log(checks);
  if (type === 1 || type === 0) {
    currentChecks.value = [...new Set([...currentChecks.value, ...checks])];
    // console.log(currentChecks.value);
    Object.entries(treeParent.value).forEach(([key, value]) => {
      if (
        value.length &&
        value.every((v) => currentChecks.value.includes(v)) &&
        !currentChecks.value.includes(+key)
      ) {
        currentChecks.value = [...new Set([...currentChecks.value, +key])];
      }
    });
  } else {
    currentChecks.value = currentChecks.value.filter(
      (c) => !checks.includes(c)
    );
    Object.entries(treeParent.value).forEach(([key, value]) => {
      if (
        value.length &&
        value.some((v) => !currentChecks.value.includes(v)) &&
        currentChecks.value.includes(+key)
      ) {
        currentChecks.value = currentChecks.value.filter((c) => c !== +key);
      }
    });
  }
  emits("update:checkedKeys", currentChecks.value);
  console.log(currentChecks.value)
  currentChecksNotAll.value = [];
  initCurrentChecksNotAll();
};

//展示状态管理
const currentExpandKeys = ref(props.expandKeys || []);
const expandChange = (key) => {
  if (currentExpandKeys.value.includes(key)) {
    currentExpandKeys.value = currentExpandKeys.value.filter(
      (item) => item !== key
    );
  } else {
    currentExpandKeys.value.push(key);
  }
  emits("update:expandKeys", currentExpandKeys.value);
};
</script>

<style lang="scss" scoped>
.rock_tree_container {
  position: relative;
}

.menuContent {
  position: absolute;
}
</style>
