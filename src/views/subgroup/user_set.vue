<template>
    <el-dialog v-el-drag-dialog :title="xtitle" top="13vh" append-to-body width="800px" :visible="dialogUserset" @open="openDialog"
        @close="closeDialog">
        <el-form :model="form" :rules="rules" ref="form" label-suffix="：" label-position="top">
            <el-form-item label="成员设置" class="demo-transfer">
                <el-transfer style="text-align: left; display: inline-block" v-model="form.items" filterable
                    filter-placeholder="请输入教师姓名、工号、所属部门" :titles="['报名人员', '分团成员']" :button-texts="['移除分团', '加入分团']"
                    :format="{ noChecked: '${total}', hasChecked: '${checked}/${total}'}" :data="peopleData">
                    <span slot-scope="{ option }">{{ option.label }}</span>
                    <el-button class="transfer-footer pull-right padding-right-5" slot="right-footer" type="text"
                        v-waves size="mini" @click="handleEmpty">全部移除</el-button>
                </el-transfer>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="btn_loading" v-waves v-if="authCheck(83)" @click="saveData('form ')">
                <svg-icon icon-class="keep"></svg-icon> 确认保存
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令

import { TeamPeople, TeamSet } from "@/api/line";

const formData = {
    items: []
};
export default {
    name: "user_set",
    props: {
        dialogUserset: Boolean,
        ftid: [String, Number],
        xlid: [String, Number],
        xtitle: String
    },
    computed: {
        clientHeight() {
            return this.$store.state.clientHeight - 115;
        }
    },
    directives: { elDragDialog, waves },
    data() {
        return {
            peopleData: [],
            loading: false,
            btn_loading: false,
            form: JSON.parse(JSON.stringify(formData)),
            rules: {
                items: [
                    {
                        required: true,
                        message: "请设置成员",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    methods: {
        openDialog() {
            if (this.ftid === null || this.ftid === "") return;
            this.getRead();
        },
        handleEmpty() {
            this.form.items = [];
        },
        getRead() {
            this.loading = true;
            TeamPeople(this.xlid, this.ftid)
                .then(res => {
                    this.peopleData = res.data;
                    this.form.items = res.items;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        saveData(form) {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.btn_loading = true;
                    this.form.id = this.ftid;
                    TeamSet(this.form, "put")
                        .then(res => {
                            this.$message.success("保存成功！");
                            this.$emit("CB-dialogUserset", true);
                            this.btn_loading = false;
                            this.clearForm();
                        })
                        .catch(() => {
                            this.btn_loading = false;
                        });
                }
            });
        },
        closeDialog() {
            this.$emit("CB-dialogUserset");
        },
        clearForm() {
            this.form = JSON.parse(JSON.stringify(formData));
            this.peopleData = [];
            this.$refs["form"].resetFields();
        }
    }
};
</script>
<style>
.demo-transfer .el-transfer-panel {
    width: 300px !important;
}
.el-transfer-panel .el-transfer-panel__footer {
    height: 30px !important;
}
.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 14px !important;
}
.el-transfer-panel__body {
    min-height: 350px !important;
}
.el-transfer-panel__list.is-filterable {
    min-height: 300px !important;
}
</style>
