import { createRouter, createWebHistory } from 'vue-router'
import GalleryPage from '@/views/GalleryPage.vue'
import TextToImagePage from '@/views/TextToImagePage.vue'
import ImageToImagePage from '@/views/ImageToImagePage.vue'
import SquareGrid from "@/views/SquareGrid.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/gallery',
      name: 'gallery',
      component: GalleryPage
    },
    {
      path: '/text-to-image',
      name: 'text-to-image',
      component: TextToImagePage
    },
    {
      path: '/image-to-image',
      name: 'image-to-image',
      component: ImageToImagePage
    },
    {
      path: '/square-grid',
      name: 'square-grid',
      component: SquareGrid
    },
    {
      path: '/',
      redirect: '/text-to-image'
    }
  ]
})

export default router