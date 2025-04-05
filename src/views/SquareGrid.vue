<template>
  <div class="container" style="width: 100%; height: 100%;">
    <!-- 头部 -->
    <header>
      <h1>四方连续贴图转换</h1>
    </header>

    <!-- 主体 -->
    <main class="main-content" style="margin-top: 5%;">
      <!-- 左侧原始图片区域 -->
      <div class="preview-container left-container">
        <h2>原始图片</h2>
        <div class="image-container">
          <img
              :src="originalImageSrc"
              alt="原始图片"
              class="preview-image"
              v-if="originalImageSrc"
          >
        </div>
        <button class="upload-button" @click="$refs.imageInput.click()">选择图片</button>
        <input
            type="file"
            ref="imageInput"
            accept="image/*"
            hidden
            @change="handleImageUpload"
        >
      </div>

      <!-- 中间箭头 -->
      <div class="arrow-container">
        <i class="el-icon-refresh"></i>
      </div>

      <!-- 右侧生成效果区域 -->
      <div class="preview-container right-container">
        <h2>生成效果</h2>
        <div class="image-container">
          <canvas
              ref="resultCanvas"
              class="preview-image"></canvas>
        </div>
        <button
            class="download-button"
            :disabled="!isGenerated"
            @click="handleDownload"
        >下载图片</button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      originalImageSrc: '',
      isGenerated: false,
      canvasContext: null,
      canvasWidth: 0,
      canvasHeight: 0
    }
  },
  mounted() {
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.resultCanvas;
      const containerWidth = this.$el.querySelector('.image-container').offsetWidth;
      canvas.width = containerWidth;
      canvas.height = containerWidth;

      this.canvasContext = canvas.getContext('2d');
      this.canvasWidth = canvas.width;
      this.canvasHeight = canvas.height;
    },
    handleImageUpload(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.originalImageSrc = e.target.result;
          setTimeout(() => {
            this.generatePattern();
          }, 50);
        };
        reader.onerror = (error) => {
          console.error('文件读取失败:', error);
          alert('图片读取失败，请重试');
        };
        reader.readAsDataURL(file);
      }
    },
    generatePattern() {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const targetWidth = Math.max(img.width, this.canvasWidth / 2);
        const targetHeight = Math.max(img.height, this.canvasHeight / 2);

        // 设置画布大小为原始图片的两倍
        this.$refs.resultCanvas.width = targetWidth * 2;
        this.$refs.resultCanvas.height = targetHeight * 2;

        // 创建无缝图案
        this.createSeamlessPattern(img, targetWidth, targetHeight);
        this.isGenerated = true;
      };
      img.onerror = (error) => {
        console.error('图片加载失败:', error);
        alert('图片加载失败，请检查文件格式');
      };
      img.src = this.originalImageSrc;
    },
    createSeamlessPattern(img, targetWidth, targetHeight) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = targetWidth;
      tempCanvas.height = targetHeight;
      const ctx = tempCanvas.getContext('2d');

      // 绘制原始图片到临时画布
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // 创建水平镜像
      const horizontalCanvas = this.createHorizontalMirror(tempCanvas);
      // 创建垂直镜像
      const verticalCanvas = this.createVerticalMirror(horizontalCanvas);
      // 合并图案
      this.combinePattern(verticalCanvas, targetWidth, targetHeight);
    },
    createHorizontalMirror(sourceCanvas) {
      const canvas = document.createElement('canvas');
      canvas.width = sourceCanvas.width;
      canvas.height = sourceCanvas.height;
      const ctx = canvas.getContext('2d');

      // 绘制原始图像
      ctx.drawImage(sourceCanvas, 0, 0);
      
      // 创建水平镜像
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(1, -1);
      ctx.drawImage(sourceCanvas, 0, 0);
      ctx.restore();

      return canvas;
    },
    createVerticalMirror(sourceCanvas) {
      const canvas = document.createElement('canvas');
      canvas.width = sourceCanvas.width;
      canvas.height = sourceCanvas.height;
      const ctx = canvas.getContext('2d');

      // 绘制原始图像
      ctx.drawImage(sourceCanvas, 0, 0);
      
      // 创建垂直镜像
      ctx.save();
      ctx.translate(0, canvas.height);
      ctx.scale(-1, 1);
      ctx.drawImage(sourceCanvas, 0, 0);
      ctx.restore();

      return canvas;
    },
    combinePattern(canvas, targetWidth, targetHeight) {
      const ctx = this.$refs.resultCanvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      const drawSection = (x, y) => {
        ctx.drawImage(canvas, x * targetWidth, y * targetHeight, targetWidth, targetHeight);
      };

      drawSection(0, 0);
      drawSection(1, 0);
      drawSection(0, 1);
      drawSection(1, 1);
    },
    handleDownload() {
      const link = document.createElement('a');
      link.download = '四方连续图.png';
      link.href = this.$refs.resultCanvas.toDataURL('image/png');
      link.click();
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #2c2c2c;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-content {
  display: flex;
  justify-content: flex-start;
  width: 60%;
  /*margin-top: 20px;*/
}

.preview-container {
  background-color: #444;
  border-radius: 8px;
  padding: 20px;
  width: 45%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 55vh;
}

.left-container {
  margin-right: 20px;
}

.right-container {
  margin-left: 20px;
}

.arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #aaa;
}

.upload-button, .download-button {
  background-color: #6a5acd;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  height: 36px;
  width: 100%; /* 确保按钮宽度一致 */
}

.upload-button:hover, .download-button:hover {
  background-color: #5a4ac9;
}

.image-container {
  margin: 20px 0;
  max-height: 70%;
}

.preview-image {
  max-width: 100%;
  height: 100%;
  border-radius: 4px;
}

h1 {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 10px;
}
.app-container{
  min-height: 96vh;
}
</style>
