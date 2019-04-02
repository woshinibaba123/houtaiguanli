<template>
    <span>
        <el-button v-if="authCheck(36)" :close-on-click-modal="false" class="filter-item margin-right-10" type="primary"
            icon="el-icon-download" v-waves @click="downloadDialog=true">{{name}}</el-button>
        <el-dialog title="数据导出" :visible="downloadDialog" width="480px" top="30vh" append-to-body @close="handleClose"
            @open="openDialog">
            <div class="padding-20 box" v-loading="loading" element-loading-text="文件生成中，请稍等…">
                <div v-if="loadUrl">
                    <p class="text-center font-120 success margin-top-10">数据生成成功！请点击下面的链接下载文件 </p>
                    <div class="text-center margin-top-20">
                        <a class="bton" v-waves icon="el-icon-circle-plus-outligeng" plain type="primary" size="medium"
                            @click="handleClick">
                            <i class="el-icon-download"></i> 下载文件
                        </a>
                    </div>
                </div>
                <p class="text-center font-120 margin-top-10" v-else>{{title}}</p>
            </div>
        </el-dialog>
    </span>
</template>
<script>
import { download } from "@/api/download";
import waves from "@/directive/waves"; // 水波纹指令
const data = [{ name: "baoming", id: 1 }];

export default {
    props: ["value", "model", "name"],
    directives: { waves },
    data() {
        return {
            loading: false,
            downloadDialog: false,
            loadUrl: "",
            data,
            title: ""
        };
    },
    methods: {
        //打开

        openDialog() {
            let params = this.value;
            let item = data.find(item => item.name == this.model);
            if (!item) {
                this.title = "数据生成失败!";
                return;
            }
            params.export_id = item.id;
            this.loading = true;
            download(params)
                .then(rs => {
                    this.loadUrl = rs;
                    this.loading = false;
                })
                .catch(() => {
                    this.title = "数据生成失败！";
                    this.loading = false;
                });
        },
        handleClick() {
            window.location.href = this.loadUrl;
            this.handleClose();
        },
        //关闭
        handleClose() {
            this.downloadDialog = false;
            this.clear();
        },
        clear() {
            this.title = "";
            this.loadUrl = "";
        }
    }
};
</script>
<style>
.bton {
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
    margin-left: 10px;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    font-weight: 500;
    outline: 0 !important;
    font-family: inherit;
    text-transform: none;
}
.box {
    min-height: 150px;
}
</style>

