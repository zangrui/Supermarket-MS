<template>
  <div class="classify-manage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>分类管理</span>
      </div>
      <div class="text item">
        <el-table
          ref="classifyList"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="classify" label="分类等级"></el-table-column>
          <el-table-column prop="classifyName" label="分类名称"></el-table-column>
          <el-table-column label="创建日期">
            <template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
          </el-table-column>
          <el-table-column label="管理">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
                <i class="el-icon-delete"></i> 删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          style="margin-top: 20px;text-align: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 3, 5, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>

        <!-- 批量删除按钮 & 取消选择按钮 -->
        <div>
          <el-button size="small" type="primary" @click="batchDelete">批量删除</el-button>
          <el-button size="small" @click="cancelSelect()">取消选择</el-button>
        </div>

        <!-- 修改模态框 -->
        <el-dialog title="账号修改" :visible.sync="flag" width="400px">
          <el-form
            size="small"
            :model="classifyEditForm"
            status-icon
            :rules="rules"
            ref="classifyEditForm"
            label-width="100px"
            hide-required-asterisk
          >
            <el-form-item label="分类等级" prop="classify">
              <el-select
                v-model="classifyEditForm.classify"
                placeholder="请选择分类等级"
                style="width: 120px"
              >
                <el-option label="顶级分类" value="顶级分类"></el-option>
                <el-option label="二级分类" value="二级分类"></el-option>
                <el-option label="三级分类" value="三级分类"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类名称" prop="classifyName">
              <el-input
                type="text"
                v-model="classifyEditForm.classifyName"
                autocomplete="off"
                style="width: 200px"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="flag = false">取 消</el-button>
            <el-button size="small" type="primary" @click="saveEdit('classifyEditForm')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
//引入moment模块
import moment from "moment";
export default {
  data() {
    return {
      tableData: [],
      flag: false, //修改模态框的显示隐藏
      editId: "",
      selecteClassify: [], //被选中的分类数据
      currentPage: 1,
      total: 0,
      pageSize: 3,
      classifyEditForm: {
        classify: "",
        classifyName: ""
      },
      rules: {
        classify: [
          { required: true, message: "请选择分类等级", trigger: "change" }
        ],
        classifyName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  //生命周期钩子函数 自动触发
  created() {
    this.getClassifyListByPage();
  },
  methods: {
    //按照分页显示分类数据函数
    getClassifyListByPage() {
      //收集当前页码和每页显示条数
      let params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      //发送ajax 传入当前页码和每页显示条数
      this.req
        .get("/classify/classifylistbypage", params)
        .then(response => {
          //接收后端返回的数据总条数 total 和 对应页码的数据 data
          let { total, data } = response.data;
          this.total = total;
          this.tableData = data;
          // 如果当前页没有数据 且 排除第一页
          if (!data.length && this.currentPage !== 1) {
            //页码减去1
            this.currentPage -= 1;
            //再调自己
            this.getClassifyListByPage();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //每页显示条数改变触发的函数
    handleSizeChange(val) {
      //保存每页显示的条数
      this.pageSize = val;
      //调用分页函数
      this.getClassifyListByPage();
    },
    //当前页码改变触发的函数
    handleCurrentChange(val) {
      //保存当前页码
      this.currentPage = val;
      //调用分页函数
      this.getClassifyListByPage();
    },
    //单选框的选中状态改变触发的函数 val就是选中的数据 是一个数组
    handleSelectionChange(val) {
      //保存被选中的分类数据
      this.selecteClassify = val;
    },
    //批量删除
    batchDelete() {
      //判断是否有选中
      if (!this.selecteClassify.length) {
        this.$message.error("请选择后再操作！");
        return;
      }
      //收集需要删除分类的id
      let selectedIdArr = this.selecteClassify.map(v => v.id);
      //提示框
      this.$confirm("你确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //发送ajax 传入需要删除分类的id
          this.req
            .get("/classify/batchdelete", { selectedId: selectedIdArr })
            .then(response => {
              //接收响应数据
              let { error_code, reason } = response.data;
              if (error_code === 0) {
                //弹出成功提示
                this.$message({
                  showClose: true,
                  type: "success",
                  message: reason
                });
                //请求分类数据(刷新)
                this.getClassifyListByPage();
              } else if (error_code) {
                //弹出失败提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //取消选中
    cancelSelect() {
      this.$refs.classifyList.clearSelection();
    },
    //修改分类函数
    handleEdit(id) {
      //保存要修改分类的id
      this.editId = id;
      //发送ajax 传入id
      this.req
        .get("/classify/classifyedit", { id })
        .then(response => {
          //回填表单
          this.classifyEditForm = response.data[0];
          // 显示模态框
          this.flag = true;
          //重置表单
          this.$refs.classifyEditForm.resetFields();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //保存修改函数
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //收集修改后的数据 和原来的id
          let params = {
            classify: this.classifyEditForm.classify,
            classifyName: this.classifyEditForm.classifyName,
            id: this.editId
          };
          //使用axios发送修改后的数据
          this.req
            .post("/classify/classifysaveedit", params)
            .then(response => {
              //接收响应数据
              let { error_code, reason } = response.data;
              if (error_code === 0) {
                //弹出成功提示
                this.$message({
                  showClose: true,
                  type: "success",
                  message: reason
                });
                //请求分类数据(刷新)
                this.getClassifyListByPage();
              } else if (error_code) {
                //弹出失败提示
                this.$message.error(reason);
              }
              // 关闭模态框
              this.flag = false;
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message.error("修改商品失败!");
        }
      });
    },
    //删除分类函数
    handleDelete(id) {
      this.$confirm("你确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //发送ajax 传入id
          this.req
            .get("/classify/classifydel", { id })
            .then(response => {
              //接收响应数据
              let { error_code, reason } = response.data;
              if (error_code === 0) {
                //弹出成功提示
                this.$message({
                  showClose: true,
                  type: "success",
                  message: reason
                });
                //请求账号数据(刷新)
                this.getClassifyListByPage();
              } else if (error_code) {
                //弹出失败提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  //过滤器
  filters: {
    //过滤时间的函数
    filterCtime(ctime) {
      return moment(ctime).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>
<style lang="less">
.classify-manage {
  .el-card {
    .el-card__header {
      font-size: 20px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
    .el-card__body {
      .el-dialog {
        .el-dialog__body {
          padding: 20px 20px 10px;
        }
      }
    }
  }
}
</style>