<template>
    <el-dialog v-el-drag-dialog title="报名详情" top="0" width="500px" custom-class="pull-right no-margin demo-dialog"
        :visible="dialogDetailstatus" @open="openDialog" @close="closeDialog">
        <div v-bind:style="{ 'height': _PageHeight - 10 +'px','overflow' :'auto'}" v-loading="loading"
            element-loading-text="数据载入中">
            <el-form label-width="120px" label-suffix="：" class="padding-5">
                <el-collapse v-model="activeNames">
                    <el-collapse-item name="1">
                        <template slot="title">
                            <i class="header-icon el-icon-info"></i>
                            <div class="font-110 text-bold margin-left-5">基本信息</div>
                        </template>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="教师姓名" class="wrap">{{form.name||'--'}}</el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="工号">{{form.account||'--'}}</el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="性别">{{form.sex===2?'女':'男'}}</el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="年龄">{{form.age||'--'}}</el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="身份证号" class="wrap">{{form.sfz||'--'}}</el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="所在部门" class="wrap">{{form.xisuo_title||'--'}}</el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="手机号码" class="wrap">{{form.phone||'--'}}</el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="电话号码" class="wrap">{{form.tel||'--'}}</el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="电子邮箱" class="wrap">{{form.email||'--'}}</el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="申请时间" class="wrap">{{form.add_time||'--'}}</el-form-item>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                        <template slot="title">
                            <i class="header-icon el-icon-info"></i>
                            <div class="font-110 text-bold margin-left-5">报名线路信息</div>
                        </template>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="线路名称" class="wrap">
                                    {{form.title||'--'}}
                                </el-form-item>
                                <el-form-item label="线路说明" class="wrap" v-if="form.beizhu">
                                    <span v-html="Trim(form.beizhu)"></span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="疗休养周期" class="wrap">{{form.start_time}} 至 {{form.end_time}} 年</el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="总价" class="wrap">{{form.sf|| 0}} 元</el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="自费门票" class="wrap">{{form.bt|| 0}} 元</el-form-item>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                    <el-collapse-item name="3">
                        <template slot="title">
                            <i class="header-icon el-icon-info"></i>
                            <div class="font-110 text-bold margin-left-5">分团信息</div>
                        </template>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="分团名称" class="wrap">
                                    {{form.title||'--'}}
                                </el-form-item>
                                <el-form-item label="领队信息" class="wrap">
                                    {{form.title||'--'}}
                                </el-form-item>
                                <el-form-item label="出行时间" class="wrap">
                                    {{form.title||'--'}}
                                </el-form-item>
                                <el-form-item label="分团发布状态" class="wrap">
                                    {{form.title||'--'}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </el-form>
        </div>
    </el-dialog>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import { ApplyRead } from "@/api/apply";
const formData = {
    name: "",
    account: "",
    school: "",
    school_title: "",
    sex: 1,
    age: null,
    phone: "",
    tel: "",
    email: "",
    sfz: "",
    add_time: "",
    title: "",
    start_time: "",
    end_time: "",
    sh_beizhu: "",
    sf: 420,
    sqly: "",
    status: null,
    beizhu: ""
};

export default {
    name: "apply_shenpi",
    props: {
        dialogDetailstatus: Boolean,
        did: [String, Number]
    },
    directives: { elDragDialog },
    data() {
        return {
            loading: false,
            activeNames: ["1", "2", "3"],
            form: JSON.parse(JSON.stringify(formData)),
            rules: {}
        };
    },
    methods: {
        openDialog() {
            if (this.did === null || this.did === "") return;
            this.getRead();
        },
        getRead() {
            this.loading = true;
            ApplyRead(this.did)
                .then(res => {
                    this.form = res;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        closeDialog() {
            this.$emit("CB-dialogDetailstatus");
            this.clearForm();
        },
        clearForm() {
            this.activeNames = ["1", "2", "3"];
            this.form = JSON.parse(JSON.stringify(formData));
        },
        //替换回车符
        Trim(str) {
            return str.toString().replace(/\n|\r\n\↵/g, "<br/>");
        }
    }
};
</script>
<style>
.demo-dialog .el-dialog__body {
    padding: 30px 0 30px 20px !important;
}
.demo-dialog .el-form-item--medium .el-form-item__content,
.demo-dialog .el-form-item--medium .el-form-item__label {
    line-height: 20px !important;
}
.demo-dialog .el-form-item {
    margin-bottom: 15px !important;
}
</style>
