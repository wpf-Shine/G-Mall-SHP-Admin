<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
    @closed="dialogClosed"
  >
    <el-form ref="ruleForm" :model="trademarkList" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="品牌名称" prop="tmName">
        <el-input v-model="trademarkList.tmName" />
      </el-form-item>
      <el-form-item label="品牌LOGO" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          action="/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="trademarkList.logoUrl" :src="trademarkList.logoUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" size="small" @click="handleSure">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'TradeMarkDialog',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      trademarkList: {
        tmName: '',
        logoUrl: ''
      },
      dialogVisible: false,
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请上传品牌LOGO' }
        ]
      }
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    dialogClosed() {
      this.$refs['ruleForm'].resetFields()
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.trademarkList.logoUrl = res.data
        this.$message.success('图片上传成功')
      } else {
        this.$message.success('图片上传失败')
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleSure() {
      this.$refs['ruleForm'].validate(async(valid) => {
        if (valid) {
          const res = await this.$API.trademark.reqAddOrUpdateTradeMark(this.trademarkList)
          if (res.code === 200) {
            this.dialogVisible = false
            this.$parent.getTradeMarkList(this.trademarkList.id ? this.$parent.pageIndex : 1)
            this.$message.success(`${this.title}成功`)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
