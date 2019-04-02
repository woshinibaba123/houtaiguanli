<template>
    <span>
        <el-button class="filter-item margin-right-10" icon="el-icon-upload" type="primary" v-waves plain @click="importDialog = true">
            导入净值
        </el-button>
        <el-dialog title="数据导入" :visible="importDialog" append-to-body width="500px" top="15vh" @close="handleClose"
            @open="openDialog">
            <el-form class="margin-top-30" label-suffix="：" :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item label="样表下载">
                    <a class="bzl filter-item" type="primary" plain :href="url" target="_blank">
                        <i class="el-icon-download"></i> 样例表
                    </a>
                </el-form-item>
                <el-form-item label="上传数据" required>
                    <Upload v-if="!form.file.url" button_size="small" plain button_text="导入表格" :filters="filters"
                        @Callback-UploadProgress="CB_UploadProgress" @Callback-GetFileInfo="CB_GetFileInfo"></Upload>
                    <el-row v-else-if="form.file.url">
                        <el-col>
                            <ul class="el-upload-list el-upload-list--text">
                                <li class="el-upload-list__item is-success">
                                    <a class="el-upload-list__item-name blue" :href="form.file.url" target="_blank">
                                        <i class="el-icon-document"></i>
                                        {{form.file.name}}
                                    </a>
                                    <i class="el-icon-close" @click="file_close"></i>
                                    <label class="el-upload-list__item-status-label">
                                        <i class="el-icon-upload-success el-icon-circle-check"></i>
                                    </label>
                                </li>
                            </ul>
                        </el-col>
                    </el-row>
                    <el-progress :text-inside="true" :stroke-width="15" class="margin-top-5" :percentage="percent" v-if="percent>0"></el-progress>
                    <div class="el-upload__tip" style="line-height: 25px;">
                        请上传（.xls/.xlsx）格式Excel文件，大小不超过1MB。
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-waves type="primary" :loading="loading" icon="fa fa-floppy-o" @click="handleKeep()">
                    <svg-icon icon-class="keep"></svg-icon> 确认保存
                </el-button>
            </div>
        </el-dialog>
    </span>
</template>

<script>
import { inlet } from "@/api/downloadImport";
import Upload from "@/components/plupload/pl-upload";
import waves from "@/directive/waves"; // 水波纹指令

const form = {
    file: {
        url: "",
        name: "",
        path: ""
    }
};

const data = [{ name: "jingzhi", id: 1, url: "/public/static/JZGL.xlsx" }];

export default {
    name: "ImportData",
    props: ["model", "p_id"],
    components: { Upload },
    directives: { waves },
    data() {
        return {
            importDialog: false,
            loading: false,
            url: "",
            form: JSON.parse(JSON.stringify(form)),
            percent: 0,
            status: "",
            //限制上传文件
            filters: {
                max_file_size: "1mb",
                mime_types: [{ title: "Excel file", extensions: "xls,xlsx" }]
            },
            rules: {}
        };
    },
    methods: {
        //上传进度
        CB_UploadProgress(file) {
            this.percent = file.percent;
        },
        //上传成功后的回调
        CB_GetFileInfo(res) {
            if (res && res.url) {
                this.status = "success";
                this.form.file = res;
                this.percent = 0;
                this.$forceUpdate();
                this.$message({ message: "上传成功", type: "success" });
            } else {
                this.status = "exception";
                this.form.file.name = "";
                this.form.file.url = "";
                this.form.file.path = "";
                this.percent = 0;
                this.$message({ message: "上传失败", type: "error" });
            }
        },
        //刪除
        file_close() {
            this.form.file.name = "";
            this.form.file.url = "";
            this.form.file.path = "";
        },
        handleKeep() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.p_id) {
                        this.form.p_id = this.p_id;
                    }
                    this.loading = true;
                    inlet(this.form)
                        .then(rs => {
                            this.$message.success("导入成功！");
                            this.$emit("CB-dialogImport", true);
                            this.loading = false;
                            this.form.file.name = "";
                            this.importDialog = false;
                            this.$parent.getData();
                            this.form.file.url = "";
                            this.form.file.path = "";
                        })
                        .catch(() => {
                            this.form.file.name = "";
                            this.form.file.url = "";
                            this.form.file.path = "";
                            this.loading = false;
                        });
                }
            });
        },
        //打开
        openDialog() {
            let item = data.find(it => {
                return it.name == this.model;
            });
            if (item) {
                this.form.import_id = item.id;
                this.url =
                    (this.API_ROOT || "http://a.ez-tech.cn/zhzc/api") +
                    item.url;
            }
        },
        //关闭
        handleClose() {
            this.form = JSON.parse(JSON.stringify(form));
            this.url = "";
            this.$refs["form"].resetFields();
            this.importDialog = false;
        }
    }
};
</script>
<style scoped>
.hr_label {
    height: 1px;
    padding: 0;
    margin: 0;
    border: 0;
    background-color: #e2e2e2;
}
.form-title {
    display: block;
    padding: 8px 0;
    border-bottom: 1px dashed rgba(0, 0, 0, 0.2);
    font-size: 15px;
    font-weight: 300;
    margin-bottom: 15px;
}
.bzl {
    color: #0e94f8;
    background-image: initial;
    background-position-x: initial;
    background-position-y: initial;
    background-size: initial;
    background-attachment: initial;
    background-origin: initial;
    background-clip: initial;
    height: 36px;
}
</style>

