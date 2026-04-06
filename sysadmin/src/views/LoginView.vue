<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { bootstrapAdminData } from "../services/bootstrap";
import { useSessionStore } from "../stores/session";
import type { AdminRole } from "../types/admin";

const router = useRouter();
const sessionStore = useSessionStore();

const form = reactive({
  username: "admin",
  password: "maxplus123",
  role: "super-admin" as AdminRole
});

const submit = async () => {
  if (!form.username || !form.password) {
    ElMessage.error("请输入用户名和密码。");
    return;
  }

  try {
    await sessionStore.login(form.username, form.password, form.role);
    await bootstrapAdminData();
    ElMessage.success(sessionStore.isMockMode ? "后端不可用，已进入本地演示模式。" : "登录成功。");
    await router.push("/dashboard");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "登录失败。");
  }
};
</script>

<template>
  <div class="login-screen">
    <div class="login-card">
      <div class="login-card__copy">
        <p class="login-card__eyebrow">Operations Console</p>
        <h1>MaxPlus 独立站后台管理系统</h1>
        <p>集中管理网站基础设置、商品、视频、博客、首页内容、SEO、询盘和订阅数据。</p>

        <div class="login-card__highlights">
          <article class="login-highlight">
            <strong>首页运营</strong>
            <span>统一调整轮播、分类、视频、评价和联系模块。</span>
          </article>
          <article class="login-highlight">
            <strong>商品与内容</strong>
            <span>商品、分类、视频、博客和品牌故事统一维护。</span>
          </article>
          <article class="login-highlight">
            <strong>线索处理</strong>
            <span>前台询盘与订阅数据在同一后台集中查看和跟进。</span>
          </article>
        </div>
      </div>

      <el-form class="login-form" label-position="top" @submit.prevent="submit">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password" show-password placeholder="请输入密码" />
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="超级管理员" value="super-admin" />
            <el-option label="运营" value="operator" />
            <el-option label="客服" value="support" />
          </el-select>
        </el-form-item>

        <el-button type="primary" class="login-form__button" @click="submit">
          登录系统
        </el-button>
      </el-form>
    </div>
  </div>
</template>
