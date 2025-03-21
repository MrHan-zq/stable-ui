<template>
  <div class="text-to-image-page">
    <!-- 左侧内容区域 -->
    <div class="left-content">
      <!-- 检查点选择 -->
      <el-form label-width="100px" size="small">
        <el-form-item label="CHECKPOINT">
          <el-select v-model="checkpoint" placeholder="请选择" class="checkpoint" :disabled="loading">
            <el-option
                v-for="item in checkpoints"
                :key="item.modelName"
                :label="item.title"
                :value="item.modelName"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 正向提示词输入框 -->
        <!-- 正向提示词输入框 -->
        <div class="prompt-box">
          <label for="positive-prompt">正向提示词</label>
          <textarea id="positive-prompt" v-model="positivePrompt" placeholder="请输入..."></textarea>
        </div>

        <!-- 反向提示词输入框 -->
        <div class="prompt-box">
          <label for="negative-prompt">反向提示词</label>
          <textarea id="negative-prompt" v-model="negativePrompt" placeholder="请输入..."></textarea>
        </div>

        <!-- 采样方式、迭代步骤等设置 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采样方式">
              <el-select v-model="samplingMethod" placeholder="请选择">
                <el-option label="Euler" value="euler"></el-option>
                <el-option label="wqeqw" value="wqeqw"></el-option>
                <el-option label="dsgffdg" value="dsgffdg"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="LORA">
              <el-select v-model="lora" placeholder="请选择">
                <el-option label="Lora1" value="lora1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="迭代步骤">
              <el-slider v-model="iterationSteps" :min="1" :max="100"></el-slider>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风格选择">
              <el-select v-model="style" placeholder="请选择">
                <el-option label="写实" value="realistic"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 分辨率设置 -->
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="尺寸">
              <el-radio-group v-model="size" class="size-radio-group">
                <el-radio-button :label="256"></el-radio-button>
                <el-radio-button :label="512"></el-radio-button>
                <el-radio-button :label="1024"></el-radio-button>
                <el-radio-button :label="2048"></el-radio-button>
                <el-radio-button :label="4096"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="宽度">
              <div class="slider-with-input">
                <input type="number" v-model.number="width" min="1" max="4096" @input="handleWidthInput"/>
                <el-slider v-model="width" :min="1" :max="4096" @change="handleWidthChange"></el-slider>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="高度">
              <div class="slider-with-input">
                <input type="number" v-model.number="height" min="1" max="4096" @input="handleHeightInput"/>
                <el-slider v-model="height" :min="1" :max="4096" @change="handleHeightChange"></el-slider>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 其他设置 -->
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="生成数量">
              <el-radio-group v-model="quantity" class="size-radio-group">
                <el-radio-button label="1"></el-radio-button>
                <el-radio-button label="2"></el-radio-button>
                <el-radio-button label="4"></el-radio-button>
                <el-radio-button label="8"></el-radio-button>
                <el-radio-button label="16"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="随机数种子">
              <div class="slider-with-input">
                <input type="number" v-model.number="randomSeed" min="1" max="999999" @input="handleRandomSeedInput"/>
                <el-slider v-model="randomSeed" :min="1" :max="999999" @change="handleRandomSeedChange"></el-slider>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="引导系数">
              <div class="slider-with-input">
                <input type="number" v-model.number="guidanceScale" min="1" max="2000"
                       @input="handleGuidanceScaleInput"/>
                <el-slider v-model="guidanceScale" :min="1" :max="2000" @change="handleGuidanceScaleChange"></el-slider>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 右侧预览区域 -->
    <div class="right-preview">
      <div class="image-container">
        <img :src="previewImages[currentIndex]" alt="预览图像"/>
        <div class="navigation-buttons">
          <el-button @click="currentIndex = Math.max(0, currentIndex - 1)" :disabled="currentIndex === 0"
                     style="background: #8188d7;">
            ◀
          </el-button>
          <span>{{ currentIndex + 1 }} / {{ previewImages.length }}</span>
          <el-button @click="currentIndex = Math.min(previewImages.length - 1, currentIndex + 1)"
                     :disabled="currentIndex === previewImages.length - 1" style="background: #8188d7;">
            ▶
          </el-button>
        </div>
      </div>
      <el-button type="primary" @click="generateImage" :loading="loading" style="background: #8188d7;">贴图生成
      </el-button>
      <div class="info">
        <p>模型: {{ checkpoint }}</p>
        <p>风格: {{ style }}</p>
        <p>类型: 自然</p>
        <p>贴图类型: Diffuse</p>
        <p>分辨率: {{ width }} * {{ height }}</p>
        <p>随机数: {{ randomSeed }}</p>
        <p>正向提示词: {{ positivePrompt }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, watch, onUnmounted} from 'vue';
import {ElMessage, ElLoading} from 'element-plus';
import api from '../services/api';

export default {
  data() {
    return {
      positivePrompt: '',
      negativePrompt: ''
    };
  },

  setup() {
    const checkpoint = ref('');
    const checkpoints = ref([]);
    const positivePrompt = ref('');
    const negativePrompt = ref('');
    const samplingMethod = ref('euler');
    const lora = ref('lora1');
    const iterationSteps = ref(30);
    const style = ref('写实');
    const size = ref('512');
    const width = ref(512);
    const height = ref(512);
    const quantity = ref('1');
    const randomSeed = ref(140);
    const guidanceScale = ref(3.5);
    const previewImages = ref(['https://placehold.co/600x400']);
    const currentIndex = ref(0);
    const loading = ref(false);

    // 定义缓存键名
    const CACHE_KEY = 'textToImageFormData';
    const CHECK_POINT_KEY = 'checkpointData';
    const CHECK_POINTS_KEY = 'checkpointsData';
    // 保存数据到sessionStorage
    const saveFormData = () => {
      const formData = {
        positivePrompt: positivePrompt.value,
        negativePrompt: negativePrompt.value,
        samplingMethod: samplingMethod.value,
        lora: lora.value,
        iterationSteps: iterationSteps.value,
        style: style.value,
        size: size.value,
        width: width.value,
        height: height.value,
        quantity: quantity.value,
        randomSeed: randomSeed.value,
        guidanceScale: guidanceScale.value
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(formData));
      sessionStorage.setItem(CHECK_POINT_KEY, checkpoint.value);
      sessionStorage.setItem(CHECK_POINTS_KEY, JSON.stringify(checkpoints.value));
    };
// 加载缓存数据
    const loadFormData = () => {
      console.log('加载缓存数据++++++++++++++++++++++++++++++++')
      const savedData = sessionStorage.getItem(CACHE_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          let item = sessionStorage.getItem(CHECK_POINTS_KEY);
          let points = JSON.parse(item);
          // 数值型字段转换
          width.value = Number(parsedData.width) || 512;
          height.value = Number(parsedData.height) || 512;
          quantity.value = parsedData.quantity || '1';
          randomSeed.value = Number(parsedData.randomSeed) || 140;
          guidanceScale.value = Number(parsedData.guidanceScale) || 3.5;
          iterationSteps.value = Number(parsedData.iterationSteps) || 30;

          // 字符串字段
          checkpoint.value = sessionStorage.getItem(CHECK_POINT_KEY) || '';
          checkpoints.value = points || [];
          positivePrompt.value = parsedData.positivePrompt || '';
          negativePrompt.value = parsedData.negativePrompt || '';
          samplingMethod.value = parsedData.samplingMethod || 'euler';
          lora.value = parsedData.lora || 'lora1';
          style.value = parsedData.style || '写实';
          size.value = parsedData.size || '512';
        } catch (e) {
          console.error('加载缓存数据失败:', e);
        }
      }
    };
    const generateImage = () => {
      loading.value = true;
      const payload = {
        checkpoint: checkpoint.value,
        positivePrompt: positivePrompt.value,
        negativePrompt: negativePrompt.value,
        samplingMethod: samplingMethod.value,
        lora: lora.value,
        style: style.value,
        quantity: quantity.value,
        width: width.value,
        height: height.value,
        iterationSteps: iterationSteps.value,
        guidanceScale: guidanceScale.value,
        seed: randomSeed.value,
        size: size.value,
      };

      const loadingInstance = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      api.generateImage(payload)
          .then(response => {
            console.log('Image generated:', response.data);
            previewImages.value = response.data.list;
            currentIndex.value = previewImages.value.length - 1;
            ElMessage.success('生成成功');
          })
          .catch(error => {
            // ElMessage.error('生成失败:', error);
            ElMessage.error(`生成失败: ${error.message}`);
          })
          .finally(() => {
            if (loadingInstance) {
              loadingInstance.close();
            }
            loading.value = false;
          });
    };

    const handleWidthChange = (val) => {
      width.value = Math.min(Math.max(val, 1), 4096); // 确保值在1-2000之间
    };

    const handleWidthInput = (event) => {
      const rawValue = event.target.value;
      const parsedValue = parseInt(rawValue);

      if (!isNaN(parsedValue)) {
        const clampedValue = Math.min(Math.max(parsedValue, 1), 4096);
        width.value = clampedValue;
        // 同步到slider
        handleWidthChange(clampedValue);
      }
    };

    const handleHeightChange = (val) => {
      height.value = Math.min(Math.max(val, 1), 4096); // 确保值在1-2000之间
    };
    const handleHeightInput = (event) => {
      const rawValue = event.target.value;
      const parsedValue = parseInt(rawValue);

      if (!isNaN(parsedValue)) {
        const clampedValue = Math.min(Math.max(parsedValue, 1), 4096);
        height.value = clampedValue;
        // 同步到slider
        handleHeightChange(clampedValue);
      }
    };

    const handleRandomSeedChange = (val) => {
      randomSeed.value = Math.min(Math.max(val, 1), 999999); // 确保值在1-2000之间
    };
    const handleGuidanceScaleChange = (val) => {
      guidanceScale.value = Math.min(Math.max(val, 1), 2000); // 确保值在1-2000之间
    };

    const handleRandomSeedInput = (event) => {
      const rawValue = event.target.value;
      const parsedValue = parseInt(rawValue);

      if (!isNaN(parsedValue)) {
        const clampedValue = Math.min(Math.max(parsedValue, 1), 999999);
        randomSeed.value = clampedValue;
        // 同步到slider
        handleRandomSeedChange(clampedValue);
      }
    }
    const handleGuidanceScaleInput = (event) => {
      const rawValue = event.target.value;
      const parsedValue = parseInt(rawValue);

      if (!isNaN(parsedValue)) {
        const clampedValue = Math.min(Math.max(parsedValue, 1), 2000);
        guidanceScale.value = clampedValue;
        // 同步到slider
        handleGuidanceScaleChange(clampedValue);
      }
    };

    // 获取模型列表
    onMounted(async () => {
      try {
        // 先加载缓存数据
        loadFormData();
        console.log('loadFormData*************************',JSON.stringify(!checkpoints.value));
        if (!checkpoint.value){
          const response = await api.getCheckpoints();
          console.log('Checkpoints:', response.data);
          checkpoints.value = response.data.list;
          const selectedCheckpoint = checkpoints.value.find(item => item.isSelected);
          if (selectedCheckpoint) {
            checkpoint.value = selectedCheckpoint.modelName;
          } else if (checkpoints.value.length > 0) {
            checkpoint.value = checkpoints.value[0].modelName;
          }
          saveFormData();
        }
      } catch (error) {
        ElMessage.error('获取模型列表失败');
      }
    });

    // 组件卸载前保存数据
    onUnmounted(() => {
      saveFormData();
    });

    // 监听模型选择变化
    watch(checkpoint, async (newVal) => {
      const loadingInstance = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.5)'
      });
      try {
        loading.value = true;
        let point = sessionStorage.getItem(CHECK_POINT_KEY);
        if (point!==newVal){
          await api.updateCheckpoint(newVal);
          sessionStorage.setItem(CHECK_POINT_KEY, newVal);
          ElMessage.success('模型切换成功');
        }
      } catch (error) {
        ElMessage.error(`模型切换失败: ${error.message}`);
      } finally {
        if (loadingInstance) {
          loadingInstance.close();
        }
        loading.value = false;
      }
    });

    watch(size, (newVal) => {
      const sizeValue = Number(newVal);
      width.value = sizeValue;
      height.value = sizeValue;
      saveFormData();
    }, { deep: true }); // immediate:true 用于初始化时自动执行

    watch([
      positivePrompt, negativePrompt, samplingMethod,
      lora, iterationSteps, style, width, height, quantity,
      randomSeed, guidanceScale
    ], () => {
      saveFormData();
    }, { deep: true });

    return {
      checkpoints,
      loading,
      checkpoint,
      positivePrompt,
      negativePrompt,
      samplingMethod,
      lora,
      iterationSteps,
      style,
      size,
      width,
      height,
      quantity,
      randomSeed,
      guidanceScale,
      previewImages,
      currentIndex,
      generateImage,
      handleWidthChange,
      handleWidthInput,
      handleHeightChange,
      handleRandomSeedChange,
      handleGuidanceScaleChange,
      handleHeightInput,
      handleRandomSeedInput,
      handleGuidanceScaleInput,
    };
  },
};
</script>

<style>
/* 调整左侧内容区域配色 */
.el-form-item__label {
  color: #ecf0f1;
}

.el-select__wrapper {
  background-color: #333333FF;
  box-shadow: none;
}

.el-select__placeholder {
  color: #ecf0f1;
}

.el-slider {
  --el-slider-main-bg-color: #8188D7;
}

.el-slider__runway {
  background: #3F3F3FFF;
}

.el-button--primary {
  --el-button-bg-color: #8188D7;
}

.el-radio-button__inner {
  background: #3F3F3FFF;
  border: #3F3F3FFF;
  color: #bfbcbc;
  height: 30px;
  padding: 8px 11px !important;
}

.el-radio-button:first-child .el-radio-button__inner {
  border-left: none;
}

.el-radio-button.is-active .el-radio-button__original-radio:not(:disabled) + .el-radio-button__inner {
  background-color: #8188D7;
}

.left-content .el-radio-button .el-radio-button__inner {
  width: 4vw;
}

.el-form-item__label {
  justify-content: flex-start;
}

.el-row {
  margin-top: 20px;
}

.el-form-item__content .slider-with-input {
  display: flex;
  flex: 1;
  gap: 12px;
}

.el-form-item__content .slider-with-input input {
  margin-right: 10px;
  width: 70px;
  text-align: center;
  background: #3F3F3FFF;
  border: #3F3F3FFF;
  color: #bfbcbc;
  height: 20px;
}

.image-container {
  position: relative;
  margin-bottom: 20px;
}

.navigation-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
}

.navigation-buttons span {
  color: #ecf0f1;
  font-size: 14px;
}

.el-button {
  padding: 8px 15px;
  background-color: #409eff;
  border-color: #409eff;
}

.el-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

</style>

<style scoped>
.text-to-image-page {
  display: flex;
  height: 100vh;
  background-color: #282828;
}

.left-content {
  flex: 0 0 60%; /* 设置左侧内容区域的宽度为50% */
  padding: 20px;
  background-color: #282828;
  color: white;
}

.checkpoint {
  width: 15%;
}

.prompt-box {
  margin-bottom: 20px;
  background-color: #333333;
  border-radius: 4px;
  padding: 10px;
}

.prompt-box label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #ecf0f1;
}

.prompt-box textarea {
  width: 98%;
  height: 100px;
  padding: 10px;
  background-color: #434343;
  border: none;
  border-radius: 4px;
  color: #ecf0f1;
  font-size: 14px;
  resize: vertical;
}

.prompt-box textarea::placeholder {
  color: #ecf0f1;
  opacity: 0.5;
}


.right-preview {
  width: 40%; /* 设置右侧预览区域的宽度为50% */
  padding: 20px;
  background-color: #333333;
  color: white;
  display: grid;
  justify-content: center;
  flex: 1;
/*  background-color: #1a1a1a;*/
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.right-preview img {
  width: 30vw;
  margin-bottom: 35px;
}

.info {
  margin-top: 20px;
  background-color: #282828FF;
  color: #605e5e; /* 将字体颜色改为白色 */
  font-size: 14px;
  line-height: 1.5;
}

.info p {
  margin: 0;
  padding: 5px 0;
}

.size-radio-group {
  gap: 30px;
}

.image-container {
  position: relative;
  margin-bottom: 20px;
}

.el-button {
  padding: 8px 15px;
  background-color: #409eff;
  border-color: #409eff;
}

.el-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.right-preview {
  flex: 1;
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}
</style>
