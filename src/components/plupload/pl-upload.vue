<template>
    <div>
        <div v-if="!type || type == 'default'" :id="container?container:'SelectContainer'">
            <el-button :size="button_size?button_size:'small'" :type="theme?theme:'info'" icon="el-icon-upload" :plain="plain" :id="buttonID?buttonID:'pl_upload_button'">{{button_text?button_text:'上传文件'}}</el-button>
        </div>
        <!-- 拖动上传 -->
        <div v-if="type == 'drag'" :id="container?container:'SelectContainer'">
            <div :id="buttonID?buttonID:'pl_upload_button'" class="el-upload el-upload--text">
                <div class="el-upload-dragger">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或
                        <em>点击上传</em>
                    </div>
                </div>
            </div>
        </div>
        <!-- 头像方式 -->
        <div v-if="type == 'photo'" :id="container?container:'SelectContainer'" class="avatar-uploader">
            <div :id="buttonID?buttonID:'pl_upload_button'" class="el-upload el-upload--text">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <div v-else-if="image_percent" class="avatar-image">
                    <el-progress type="circle" :width="100" class="margin-top-20" :text-inside="false" :show-text="true" :percentage="image_percent"></el-progress>
                </div>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
        </div>
        <div v-if="type == 'tubiao'" :id="container?container:'SelectContainer'" class="avatar-uploader">
            <div :id="buttonID?buttonID:'pl_upload_button'" class="el-upload el-upload--text">
                <img v-if="imageUrl" :src="imageUrl" class="avatars">
                <div v-else-if="image_percent" class="avatar-images">
                    <el-progress type="circle" :width="100" class="margin-top-20" :text-inside="false" :show-text="true" :percentage="image_percent"></el-progress>
                </div>
                <i v-else class="el-icon-plus avatar-uploader-icons"></i>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from "vue";

//导入vuex辅助函数
import { mapState } from "vuex";

export default {
    //外部调用该组件时，允许接收的参数
    /**
     * @author [leo]
     *
     * [props 组件允许传递参数]
     *
     * @type [string] 上传按钮的样式，非必传，默认为普通按钮形式，可传参数形式为[default 默认按钮模式]，[[drag 拖拽模式]，[phone 头像模式]
     * @buttonID [sting] 生成上传按钮的唯一id，一个页面内如有多个上传按钮，注意他们的id不可重复，如果只有一个按钮，可以不传参，默认为“pl_upload_button”
     * @max_file_size [sting] 允许上传单个文件的最大值，注意写上单位，如：“1mb、500kb”等，默认伙100mb，如果不使用“filters”进行过滤设置可直接使用本参数，一般情况下使用“filters”进行设置
     * @container [string]  上传文件区域，一个页面中有多个上传，请设置为不同的值，如果只有一个上传，则无需传参
     * @chunk_size [string] 分片大小，注意写上单位，默认为“1mb”，可不传参
     * @button_text [string] 上传按钮上的显示文字，默认可不传参
     * @button_size [string]  上传按钮的大小，选项为element-ui中按钮的大小可选项，默认为small，可不传参
     * @filters [object] 设置当前上传按钮的过滤信息，如上传文件类型、格式、大小等。参考下面的示例
     * @theme [string] 按钮的样式，同element-ui中按钮选项一致，为：primary/info/success/warning/danger等，默认为info
     * @plain [boller] 是否开启线框按钮形式，同element-ui中按钮组件中的该参数用法一样，如果需要开启，直接在按钮上中写上plain该属性即可。
     * @imageUrl [string] 头像模式，上传的图片链接
     * @image_percent [number] 头像模式，上传的进度条
     */

    props: [
        "type",
        "buttonID",
        "max_file_size",
        "container",
        "drop_element",
        "chunk_size",
        "button_text",
        "button_size",
        "filters",
        "theme",
        "plain",
        "imageUrl",
        "image_percent"
    ],

    data: function() {
        return {
            filter: {}
        };
    },
    methods: {},
    mounted() {
        //重新定义this ，避免冲突
        var _self = this;

        var uploader = new plupload.Uploader({
            runtimes: "html5,flash,silverlight,html4",
            browse_button: this.buttonID ? this.buttonID : "pl_upload_button", // 上传选择的点选按钮，必需
            container: this.container ? this.container : "SelectContainer", // 上传区域DOM ID，默认是browser_button的父元素
            url: this.API_ROOT + "/admin-api/upload",
            flash_swf_url: "../assets/js/Moxie.swf",
            silverlight_xap_url: "../assets/js/Moxie.xap",
            max_file_size: this.max_file_size, // 最大文件体积限制
            dragdrop: true, // 开启可拖曳上传
            drop_element: this.drop_element
                ? this.drop_element
                : "SelectContainer", // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: this.chunk_size ? this.chunk_size : "1mb", // 分块上传时，每块的体积
            auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
            filters: this.filters ? this.filters : this.filter,
            headers: {
                Authorization: this.$store.state.user.userinfo.token
            },
            /*
            示例
            filters: {
                max_file_size: '10mb',
                mime_types: [
                    { title: "Image files", extensions: "jpg,gif,png" },
                    { title: "Zip files", extensions: "zip" }
                ]
            },*/

            init: {
                //文件加入到上传队列中
                FilesAdded: function(up, files) {
                    plupload.each(files, function(file) {
                        // 文件编辑进队列后，处理相关的事情
                        // console.log(file)
                        _self.$emit("Callback-FilesAdded", file);
                    });
                },
                //文件上传之前
                BeforeUpload: function(up, file) {
                    // 每个文件上传前，处理相关的事情
                    // 文件上传之前进行回调数据到父组件
                    _self.$emit("Callback-BeforeUpload", file);
                },
                //上传进度
                UploadProgress: function(up, file) {
                    // 每个文件上传时，处理相关的事情
                    _self.$emit("Callback-UploadProgress", file);
                },
                //上传成功后返回结果
                FileUploaded: function(up, file, info) {
                    //返回上传成功后的文件信息
                    var up_info = eval("(" + info.response + ")");
                    _self.$emit("Callback-GetFileInfo", up_info);
                    // if (_self.getToken(up_info)) {
                    //     _self.$emit("Callback-GetFileInfo", up_info.data);
                    // }
                },
                //上传失败后返回的信息
                Error: function(up, err) {
                    if (err.status == 401) {
                        _self.$message.error({
                            message: err.response,
                            duration: 5000
                        });
                        _self.logout();
                        return;
                    }
                    var str = "";
                    switch (err.code) {
                        case -600:
                            str =
                                "文件超过最大值 > " +
                                up.settings.filters.max_file_size;
                            break;
                        case -601:
                            var s = up.settings.filters.mime_types.regexp
                                .toString()
                                .replace(/[\\]/g, "")
                                .replace("/", "")
                                .replace("$/i", "");
                            str = "错误的文件格式！允许格式：" + s;
                            break;
                        default:
                            str = "未知的错误原因！";
                    }
                    _self.$message.error({
                        message: "上传失败：" + str,
                        duration: 5000
                    });
                    _self.$emit("Callback-Error");
                }
            }
        });
        uploader.init();
    }
};
</script>
<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 35px;
    color: #8c939d;
    width: 100px;
    height: 140px;
    line-height: 140px;
    text-align: center;
}
.avatar {
    width: 100px;
    height: 140px;
    display: block;
}
.avatar-image {
    width: 100px;
    height: 140px;
}

.avatar-uploader-icons {
    font-size: 35px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
}
.avatars {
    width: 100px;
    height: 100px;
    display: block;
}
.avatar-images {
    width: 100px;
    height: 100px;
}
</style>

