<template>

  <div class="editor-format mb-3">

    <n-space>
      <n-button-group>
        <n-select class="n-select" v-model:value="value" :options="options" @update:value="setHeading(value)" />
        <ToolbarButton :type="editor.isActive(tool.class) ? 'primary' : 'default'" class="n-button" :icon="tool.icon"
          v-for="(tool, index) in icons" :key="index" :action="tool.fn" />
      </n-button-group>
    </n-space>

  </div>

</template>

<script setup>
  import { Bold, Italic, Quote, Strikethrough, Underline } from 'lucide-vue-next';
  import ToolbarButton from './ToolbarButton.vue';
  import { ref } from 'vue';

  const props = defineProps({
    editor: Function
  })

  const icons = [
    { icon: Italic, fn: () => props.editor.chain().focus().toggleItalic().run(), class: 'italic' },
    { icon: Bold, fn: () => props.editor.chain().focus().toggleBold().run(), class: 'bold' },
    { icon: Quote, fn: () => props.editor.chain().focus().setBlockquote().run(), class: 'strike' },
    { icon: Strikethrough, fn: () => props.editor.chain().focus().toggleStrike().run(), class: 'strike' },
    { icon: Underline, fn: () => props.editor.chain().focus().toggleUnderline().run(), class: 'underline' }
  ]

  const value = ref(0);
  const options = [
    { label: 'Paragraph', value: 0 },
    { label: 'Heading 1', value: 1 },
    { label: 'Heading 2', value: 2 },
    { label: 'Heading 3', value: 3 },
  ];


  function setHeading(n) {
    const chain = props.editor.chain().focus();
    n === 0 ? chain.setParagraph().run() : chain.toggleHeading({ level: n }).run();
  }


</script>

<style scoped>

  :deep(.n-button) {
    --n-bezier: cubic-bezier(.4, 0, .2, 1) !important;
    --n-bezier-ease-out: cubic-bezier(0, 0, .2, 1) !important;
    --n-ripple-duration: .2s !important;
    --n-opacity-disabled: 0.5 !important;
    --n-wave-opacity: 0.6 !important;
    --n-font-weight: 400 !important;
    --n-color: #0000 !important;
    --n-color-hover: #3f3f3f !important;
    --n-color-pressed: #0000 !important;
    --n-color-focus: #0000 !important;
    --n-color-disabled: #0000 !important;
    --n-ripple-color: var(--bs-gray) !important;
    --n-text-color: rgb(51, 54, 57) !important;
    --n-text-color-hover: var(--bs-white) !important;
    --n-text-color-pressed: var(--bs-black) !important;
    --n-text-color-focus: var(--bs-black) !important;
    --n-text-color-disabled: rgb(51, 54, 57) !important;
    --n-border: 1px solid rgb(224, 224, 230) !important;
    --n-border-hover: 1px solid var(--bs-gray) !important;
    --n-border-pressed: 1px solid var(--bs-gray) !important;
    --n-border-focus: 1px solid var(--bs-gray) !important;
    --n-border-disabled: 1px solid rgb(224, 224, 230) !important;
    --n-width: initial !important;
    --n-height: 34px !important;
    --n-font-size: 14px !important;
    --n-padding: 0 14px !important;
    --n-icon-size: 18px !important;
    --n-icon-margin: 6px !important;
    --n-border-radius: 3px !important;
  }

  :deep(.n-button--primary-type) {
    --n-color: #000000 !important;
    --n-text-color: white !important;
  }

</style>