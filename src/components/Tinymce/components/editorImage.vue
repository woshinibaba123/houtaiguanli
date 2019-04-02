<template>
    <div class="upload-container">
        <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
        </el-button>
        <el-dialog append-to-body :visible.sync="dialogVisible">
            <el-upload accept=".jpg,.png,.jpeg" :headers="{'Authorization':token}" :action="API_ROOT+'/admin-api/upload-img'" :multiple="true" :file-list="fileList" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove" :on-success="handleSuccess" :before-upload="beforeUpload">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div class="margin-top-20">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
// import { getToken } from 'api/qiniu'

export default {
    name: "editorSlideUpload",
    props: {
        color: {
            type: String,
            default: "#1890ff"
        },
        url: {
            type: String
        }
    },
    //计算属性
    computed: {
        ...mapGetters(["token"])
    },
    data() {
        return {
            dialogVisible: false,
            listObj: {},
            fileList: []
        };
    },
    methods: {
        checkAllSuccess() {
            return Object.keys(this.listObj).every(
                item => this.listObj[item].hasSuccess
            );
        },
        handleSubmit() {
            let arr = Object.keys(this.listObj).map(v => this.listObj[v]);
            if (!this.checkAllSuccess()) {
                this.$message(
                    "请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！"
                );
                return;
            }
            arr = arr.map(item => item.url);
            this.$emit("successCBK", arr);
            this.listObj = {};
            this.fileList = [];
            this.dialogVisible = false;
        },
        handleSuccess(response, file) {
            const uid = file.uid;
            const objKeyArr = Object.keys(this.listObj);
            for (let i = 0, len = objKeyArr.length; i < len; i++) {
                if (this.listObj[objKeyArr[i]].uid === uid) {
                    this.listObj[objKeyArr[i]].url = response;
                    this.listObj[objKeyArr[i]].hasSuccess = true;
                    return;
                }
            }
        },
        handleRemove(file) {
            const uid = file.uid;
            const objKeyArr = Object.keys(this.listObj);
            for (let i = 0, len = objKeyArr.length; i < len; i++) {
                if (this.listObj[objKeyArr[i]].uid === uid) {
                    delete this.listObj[objKeyArr[i]];
                    return;
                }
            }
        },
        beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 1;
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过 1MB!");
                return isLt2M;
            }
            const _self = this;
            const _URL = window.URL || window.webkitURL;
            const fileName = file.uid;
            this.listObj[fileName] = {};
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = _URL.createObjectURL(file);
                img.onload = function() {
                    _self.listObj[fileName] = {
                        hasSuccess: false,
                        uid: file.uid,
                        width: this.width,
                        height: this.height
                    };
                };
                resolve(true);
            });
        }
    }
};
</script>
