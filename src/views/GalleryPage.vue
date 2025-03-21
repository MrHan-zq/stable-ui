<template>
  <div class="gallery-container">
    <el-row :gutter="24" class="main-container">
      <el-col :span="24">
        <el-row :gutter="12">
          <el-col 
            v-for="(image, index) in images"
            :key="index"
            :xs="12" :sm="8" :md="6" :lg="6"
          >
            <el-card class="image-card">
              <el-image 
                :src="image.imgUrl" 
                fit="cover"
                :preview-src-list="[image.imgUrl]"
              />
              <div class="image-meta">
                <span>{{ image.fileName }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change="handlePageChange"
    />-->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus';
import axios from '@/services/api'

const images = ref([])
const total = ref(0)
const pageSize = ref(12)
const loading = ref(false)

const fetchGalleryData = async (page = 1) => {
  try {
    loading.value = true
    const response = await axios.getimgList()
    images.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    console.error('获取画廊数据失败:', error)
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  fetchGalleryData(page)
}

onMounted(() => {
  fetchGalleryData()
})
</script>

<style scoped>
.gallery-container {
  padding: 20px;
  background: #333333FF;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
}

.meta-card {
  margin-left: 24px;
  padding: 20px;
}

.meta-title {
  margin-bottom: 15px;
  color: #606266;
  font-size: 16px;
}

.meta-item {
  margin: 15px 0;
  font-size: 14px;
}

.label {
  color: #909399;
  margin-right: 10px;
}

.value {
  color: #606266;
  font-weight: 500;
}

.image-card {
  margin-bottom: 12px;
}

.image-meta {
  padding: 10px 0;
  font-size: 0.9em;
  color: #c9c3c3;
}
</style>