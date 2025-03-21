import { defineStore } from 'pinia'

export const useGeneratedImages = defineStore('images', {
  state: () => ({
    gallery: [
      {
        url: 'https://picsum.photos/512',
        prompt: '测试图片1'
      },
      {
        url: 'https://picsum.photos/513',
        prompt: '测试图片2'
      }
    ],
    currentPage: 1,
    pageSize: 4
  }),
  actions: {
    addImages(newImages) {
      this.gallery.unshift(...newImages)
    },
    setPagination(page) {
      this.currentPage = page
    }
  },
  getters: {
    paginatedGallery: (state) => {
      const start = (state.currentPage - 1) * state.pageSize
      const end = start + state.pageSize
      return state.gallery.slice(start, end)
    }
  }
})