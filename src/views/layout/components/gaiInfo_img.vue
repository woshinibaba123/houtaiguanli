<template>
    <el-dialog v-el-drag-dialog title="请选择头像" top="50px" class="dialog-infoimg gaiImg" :width="fullscreen ? '' : '500px'"
        :fullscreen="fullscreen" :visible.sync="dialogImg" :modal-append-to-body="false" @open="openDialog"
        :before-close="handleClose">
        <div>
            <el-row>
                <el-col>已设置头像</el-col>
                <el-col class="Info-Img margin-top-5"><img :src="img_data" alt="" class="img-md img-circle" :onerror="defaultImg" /></el-col>
                <el-col class="mar-top">选择系统内置头像</el-col>
                <el-col class="morenF">
                    <img class="img-md" @click="xuanzeImg(index+1)" v-for="(item,index) in InfoImgArr" :src="item" :key="index"
                        alt="">
                </el-col>
            </el-row>
            <el-row class="margin-top-10">
                <el-col>上传自定义头像 </el-col>
                <el-col class="margin-top-5">
                    <el-upload class="upload-demo" accept=".jpg,.png,.jpeg" v-if="authCheck(33)" :action="API_ROOT + '/admin-api/upload'"
                        :headers="{'Authorization':userinfo.userinfo.token}" :show-file-list="false" :on-success="handleAvatarSuccess"
                        :on-error="handleAvatarError" :before-upload="beforeAvatarUpload">
                        <el-button size="small" type="info" plain>上传头像</el-button>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png/jpeg格式文件，且大小不超过1MB</div>
                    </el-upload>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-loading="loading" @click="handleConfirm" v-if="authCheck(35)">
                    <svg-icon icon-class="keep"></svg-icon> 保存
                </el-button>
            </div>
        </div>

    </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import { getHead, changeHead } from "@/api/system/user";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
export default {
    props: ["dialogImg"],
    directives: {
        elDragDialog
    },
    data() {
        return {
            fullscreen: false,
            //限制上传文件
            filters: {
                max_file_size: "1mb",
                mime_types: [
                    { title: "Image files", extensions: "jpg,gif,png" }
                ]
            },
            defaultImg:
                'this.src="' + require("@/assets/images/nophoto.png") + '"',
            img_data: "",
            file: {
                url: "",
                path: "",
                name: ""
            },
            percent: 0,
            status: "",
            InfoImgArr: [],
            loading: false
        };
    },
    methods: {
        //打开
        openDialog() {
            if (
                /Android|webOS|iPhone|iPod|BlackBerry/i.test(
                    navigator.userAgent
                )
            ) {
                this.fullscreen = true;
            } else {
                this.fullscreen = false;
            }
            this.img_data = this.userinfo.userinfo.head;
            this.getInfoimage();
        },
        //离开此页面
        handleClose(val) {
            this.$emit("CB-dialogImg", false);
        },
        //保存头像
        handleConfirm() {
            this.loading = true;
            changeHead({
                file: this.file
            })
                .then(rs => {
                    this.$message.success("保存成功");
                    let data = this.img_data.replace("temp/", "");
                    this.userinfo.userinfo.head = data;
                    this.$store.commit("setUserinfo", this.userinfo);
                    this.$emit("CB-dialogImg", false);
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        //设置默认图片
        xuanzeImg(val) {
            this.file.name = "";
            this.file.path = "";
            this.file.url = this.img_data = this.InfoImgArr[val - 1];
        },
        handleAvatarSuccess(res, file) {
            if (res && res.url) {
                this.file = res;
                this.percent = 0;
                this.status = "success";
                this.$message({ message: "上传成功", type: "success" });
                this.img_data = this.file.url;
            } else {
                this.percent = 0;
                this.status = "exception";
                this.img_data = this.head;
                this.$message({ message: "上传失败", type: "error" });
            }
        },
        handleAvatarError(err) {
            this.$message({
                message: "服务器请求失败，赶紧联系工程师抢修吧~",
                type: "error"
            });
        },
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 1;
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 1MB!");
            }
            return isLt2M;
        },
        //获取默认图片
        getInfoimage() {
            getHead()
                .then(rs => {
                    this.InfoImgArr = rs;
                })
                .then(rs => {});
        }
    },

    computed: mapState({
        userinfo: state => state.user
    })
};
</script>
<style>
.morenF > img:hover {
    cursor: pointer;
    box-shadow: 0px 0px 3px #1d8ce0;
}

.morenTitle {
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
}

.morenF > img,
.Info-Img img {
    background: #e5e5e5;
    padding: 4px;
}

.Info-Img {
    position: relative;
    cursor: pointer;
    display: inline-block;
}

.Info-Img > span {
    position: relative;
    top: -17px;
}

.Info-Img > div {
    margin-left: 2px;
    top: 15px;
    position: relative;
    display: inline-block;
}

.Info-Img > div img:hover {
    box-shadow: 0px 0px 3px #1d8ce0;
}

.Info-Img > div span {
    position: absolute;
    right: 0px;
    top: 0px;
}

.Info-Img > div span:hover {
    color: #ff4949;
    cursor: pointer;
}

.C-img-row {
    display: flex;
    justify-content: center;
}

.morenF {
    margin: auto;
}

.morenF > img {
    margin: 5px 5px;
}

.dialog-infoimg > div {
    width: 32%;
}

.gaiImg .el-dialog .el-dialog__header {
    padding: 20px 20px 0;
}

.gaiImg .el-dialog .el-dialog__body {
    padding: 0 20px 30px;
}
</style>
