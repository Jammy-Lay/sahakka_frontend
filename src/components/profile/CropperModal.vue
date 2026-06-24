<template>
    <Teleport to="body">
        <div class="modal-overlay" @click.self="handleClose"> <!-- ✅ changed from $emit('closeModal') -->
            <div class="modal-box">
                <h3 class="modal-title">Update Profile Photo</h3>
                <div v-if="!imageUrl" class="upload-area" @click="triggerFileInput">
                    <div class="upload-icon">
                        <Camera size="32" />
                    </div>
                    <p>Click to choose an image</p>
                    <input ref="fileInputRef" type="file" accept="image/*" class="hidden-input"
                        @change="onFileChange" />
                </div>

                <!-- Step 2: Image loaded → show cropper -->
                <div v-else class="cropper-wrapper">
                    <Cropper ref="cropperRef" :src="imageUrl" :stencil-component="CircleStencil"
                        :stencil-props="{ aspectRatio: 1 }" class="cropper" />
                </div>

                <div class="modal-actions">
                    <button class="btn-cancel" @click="handleClose"> <!-- ✅ changed from $emit('closeModal') -->
                        Cancel
                    </button>
                    <button v-if="imageUrl" class="btn-save" :disabled="props.disable" @click="crop">
                        <span v-if="props.disable" class="spinner-border spinner-border-sm me-2" />
                        {{ props.disable ? "Saving..." : "Save" }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { Camera } from 'lucide-vue-next'
import { ref } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const emit = defineEmits(['closeModal', 'save'])

const props = defineProps({
    disable: {
        type: Boolean,
        default: false,
    }
})

const imageUrl = ref(null)
const cropperRef = ref(null)
const fileInputRef = ref(null)
const MAX_SIZE_MB = 2


const triggerFileInput = () => fileInputRef.value?.click()

const onFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // 1. Must be an image
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, WEBP...)')
        e.target.value = ''
        return
    }

    // 2. Max file size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`Image must be smaller than ${MAX_SIZE_MB}MB`)
        e.target.value = ''
        return
    }

    // 3. Revoke previous object URL to avoid memory leak
    if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value)
    }

    imageUrl.value = URL.createObjectURL(file)
}


const handleClose = () => {
    if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value)
        imageUrl.value = null
    }
    emit('closeModal')
}

const crop = () => {
    const { canvas } = cropperRef.value.getResult()
    if (!canvas) return
    canvas.toBlob((blob) => emit('save', blob), 'image/jpeg')
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-box {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    width: 420px;
    max-width: 90vw;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    text-align: center;
}

.upload-area {
    border: 2px dashed #ccc;
    border-radius: 12px;
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: border-color 0.2s;
}

.upload-area:hover {
    border-color: #555;
}

.upload-icon {
    font-size: 40px;
}

.upload-area p {
    color: #666;
    margin: 0;
}

.hidden-input {
    display: none;
}

.cropper-wrapper {
    border-radius: 12px;
    overflow: hidden;
    height: 320px;
}

.cropper {
    height: 100%;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn-cancel {
    padding: 8px 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
}

.btn-cancel:hover {
    background: #f5f5f5;
}

.btn-save {
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    background: #1a1a2e;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
}

.btn-save:hover {
    background: #333;
}
</style>