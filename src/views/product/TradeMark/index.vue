<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加</el-button>
    <el-table
      v-loading="tableLoading"
      :data="tradeMarkTableData"
      style="width: 100%"
      border
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column
        prop="tmName"
        label="品牌名称"
      />
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img v-image-preview="scope.row.logoUrl" :src="scope.row.logoUrl" class="logoImg">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" plain @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="tradeMarkTableData.length > 0"
      :current-page="pageIndex"
      :page-sizes="[3, 10, 20, 50]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getTradeMarkList"
    />
    <tradeMarkDialog ref="dialogRef" :title="dialogTitle" />
  </div>
</template>

<script>
import tradeMarkDialog from './components/tradeMarkDialog.vue'
export default {
  name: 'TradeMark',
  components: { tradeMarkDialog },
  data() {
    return {
      pageIndex: 1,
      pageSize: 3,
      total: 0,
      tradeMarkTableData: [],
      tableLoading: false,
      dialogTitle: ''
    }
  },
  mounted() {
    this.getTradeMarkList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getTradeMarkList()
    },
    getTradeMarkList(pageIndex = 1) {
      this.pageIndex = pageIndex
      this.tableLoading = true
      this.$API.trademark.reqTradeMarkList(this.pageIndex, this.pageSize).then(res => {
        this.total = res.data.total
        this.tradeMarkTableData = res.data.records

        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
        err
      })
    },
    handleAdd() {
      this.dialogTitle = '添加品牌'
      this.$refs.dialogRef.trademarkList = {
        tmName: '',
        logoUrl: ''
      }
      this.$refs.dialogRef.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '修改品牌'
      this.$refs.dialogRef.dialogVisible = true
      this.$refs.dialogRef.trademarkList = JSON.parse(JSON.stringify(row))
    },
    async handleDelete(row) {
      const confirmRes = await this.$confirm('此操作将永久删除该品牌, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmRes === 'confirm') {
        const res = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (res.code === 200) {
          this.getTradeMarkList(this.tradeMarkTableData.length > 1 ? this.pageIndex : this.pageIndex - 1)
          this.$message.success('删除成功')
        }
      } else {
        this.$message.info('已取消删除')
      }
    }
  }
}
</script>

<style scoped>
.el-table{
  margin:10px 0
}
.el-pagination{
  text-align: center;
}
.logoImg{
  /* width: 40px; */
  height: 40px;
}
</style>
