<template>
    <el-dialog v-el-drag-dialog :title="'疗休养线路'+title" width="650px" top="15vh" :visible="dialogDetail" @open="openDialog"
        @close="closeDialog">
        <el-row>
            <el-form :model="info" ref="info" label-suffix="：" label-width="110px">
                <h3>线路信息</h3>
                <el-form-item label="线路名称">{{info.title}}</el-form-item>
                <el-form-item label="线路说明" v-if="info.beizhu!=''">
                    <div v-html="info.beizhu"></div>
                </el-form-item>
                <el-col :span="12">
                    <el-form-item label="收费金额">{{info.sf||0}} 元</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="补贴金额">{{info.bt||0}} 元</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="疗休养时间">{{info.times[0]}} ~ {{info.times[1]}}</el-form-item>
                </el-col>
                <el-col :span="24">
                    <h3>分团信息</h3>
                    <span v-if="info.ft.length">
                        <el-form-item label="分团名称">{{info.ft.title||'--'}}</el-form-item>
                        <el-form-item label="领队信息">{{info.ft.ld||'--'}}</el-form-item>
                    </span>
                    <div v-else class="text-muted margin-bottom-10 margin-left-20">暂无分团信息</div>
                </el-col>
            </el-form>
        </el-row>
    </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令

import { MyliaoRead } from "@/api/myliao.js";

const infoData = {
    title: "",
    beizhu: "",
    bt: "",
    sf: "",
    ft: {
        title: "",
        ld: "",
        start_time: "",
        end_time: ""
    },
    bm_times: [],
    times: []
};

export default {
    name: "myliao",
    directives: { elDragDialog, waves },
    props: {
        mid: [Number, String],
        dialogDetail: Boolean
    },
    computed: {
        ...mapState(["user"])
    },
    data() {
        return {
            loading: false,
            info: JSON.parse(JSON.stringify(infoData)),
            title: "详情",
            rules: {}
        };
    },
    methods: {
        //打开弹出框
        openDialog() {
            if (this.mid) {
                this.getRead();
            }
        },
        //读取数据
        getRead() {
            this.loading = true;
            MyliaoRead(this.mid)
                .then(res => {
                    this.loading = false;
                    this.info = res;
                    this.form.p_id = res.id;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //关闭弹出框
        closeDialog() {
            this.clearForm();
            this.$emit("CB-dialogDetail");
        },
        //清理表单
        clearForm() {
            this.title = "详情";
            this.info = JSON.parse(JSON.stringify(infoData));
        }
    }
};
</script>

