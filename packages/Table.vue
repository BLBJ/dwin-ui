<template>
  <div class="d-table" :style="{ overflowX: scroll.x ? 'auto' : '', overflowY: scroll.y ? 'auto' : '' }">
    <div class="d-table-content" :style="{ width: width ? width + 'px' : '100%' }">
      <table
        :style="{
          tableLayout: columns.find((item) => item.width) ? 'fixed' : 'auto',
          width: scroll.x ? scroll.x + 'px' : '100%'
        }"
      >
        <colgroup>
          <col v-if="rowSelection_ !== null" :width="rowSelection_.width || 50" />
          <col v-for="item in columns" :key="item.key" :width="item.width" />
        </colgroup>
        <thead class="table-thead">
          <tr v-for="n in headerLevel" :key="n">
            <th v-if="rowSelection_ !== null">
              <label
                v-show="!rowSelection_.hideSelectAll && rowSelection_.isShowAllSelectBtn"
                class="checkbox-wrapper"
              >
                <span
                  class="checkbox"
                  v-show="
                    rowSelection_.selectedRowKeys &&
                    rowSelection_.selectedRowKeys.length === 0
                  "
                  @click.stop="selectAll"
                >
                </span>
                <svg-icon
                  class="checkbox check"
                  v-show="
                    rowSelection_.selectedRowKeys &&
                    rowSelection_.selectedRowKeys.length &&
                    rowSelection_.selectedRowKeys.length === data.length
                  "
                  name="check"
                  @click.stop="removeSelectAll"
                ></svg-icon>
                <svg-icon
                  class="checkbox check"
                  @click.stop="selectAll"
                  v-show="
                    rowSelection_.selectedRowKeys &&
                    rowSelection_.selectedRowKeys.length &&
                    rowSelection_.selectedRowKeys.length < data.length
                  "
                  name="minus"
                ></svg-icon>
              </label>
            </th>
            <th
              v-for="item in headerLevel === 1
                ? columns_
                : columns_.filter((item) => item.headerIndex == n)"
              :key="item.key"
              :rowspan="item.rowspan"
              :colspan="item.colspan"
              :class="{ filterTh: item.filters }"
            >
              <span>{{ item.title }}</span>
              <span
                class="sort"
                v-show="item.isSort"
                @click="sortClick(item)"
                :class="{ rotate: item.sort }"
              >
                <img src="./icons/lk_ic_sort_up.svg" alt="" />
                <img src="./icons/lk_ic_sort_down.svg" alt="" />
              </span>
              <span
                v-show="item.filters"
                class="dwin-ui-table-filter"
                @click="isShowPanelChange(item)"
                :ref="(el) => (triggerEle[item.key] = el)"
              >
                <svg-icon
                  name="filters"
                  class="filterIcon"
                  :color="filterCheck(item)"
                ></svg-icon>
              </span>
              <DropDown teleport="table" :triggerRef="triggerEle[item.key]" :showPanel="item.rowShow" :offsetY="0" @clickOutSide="filterSubmit(item)">
                <div
                  class="filter-footer"
                >
                  <div class="filter-list" v-if="item.filters.length">
                    <p
                      v-for="(itemt, valt) in item.filters"
                      :key="valt"
                      :class="{ 'filter-active': itemt.check }"
                    >
                      <!-- 单选 -->
                      <d-radio
                        v-if="item.mode == 'single'"
                        v-model:checked="itemt.check"
                        :value="itemt.value"
                        @update:checked="filterRadioChange(item.filters, itemt.value)"
                        >{{ itemt.text }}</d-radio
                      >
                      <!-- 多选 -->
                      <d-checkbox v-else v-model:checked="itemt.check">{{
                        itemt.text
                      }}</d-checkbox>
                    </p>
                  </div>
                  <div class="filter-list" v-if="!item.filters.length">暂无数据</div>
                  <div class="filter-submit">
                    <span @click="filterSubmit(item)">确定</span>
                    <span v-if="item.filtersReset" @click="filterReset(item)">重置</span>
                    <span v-if="item.filtersCancel" @click="filterCancel(item)">取消</span>
                  </div>
                </div>
              </DropDown>
            </th>
          </tr>
        </thead>
        <tbody v-if="!scroll.x && !scroll.y" ref="tbodyRef" class="table-tbody">
          <tr
            v-for="(item, index) in data_"
            :key="'d_' + index"
            @click="selectClick(index)"
            :class="[{ active: index === clickIndex }, 'row_level_' + item.rowLevel]"
            :data-row-key="item[rowKey]"
          >
            <td v-if="rowSelection_ !== null">
              <label class="checkbox-wrapper">
                <span
                  class="checkbox"
                  :class="{
                    check: rowSelection_.selectedRowKeys.includes(
                      rowSelection_.selectKey ? item[rowSelection_.selectKey] : index
                    ),
                    disabled: getCheckboxOptions(
                      item,
                      maxSelectNum,
                      rowSelection_.selectedRowKeys
                    ).disabled,
                  }"
                >
                  <input
                    type="checkbox"
                    :disabled="
                      getCheckboxOptions(
                        item,
                        maxSelectNum,
                        rowSelection_.selectedRowKeys
                      ).disabled
                    "
                    :name="
                      getCheckboxOptions(
                        item,
                        maxSelectNum,
                        rowSelection_.selectedRowKeys
                      ).name
                    "
                    :value="
                      rowSelection_.selectKey ? item[rowSelection_.selectKey] : index
                    "
                    v-model="rowSelection_.selectedRowKeys"
                    @change="checkChange"
                  />
                  <svg-icon class="checkout-inner" name="check"></svg-icon>
                </span>
              </label>
            </td>
            <template
              v-for="c in columns_
                .filter((item) => !item.hasChild)
                .sort((a, b) => a.rowIndex - b.rowIndex)"
            >
              <td
                v-if="showCell(c, item, index)"
                :key="c.key + '_' + item.index + '_' + c.index"
                @click.stop="tdClick(c, item)"
                :style="{
                  cursor: c.isClick ? 'pointer' : 'default',
                }"
                :class="{
                  'd-table-td-ellipsis': c.ellipsis,
                  'cell-with-append':
                    c.index === 0 && data_.find((v) => v.children && v.children.length),
                }"
                :text="item[c.key]"
                :rowspan="
                  c.customCell && c.customCell(item, index)
                    ? c.customCell(item, index).rowSpan
                    : ''
                "
                :colspan="
                  c.customCell && c.customCell(item, index)
                    ? c.customCell(item, index).colSpan
                    : ''
                "
              >
                <template
                  v-if="
                    c.index === 0 && data_.find((v) => v.children && v.children.length)
                  "
                >
                  <span
                    :class="['d-table-row-indent', 'indent-level-' + item.rowLevel]"
                    :style="{ paddingLeft: item.rowLevel * 16 + 'px' }"
                  ></span>

                  <svg-icon
                    v-if="!item.showChild && item.children && item.children.length"
                    name="plus-circle"
                    class="row-expand-icon"
                    @click="
                      item.showChild = true;
                      data_.splice(index + 1, 0, ...item.children);
                    "
                    size="14"
                    style="margin-right: 5px"
                  />
                  <svg-icon
                    v-if="item.showChild && item.children && item.children.length"
                    name="minus-circle"
                    class="row-expand-icon"
                    @click="
                      item.showChild = false;
                      data_.splice(index + 1, item.children.length);
                    "
                    size="14"
                    style="margin-right: 5px"
                  />
                  <span
                    class="row-expand-icon"
                    v-if="!item.children || !item.children.length"
                  ></span>
                </template>
                <slot
                  :name="c.key"
                  :index="index"
                  :column="c"
                  :row="item"
                  :text="item[c.key]"
                >
                  <span :class="{ 'd-table-cell-ellipsis': c.ellipsis }">
                    {{
                      item[c.key] !== "" && item[c.key] !== null
                        ? typeof c.format === "function"
                          ? c.format(item[c.key] || index + 1, index)
                          : reValue(item[c.key])
                        : "--"
                    }}
                  </span>
                </slot>
              </td>
            </template>
          </tr>
          <tr v-if="!data_.length">
            <td
              :colspan="columns_.length + (rowSelection_ !== null ? 1 : 0)"
              class="noData"
            >
              <span>
                <slot name="noDataText">暂无数据</slot>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="scroll.x || scroll.y"
        class="d-table-scroll"
        :style="{
          overflowY: 'auto',
          maxHeight: scroll.y + 'px',
          height: height ? height + 'px' : 'auto',
        }"
      >
        <table
          :style="{
            tableLayout: columns.find((item) => item.width) ? 'fixed' : 'auto',
          }"
        >
          <colgroup>
            <col v-if="rowSelection_ !== null" :width="rowSelection_.width || 50" />
            <col v-for="item in columns" :key="item.key" :width="item.width" />
          </colgroup>
          <tbody ref="tbodyRef" class="table-tbody">
            <tr
              v-for="(item, index) in data_"
              :key="'d_' + index"
              @click="selectClick(index)"
              :class="[{ active: index === clickIndex }, 'row_level_' + item.rowLevel]"
              :data-row-key="item[rowKey]"
            >
              <td v-if="rowSelection_ !== null">
                <label class="checkbox-wrapper">
                  <span
                    class="checkbox"
                    :class="{
                      check: rowSelection_.selectedRowKeys.includes(
                        rowSelection_.selectKey ? item[rowSelection_.selectKey] : index
                      ),
                      disabled: getCheckboxOptions(
                        item,
                        maxSelectNum,
                        rowSelection_.selectedRowKeys
                      ).disabled,
                    }"
                  >
                    <input
                      type="checkbox"
                      :disabled="
                        getCheckboxOptions(
                          item,
                          maxSelectNum,
                          rowSelection_.selectedRowKeys
                        ).disabled
                      "
                      :name="
                        getCheckboxOptions(
                          item,
                          maxSelectNum,
                          rowSelection_.selectedRowKeys
                        ).name
                      "
                      :value="
                        rowSelection_.selectKey ? item[rowSelection_.selectKey] : index
                      "
                      v-model="rowSelection_.selectedRowKeys"
                      @change="checkChange"
                    />
                    <svg-icon class="checkout-inner" name="check"></svg-icon>
                  </span>
                </label>
              </td>
              <template
                v-for="c in columns_
                  .filter((item) => !item.hasChild)
                  .sort((a, b) => a.rowIndex - b.rowIndex)"
              >
                <td
                  v-if="showCell(c, item, index)"
                  :key="c.key + '_' + item.index + '_' + c.index"
                  @click.stop="tdClick(c, item)"
                  :style="{
                    cursor: c.isClick ? 'pointer' : 'default',
                  }"
                  :class="{
                    'd-table-td-ellipsis': c.ellipsis,
                    'cell-with-append':
                      c.index === 0 && data_.find((v) => v.children && v.children.length),
                  }"
                  :text="item[c.key]"
                  :rowspan="
                    c.customCell && c.customCell(item, index)
                      ? c.customCell(item, index).rowSpan
                      : ''
                  "
                  :colspan="
                    c.customCell && c.customCell(item, index)
                      ? c.customCell(item, index).colSpan
                      : ''
                  "
                >
                  <template
                    v-if="
                      c.index === 0 && data_.find((v) => v.children && v.children.length)
                    "
                  >
                    <span
                      :class="['d-table-row-indent', 'indent-level-' + item.rowLevel]"
                      :style="{ paddingLeft: item.rowLevel * 16 + 'px' }"
                    ></span>

                    <svg-icon
                      v-if="!item.showChild && item.children && item.children.length"
                      name="plus-circle"
                      class="row-expand-icon"
                      @click="
                        item.showChild = true;
                        data_.splice(index + 1, 0, ...item.children);
                      "
                      size="14"
                      style="margin-right: 5px"
                    />
                    <svg-icon
                      v-if="item.showChild && item.children && item.children.length"
                      name="minus-circle"
                      class="row-expand-icon"
                      @click="
                        item.showChild = false;
                        data_.splice(index + 1, item.children.length);
                      "
                      size="14"
                      style="margin-right: 5px"
                    />
                    <span
                      class="row-expand-icon"
                      v-if="!item.children || !item.children.length"
                    ></span>
                  </template>
                  <slot
                    :name="c.key"
                    :index="index"
                    :column="c"
                    :row="item"
                    :text="item[c.key]"
                  >
                    <span :class="{ 'd-table-cell-ellipsis': c.ellipsis }">
                      {{
                        item[c.key] !== "" && item[c.key] !== null
                          ? typeof c.format === "function"
                            ? c.format(item[c.key] || index + 1, index)
                            : reValue(item[c.key])
                          : "--"
                      }}
                    </span>
                  </slot>
                </td>
              </template>
            </tr>
            <tr v-if="!data_.length">
              <td
                :colspan="rowSelection ? columns_.length + 1 : columns_.length"
                class="noData"
              >
                <span>
                  <slot name="noDataText">暂无数据</slot>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import DropDown from "./public/DropDown.vue";
const triggerEle=ref({});
</script>

<script>
import clickoutsides from "./utils/clickoutside.js";
import Checkbox from "./checkbox/Checkbox.vue";

//计算行层级
function calculateRowLevels(data, level = 0) {
  return data.map((item, index) => {
    item.rowLevel = level;
    if (!item.index) item.index = index + 1;
    if (item.children && item.children.length > 0) {
      item.children = calculateRowLevels(item.children, level + 1);
    }
    return item;
  });
}

export default {
  props: {
    columns: Array,
    data: Array,
    scroll: {
      type: Object,
      default: {
        x: "",
        y: "",
      },
    },
    width: {
      type: [Number, String],
      default: "",
    },
    height: {
      type: [Number, String],
      default: "",
    },
    addTypeNum: Number,
    lineClick: false,
    rowSelection: null,
    headerLevel: {
      type: Number,
      default: 1,
    },
    getCheckboxOptions: {
      type: Function,
      default: (v) => ({
        disabled: false,
        name: v.index,
      }),
    },
    maxSelectNum: Number,
    rowKey: {
      type: String,
      default: "key",
    },
  },
  directives: { "click-outside": clickoutsides },
  data() {
    return {
      clickIndex: "",
      columns_: this.columns,
      data_: [], //内部数据
      data_origin: [], //原始数据
      selectListId: [],
      rowSelection_: null, //checkbox选择功能
    };
  },
  watch: {
    columns(val) {
      this.resetOriginData();
      this.columns_ = val;
    },
    data: {
      handler(newValue, oldValue) {
        this.updateSelectList();
        this.resetOriginData();
        this.changeList();

        if (this.rowSelection) {
          this.checkChange();
        }
      },
      deep: true,
    },
    rowSelection: {
      handler(newValue, oldValue) {
        this.rowSelection_ = {
          hideSelectAll: false, //是否隐藏全选按钮
          selectedRowKeys: [],
          selectKey: "",
          onchange: () => {},
          maxSelectNum: null,
          ...newValue,
        };
      },
      deep: true,
    },
  },
  mounted() {
    this.columns_ = this.columns.map((item, index) => {
      if (item.isSort) {
        item.sort = item.sort ? true : false;
      }
      item.hasChild = item.hasChild || false;
      item.index = index;
      return item;
    });
    this.resetOriginData();
    if (this.rowSelection) {
      this.rowSelection_ = {
        hideSelectAll: false, //是否隐藏全选按钮
        selectedRowKeys: [],
        selectKey: "",
        onchange: () => {},
        maxSelectNum: null,
        isShowAllSelectBtn: true,
        ...this.rowSelection,
      };
    }
  },
  methods: {
    showCell(c, item, index) {
      if (!c.customCell) return true;
      let cellSpan = c.customCell(item, index);
      if (!cellSpan) return true;
      if (cellSpan) {
        return cellSpan.rowSpan !== 0 && cellSpan.colSpan !== 0;
      }
    },
    //单选筛选
    filterRadioChange(filters, value) {
      filters.forEach((v) => {
        v.check = v.value == value;
      });
    },
    //确定筛选
    filterSubmit(item) {
      item.rowShow = false;
      this.filterEmit();
      this.changeList();
    },
    changeList() {
      let filterHandles = this.columns.reduce((p, c) => {
        if (c.filters && c.filters.length) {
          let checks = c.filters.filter((ic) => ic.originCheck).map((ic) => ic.value);
          if (checks.length) {
            const fn = (dataItem) => {
              return checks.some((checkItem) => {
                if (c.onFilter) {
                  return c.onFilter(checkItem, dataItem);
                } else {
                  return checkItem == dataItem[c.key];
                }
              });
            };
            p.push(fn);
          }
        }
        return p;
      }, []);

      this.data_ = this.data_origin.filter((obj) => {
        return filterHandles.every((fn) => fn(obj));
      });
    },
    filterEmit() {
      let thearArr = this.columns;
      let selectIn = {};
      for (let i = 0; i < thearArr.length; i++) {
        let rows = thearArr[i].filters;
        if (rows && rows.length > 0) {
          if (thearArr[i].mode == "single") {
            selectIn[thearArr[i].key] = "";
          } else {
            selectIn[thearArr[i].key] = [];
          }
          for (let j = 0; j < rows.length; j++) {
            rows[j].originCheck = rows[j].check;
            if (rows[j].check) {
              if (thearArr[i].mode == "single") {
                selectIn[thearArr[i].key] = rows[j].value;
              } else {
                selectIn[thearArr[i].key].push(rows[j].value);
              }
            }
          }
        }
      }
      this.$emit("filterChange", selectIn);
    },
    isShowPanelChange(item) {
      console.log('触发面板')
      item.rowShow = !item.rowShow;
    },
    //重置筛选
    filterReset(item) {
      item.filters.forEach((itt) => {
        itt.check = false;
      });
      this.filterSubmit(item);
    },
    filterCancel(item) {
      item.rowShow = false;
      let thearArr = this.columns;
      let selectIn = {};
      for (let i = 0; i < thearArr.length; i++) {
        let rows = thearArr[i].filters;
        if (rows && rows.length > 0) {
          for (let j = 0; j < rows.length; j++) {
            rows[j].check = rows[j].originCheck;
          }
        }
      }
    },
    filterCheck(obj) {
      if (!obj.filters) {
        return "";
      }
      return obj.filters.some((itt) => {
        return itt.originCheck;
      })
        ? "#2B8CE5"
        : "";
    },
    updateSelectList(checkKey) {
      let isChecked = this.data_.some((v) => v.check);
      if (!isChecked) {
        this.selectListId = [];
      } else {
        this.selectListId = this.data_.filter((v) => v.check).map((k) => k[checkKey]);
      }
    },
    selectClick(index) {
      if (!this.lineClick) return;
      if (this.clickIndex === index) {
        this.clickIndex = "";
        this.$emit("selectClick", null, this.data[index]);
        return;
      }
      this.$emit("selectClick", index, this.data[index]);
      this.clickIndex = index;
    },
    checkChange() {
      if (this.rowSelection_.onChange) {
        this.rowSelection_.onChange(
          this.rowSelection_.selectedRowKeys,
          this.data_.filter((item, index) => {
            let value = this.rowSelection_.selectKey
              ? item[this.rowSelection_.selectKey]
              : index;
            return this.rowSelection_.selectedRowKeys.includes(value);
          })
        );
      }
    },
    selectAll() {
      this.rowSelection_.selectedRowKeys = this.data_.map((item, index) => {
        let value = this.rowSelection_.selectKey
          ? item[this.rowSelection_.selectKey]
          : index;
        return value;
      });
      this.checkChange();
    },
    removeSelectAll() {
      this.rowSelection_.selectedRowKeys = [];
      this.checkChange();
    },
    reset() {
      this.clickIndex = "";
      this.columns_.forEach((item) => {
        item.sort = false;
      });
    },
    sortClick(item) {
      item.sort = !item.sort;
      console.log(item.sort);

      this.$emit("sortChange", item.sortKey || item.key, item.sort);
    },
    resetOriginData() {
      let originData = JSON.parse(JSON.stringify(this.data));
      let data_ = calculateRowLevels(originData);
      this.data_ = data_;
      this.data_origin = data_;
    },
    tdClick(c, item) {
      this.columns_.forEach(v => {
        if(v.rowShow){
          this.filterSubmit(v);
        }
        v.rowShow=false;
      });
      if (!c.isClick) return;
      this.$emit("cellClick", item);
    },
    reValue(val) {
      if (val === 0) return 0;
      return val || "--";
    },
  },
};
</script>
<style scoped lang="scss">
.d-table {
  table {
    width: 100%;
    text-align: left;
    border-radius: 2px 2px 0 0;
    border-collapse: collapse;
    overflow-y: auto;

    .table-thead {
      position: relative;
      background: var(--color-background-content);
      border-left: 1px solid var(--color-border);
      border-top: 1px solid var(--color-border);

      th {
        position: relative;
        font-size: 14px;
        font-weight: 700;
        text-align: left;
        color: var(--color-title);
        letter-spacing: 0px;
        padding: 17px 0;
        overflow-wrap: break-word;
        text-align: center;
        border-bottom: 1px solid var(--color-border);
        border-right: 1px solid var(--color-border);

        .sort {
          display: inline-flex;
          flex-direction: column;
          width: 16px;
          cursor: pointer;
          top: -3px;

          &.rotate {
            transform: rotate(180deg);
          }
        }

        &.filterTh {
          padding-right: 28px;
        }

        .dwin-ui-table-filter {
          display: flex;
          position: absolute;
          right: 0px;
          cursor: pointer;
          align-items: center;
          top: 0;
          height: 100%;
          width: 28px;
          justify-content: center;

          .filterIcon {
            color: var(--color-text);
          }
        }

        .dwin-ui-table-filter:hover {
          background: var(--map-tab-back);

          .filterIcon {
            color: var(--color-text-hover);
          }
        }
      }
    }

    .noData {
      font-size: 14px;
      text-align: center;
    }

    .table-tbody {
      tr {
        position: relative;
        box-sizing: border-box;

        &.active {
          &:after {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            // background: url(/src/assets/imgs/s2/selectactive.png) center no-repeat;
            // background-size: contain;
          }

          // td {
          //   background: #0ea1ff;
          // }
        }
      }

      tr:nth-child(odd) {
        // background: rgba(62, 74, 91, 0.4);
      }

      td {
        font-size: 13px;
        font-weight: 400;
        color: var(--color-text);
        height: 48px;
        letter-spacing: 0px;
        text-align: center;
        border-bottom: 1px solid var(--color-border);
        position: relative;
        background: var(--color-background);
        overflow-wrap: break-word;

        .active {
          border: 1px solid var(--color-primary);
          background: var(--color-primary);
        }
        .disabled {
          cursor: no-drop;
        }
        &.cell-with-append {
          text-align: left;
          padding-left: 10px;
        }

        .d-table-row-indent {
          height: 1px;
          float: left;
        }
        .row-expand-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
      }

      .d-table-td-ellipsis {
        &:hover:after {
          content: attr(text);
          position: absolute;
          top: 30px;
          left: 0;
          right: 0;
          margin-top: 10px;
          background: var(--color-background);
          line-height: 25px;
          word-wrap: break-word;
          white-space: normal;
          padding: 3px;
          z-index: 11111;
          border: 1px solid var(--color-border);
        }
      }

      .d-table-cell-ellipsis {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: keep-all;
      }
    }

    .checkbox-wrapper {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      color: #000000d9;
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5715;
      list-style: none;
      font-feature-settings: "tnum";
      display: inline-flex;
      align-items: baseline;
      line-height: unset;
      cursor: pointer;

      .checkbox {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        position: relative;
        top: 0.2em;
        line-height: 1;
        white-space: nowrap;
        outline: none;
        cursor: pointer;
        width: 16px;
        height: 16px;
        line-height: 16px;
        direction: ltr;
        border-radius: 2px;
        border-collapse: separate;
        transition: all 0.3s;
        cursor: pointer;
        color: #fff !important;
        background-color: transparent;
        border-width: 2px;
        border: 1px solid var(--color-text);

        .checkout-inner {
          display: none;
          color: #ffff;
        }

        &:hover {
          border-color: var(--color-text);
        }

        &.check {
          background-color: var(--color-primary);

          .checkout-inner {
            display: inline-block;
          }
        }
        &.disabled {
          cursor: not-allowed;
          opacity: 0.5;
          background-color: var(--color-disabled);
          > input {
            pointer-events: none;
          }
        }

        > input {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          opacity: 0;
        }
      }
    }
  }
}
.filter-footer {
  // width:100px;
  // height:200px;
  background: var(--color-background);
  box-shadow: 0 2px 7px rgba(117, 117, 117, 0.15);
  position: absolute;
  top: 0;
  right: -28px;
  z-index: 1;
  box-shadow: 0 2px 8px #00000026;
  font-size:14px;
  .filter-list {
    min-height: 60px;
    max-height: 230px;
    overflow: auto;
    margin: 10px 0;
    p {
      padding: 5px 0 5px 12px;
      cursor: pointer;
      text-align: left;
      color: var(--color-title);
      overflow-wrap: break-word;
    }
    p:hover {
      color: #1890ff;
      background-color: var(--filter-list-hover);
    }
  }

  .filter-active {
    color: #1890ff;
    background-color: var(--filter-list-hover);
  }

  .filter-submit {
    min-width: 100px;
    padding: 7px 0px;
    border-top: 1px solid var(--color-border);
    color: #1890ff;

    span {
      margin: 0 6px;
      cursor: pointer;
    }
  }
}
</style>
