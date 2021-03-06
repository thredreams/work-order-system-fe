<template>
  <div>
    <el-table
      v-loading="options.loading"
      :data="dataSource"
      :max-height="options.maxHeight"
      :stripe="options.stripe"
      :border="options.border"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @filter-change="filterMethod"
      header-row-class-name="table-header-row"
    >
      <!--selection选择框-->
      <el-table-column
        v-if="options.mutiSelect"
        type="selection"
        style="width:50px"
        align="center"
        :fixed="options.mutiSelectFixed"
      ></el-table-column>

      <!--序号-->
      <el-table-column
        v-if="options.index"
        label="#"
        type="index"
        width="50"
        align="center"
        :fixed="options.indexFixed"
      ></el-table-column>

      <!--数据列-->
      <template v-for="(column, index) in columns">
        <el-table-column
          :key="column[options.indexProp] || index"
          :prop="column.prop"
          :column-key="column.prop"
          :label="column.label"
          :align="column.align || 'center'"
          :width="column.width"
          :fixed="column.fixed"
          :filters="column.filters"
          :filter-multiple="column.filterMultipe || false"
          :filter-placement="column.filterPlacement || 'bottom'"
          :show-overflow-tooltip="column.showOverflowTooltip || true"
        >
          <template slot-scope="scope">
            <!-- 正常渲染 -->
            <template v-if="!column.render">
              <!-- label 列表转换 -->
              <template v-if="column.labelList">
                {{
                  value2Label(
                    column.labelList,
                    scope.row[column.prop],
                    column.labelListOffset
                  )
                }}
              </template>
              <!-- label 函数转换 -->
              <template v-else-if="column.labelFunc">
                {{ column.labelFunc(scope.row[column.prop]) }}
              </template>
              <!-- 不带 label 转换 -->
              <template v-else>
                {{ scope.row[column.prop] }}
              </template>
              <!-- 带展示原因 -->
              <template
                v-if="
                  column.show && scope.row[column.prop] === column.showCondition
                "
              >
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  :content="scope.row[column.show]"
                >
                  <el-button
                    class="show-btn"
                    slot="reference"
                    icon="el-icon-question"
                    type="text"
                    size="medium"
                    circle
                  ></el-button>
                </el-popover>
              </template>
            </template>
            <!-- TODO 可能不是正常渲染吧~~ -->
            <template v-else>
              <RenderDom
                :row="scope.row"
                :index="index"
                :render="column.render"
              />
            </template>

            <!-- render button -->
            <template v-if="column.button">
              <template v-for="(btn, index) in column.group">
                <!-- tooltip 和圆形按钮 -->
                <template v-if="btn.tooltip">
                  <el-tooltip
                    :key="index"
                    :effect="btn.tooltipEffect || 'dark'"
                    :placement="btn.tooltipPlacement || 'top'"
                  >
                    <div slot="content">{{ btn.tooltipContent }}</div>
                    <el-button
                      :key="index"
                      :type="btn.type"
                      :size="btn.size || 'mini'"
                      :icon="btn.icon"
                      :disabled="btn.disabled"
                      :plain="btn.plain"
                      :circle="btn.circle || false"
                      @click.stop="btn.onClick(scope.row, scope.$index)"
                      ><template v-if="!btn.circle">{{
                        btn.name
                      }}</template></el-button
                    >
                  </el-tooltip>
                </template>
                <!-- 无 tooltip 和圆形按钮 -->
                <template v-else>
                  <el-button
                    :key="index"
                    :type="btn.type"
                    :size="btn.size || 'mini'"
                    :icon="btn.icon"
                    :disabled="btn.disabled"
                    :plain="btn.plain"
                    @click.stop="btn.onClick(scope.row, scope.$index)"
                    >{{ btn.name }}</el-button
                  >
                </template>
              </template>
            </template>

            <!-- render tool-tip -->
            <template v-if="column.toolTip">
              <template v-if="scope.row[column.show] === column.showRule">
                <el-popover
                  placement="bottom-start"
                  trigger="hover"
                  :content="scope.row[column.content] || '无'"
                >
                  <el-button
                    class="tooltipBtn"
                    slot="reference"
                    icon="el-icon-question"
                    type="text"
                    circle
                  ></el-button>
                </el-popover>
              </template>
            </template>

            <!-- slot 你可以其他常用项 -->
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="pagination"
      :total="pagination.total"
      :page-sizes="[20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleIndexChange"
      style="margin-top: 20px;text-align: right"
    ></el-pagination>
  </div>
</template>

<script>
// 原作者: guodada
// 链接: https://juejin.im/post/5b45e4c55188251b1a7b2301
// 本版本已被 Skye 修改
export default {
  components: {
    RenderDom: {
      functional: true, // 函数式组件 - 无 data 和 this 上下文 => better render
      props: {
        row: Object,
        index: Number,
        render: Function
      },
      /**
       * @param {Function} createElement - 原生创建dom元素的方法， 弃用，推荐使用 jsx
       * @param {Object} ctx - 渲染的节点的this对象
       * @argument 传递参数 row index
       */
      render(createElement, ctx) {
        const { row, index } = ctx.props;
        return ctx.props.render(row, index);
      }
    }
  },
  props: {
    dataSource: Array,
    labelDataSource: Object,
    options: Object, // 表格参数控制 maxHeight、stripe 等等...
    columns: Array,
    fetch: Function, // 获取数据的函数
    pagination: Object // 分页，不传则不显示
  },
  data() {
    return {
      filters: {}
    };
  },
  created() {
    // 传入的options覆盖默认设置
    this.$parent.options = Object.assign(
      {
        maxHeight: 500,
        stripe: true, // 是否为斑马纹
        border: true, // 是否显示边框
        initTable: true,
        button: false
      },
      this.options
    );

    if (this.$parent.options.initTable) {
      this.fetch(this.filters);
    }
  },
  methods: {
    handleSizeChange(size) {
      // 切换每页显示的数量
      this.pagination.pageSize = size;
      this.fetch(this.filters);
    },
    handleIndexChange(current) {
      // 切换页码
      this.pagination.pageIndex = current;
      this.fetch(this.filters);
    },
    handleSelectionChange(selection) {
      this.$emit("selection-change", selection);
    },
    handleRowClick(row, event, column) {
      this.$emit("row-click", row, event, column);
    },
    value2Label(labelListName, value, offset = 0) {
      // 将某些值转换为想要显示的 label
      return this.labelDataSource[labelListName][value + offset];
    },
    // TODO: 水平太差，没想到好的方法，暂时还是写死了
    filterMethod(filters) {
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          this.filters[key] = filters[key][0];
        }
      }
      this.fetch(this.filters);
    }
  }
};
</script>

<style scoped>
.el-table {
  max-height: 70vh !important;
}

.el-table th,
.el-table tr.table-header-row {
  background: #fdfdfd;
  /* border-block-end: 1px solid #dddddd; */
}

.el-table__body-wrapper,
.el-table__fixed-body-wrapper {
  max-height: 60vh !important;
}

.tooltipBtn {
  padding: 5px;
}

.show-btn {
  padding: 0%;
  color: #f56d6d;
}
</style>
