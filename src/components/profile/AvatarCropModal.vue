<template>
  <div class="modal-overlay">
    <div class="modal-box">
      <!-- File input -->
      <input type="file" accept="image/*" @change="onFileChange" />

      <!-- Cropper -->
      <Cropper
        v-if="imageUrl"
        ref="cropperRef"
        :src="imageUrl"
        :stencil-component="CircleStencil"
        :stencil-props="{ aspectRatio: 1 }"
      />

      <div class="modal-actions">
        <button @click="$emit('closeModal')">Cancel</button>
        <button @click="crop">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const emit = defineEmits(['closeModal', 'save'])

const imageUrl = ref(null)
const cropperRef = ref(null)

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  imageUrl.value = URL.createObjectURL(file)
}

const crop = () => {
  const { canvas } = cropperRef.value.getResult()
  if (!canvas) return

  canvas.toBlob((blob) => {
    emit('save', blob)
  }, 'image/jpeg')
}
</script>