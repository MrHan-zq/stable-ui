import axios from 'axios';

const apiClient = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || (console.warn('VITE_API_BASE_URL not configured, using default API endpoint'), '/api'),
  baseURL: 'http://localhost:50000/',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const uploadClient = axios.create({
  baseURL: 'http://localhost:50000/',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    // 可在此添加token等处理
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

const API_ENDPOINTS = {
  TEXT_IMG: '/img/txt2img',
  IMG_TO_IMG: '/img/img2img',
};

export default {
  updateCheckpoint(checkpoint) {
    return apiClient.get(`/set/sd/model?modelName=${checkpoint}`);
  },
  getCheckpoints() {
    return apiClient.get('/sd/model/configs');
  },
  generateImage: (payload) => {
    console.log('Original payload:', JSON.stringify(payload, null, 2));
    return apiClient.post(API_ENDPOINTS.TEXT_IMG, payload);
  },
  generateImageToImage: (formData) => {
    return apiClient.post(API_ENDPOINTS.IMG_TO_IMG, formData);
  },
  getimgList: () => {
    return apiClient.get('/img/get/list/all');
  },
};

export { apiClient };