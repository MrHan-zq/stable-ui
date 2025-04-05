<template>
  <div class="gallery-container">
    <div class="left-content">
      <!-- 左侧图片列表 -->
      <el-row :gutter="24" class="main-container">
        <el-col :span="16">
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
                    @click="selectImage(index)"
                />
                <div class="image-meta">
                  <span>{{ image.fileName }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <!-- 右侧预览区域 -->
    <div class="right-preview">
      <div class="image-container">
        <img :src="selectedImage?.imgUrl" alt="预览图像"/>
      </div>
      <div class="info">
        <p>文件名: {{ selectedImage?.fileName }}</p>
        <p>尺寸: {{ selectedImage?.width }} × {{ selectedImage?.height }}</p>
        <p>创建时间: {{ selectedImage?.createTime }}</p>
        <p>模型版本: {{ selectedImage?.modelVersion }}</p>
      </div>
    </div>
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

// 新增响应式数据
const currentIndex = ref(0)
const selectedImage = ref(null)

const fetchGalleryData = async (page = 1) => {
  try {
    loading.value = true
    const response = await axios.getimgList()
    images.value = response.data.list
    if (images.value.length > 0) {
      selectImage(0)
    }
    total.value = response.data.total
  } catch (error) {
    console.error('获取画廊数据失败:', error)
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGalleryData()
})

const selectImage = (index) => {
  currentIndex.value = index
  selectedImage.value = images.value[index]
}

</script>

<style scoped>
.gallery-container {
  display: flex;
  height: 100%;
  padding: 20px;
  background-color: #282828;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
}

.image-card {
  margin-bottom: 12px;
}

.image-meta {
  padding: 10px 0;
  font-size: 0.9em;
  color: #c9c3c3;
}

.right-preview {
  padding: 20px;
  background-color: #333333;
  color: white;
  height: calc(100vh - 40px);
  position: sticky;
  top: 0;
}

.image-container {
  position: relative;
  margin-bottom: 20px;
  height: 50vh;
}

.image-container img {
  width: 100%;
  height: 50vh;
  object-fit: contain;
}

.info {
  margin-top: 20px;
  padding: 15px;
  background-color: #282828;
  border-radius: 4px;
}

.info p {
  margin: 8px 0;
  color: #c9c3c3;
  font-size: 14px;
}

.left-content {
  flex: 0 0 60%; /* 设置左侧内容区域的宽度为60% */
  padding: 20px;
  background-color: #282828;
  color: white;
}

.right-preview {
  width: 40%; /* 设置右侧预览区域的宽度为40% */
  padding: 20px;
  background-color: #333333;
  color: white;
  display: grid;
  justify-content: center;
}

</style>
<style>
.el-card__body{
  background: #6d6b6b;
  padding: 0;
}
.el-card{
  --el-card-border-color: none;
}
</style>
