<template>
    <el-dialog v-el-drag-dialog title="调剂" top="15vh" width="800px" :visible="dialogTiaoji" @open="openDialog" @close="closeDialog">
        <el-form :model="info" :rules="rules" ref="info" label-width="130px" label-suffix="：">
            <div class="font-110 text-bold margin-left-5">基本信息</div>
            <el-row class="margin-top-20">
                <el-col :span="8">
                    <el-form-item label="教师姓名" class="wrap">{{form.name||'--'}}</el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="工号">{{form.account||'--'}}</el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="性别">{{form.sex===2?'女':'男'}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="年龄">{{form.age||'--'}}</el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="所在部门" class="wrap">{{form.xisuo_title||'--'}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号码" class="wrap">{{form.phone||'--'}}</el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="电话号码" class="wrap">{{form.tel||'--'}}</el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="电子邮箱" class="wrap">{{form.email||'--'}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="身份证号" class="wrap">{{form.sfz||'--'}}</el-form-item>
                </el-col>
            </el-row>
            <div class="font-110 text-bold margin-left-5">线路信息</div>
            <el-row class="margin-top-20">
                <el-col :span="16" class="pad-rgt">
                    <el-form-item label="原线路">
                        <el-input v-model="form.title" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="form.ft">
                    <el-input v-model="form.ft.title" disabled></el-input>
                </el-col>
                <el-col :span="16" class="pad-rgt">
                    <el-form-item label="调剂线路" class="cursorText" prop="tj_title">
                        <el-select style="width:100%" v-model="info.tj_title" clearable :filterable="true" :remote="true"
                            reserve-keyword placeholder="填入线路名称检索" no-data-text="未检索到相关线路信息" :remote-method="handleAccount"
                            :loading="xloading" @change="handleChange">
                            <el-option v-for="item in options" :key="item.value" :label="item.account" :value="item">
                                <el-row>
                                    <el-col :span="24">{{item.title}}</el-col>
                                </el-row>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="info.p_id">
                    <el-select v-model="info.ft" placeholder="选择分团" clearable style="width:100%">
                        <el-option v-for="(item,index) in fentuan" :key="index" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </el-col>
            </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="btn_loading" v-waves v-if="authCheck(87)" @click="saveData('form ')">
                <svg-icon icon-class="keep"></svg-icon> 确认保存
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
import { HuoZiliao, JianCycle, HuoquFentuan, Tiaoji } from "@/api/apply";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
const formData = {
    name: "",
    account: "",
    sex: 1,
    age: 0,
    school: "",
    school_title: "",
    phone: "",
    email: "",
    sfz: "",
    ft: {
        id: null,
        title: ""
    },
    title: "",
    tj_title: "",
    p_id: null
};

const infoData = {
    id: null,
    tj_title: "",
    p_id: null,
    ft: null
};

var timeout = null;
export default {
    name: "tiaoji",
    props: {
        dialogTiaoji: Boolean,
        tjid: [String, Number]
    },
    directives: { elDragDialog, waves },
    data() {
        return {
            form: JSON.parse(JSON.stringify(formData)),
            info: JSON.parse(JSON.stringify(infoData)),
            options: [],
            rules: {
                tj_title: [
                    {
                        required: true,
                        message: "请填写线路名称选择调剂线路",
                        trigger: "change,blur"
                    }
                ]
            },
            fentuan: [],
            xloading: false,
            btn_loading: false
        };
    },
    methods: {
        //打开弹框
        openDialog() {
            if (this.tjid != "" && this.tjid != null) {
                this.getRead();
            }
        },
        saveData(form) {
            this.$refs["info"].validate(valid => {
                if (valid) {
                    this.btn_loading = true;
                    let data = this.fentuan.find(
                        item => item.id === this.info.ft
                    );
                    if (data) {
                        var title = data.title;
                    }
                    let textmessage = "";
                    if (this.info.ft === null) {
                        textmessage =
                            "确认要将" +
                            this.form.name +
                            "调入" +
                            this.info.tj_title +
                            "线路下吗？";
                    } else if (
                        this.info.p_id === this.form.p_id &&
                        this.info.ft &&
                        !this.info.ft
                    ) {
                        textmessage =
                            "确认要将" +
                            this.form.name +
                            "调入同线路下的" +
                            title +
                            "分团吗？";
                    } else if (
                        this.info.p_id != this.form.p_id &&
                        this.info.ft
                    ) {
                        textmessage =
                            "确认要将" +
                            this.form.name +
                            "调入" +
                            this.info.tj_title +
                            "下的" +
                            title +
                            "分团吗？";
                    }
                    this.$confirm(textmessage, "系统提示", {
                        confirmButtonText: "确认调剂",
                        showCancelButton: false,
                        type: "warning"
                    })
                        .then(() => {
                            Tiaoji(this.info)
                                .then(res => {
                                    this.btn_loading = false;
                                    this.$message.success("调剂成功！");
                                    this.clearForm();
                                    this.$emit("CB-dialogTiaoji", true);
                                })
                                .catch(() => {
                                    this.btn_loading = false;
                                });
                        })
                        .catch(() => {
                            this.btn_loading = false;
                        });
                }
            });
        },
        handleAccount(key) {
            if (key.replace(/(^\s*)|(\s*$)/g, "").length > 0) {
                this.xloading = true;
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    JianCycle({ keys: key })
                        .then(res => {
                            this.options = res;
                            this.xloading = false;
                        })
                        .catch(() => {
                            this.xloading = false;
                        });
                }, 100);
            }
        },
        //获取分团
        getFentuan(id) {
            HuoquFentuan(id).then(res => {
                this.fentuan = res;
            });
        },
        getRead() {
            this.loading = true;
            HuoZiliao(this.tjid)
                .then(res => {
                    this.loading = false;
                    this.form = res;
                    this.info.id = res.id;
                })
                .catch(res => {
                    this.loading = false;
                });
        },
        handleChange(val) {
            if (val) {
                this.info.p_id = val.id;
                this.info.tj_title = val.title;
                this.getFentuan(val.id);
            } else {
                this.info.p_id = null;
                this.info.tj_title = "";
            }
        },
        //关闭弹框
        closeDialog() {
            this.clearForm();
            this.$emit("CB-dialogTiaoji");
        },
        clearForm() {
            this.fentuan = [];
            this.options = [];
            this.form = JSON.parse(JSON.stringify(formData));
            this.info = JSON.parse(JSON.stringify(infoData));
        }
    }
};
</script>
<style>
.cursorText input {
    cursor: text !important;
}
</style>
