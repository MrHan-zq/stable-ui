<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="app-container">
    <el-menu
      v-if="route"
      :default-active="route.path || '/text-to-image'"
      mode="horizontal"
      router
      class="nav-menu"
    >
      <el-menu-item index="/text-to-image">文生图</el-menu-item>
      <el-menu-item index="/image-to-image">图生图</el-menu-item>
      <el-menu-item index="/gallery">作品库</el-menu-item>
      <el-menu-item index="/square-grid">四方格</el-menu-item>
    </el-menu>
    <router-view class="main-content"/>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.nav-menu {
  padding: 0 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>
