<template>
  <div class="editor-format mb-3">
    <n-button-group horizontal>
      <n-button round @click="editor.chain().focus().toggleItalic().run()">
        <template #icon>
          <n-icon>
            <Italic />
          </n-icon>
        </template>
      </n-button>
      <n-button ghost @click="editor.chain().focus().toggleBold().run()">
        <template #icon>
          <n-icon>
            <Bold />
          </n-icon>
        </template>
      </n-button>
      <n-button ghost @click="editor.chain().focus().toggleBlockquote().run()">
        <template #icon>
          <n-icon>
            <Quote />
          </n-icon>
        </template>
      </n-button>
      <n-button round @click="editor.chain().focus().toggleCodeBlock().run()">
        <template #icon>
          <n-icon>
            <Code />
          </n-icon>
        </template>
      </n-button>
    </n-button-group>
  </div>
  <editor-content :editor="editor" class="h-100" />
</template>

<script setup>
  import { useEditor, EditorContent } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import { Code, Italic, Quote } from 'lucide-vue-next';

  const editor = useEditor({
    extensions: [StarterKit],
    injectCSS: false,
    autofocus: true,
    
  })
</script>

<style scoped>

  :deep(.tiptap) {
    height: 97% !important;
    background-color: var(--bs-white);
    outline: none;
    padding: 20px;
    border-radius: 20px;
    overflow: hidden scroll;
  }

  :deep(.tiptap::-webkit-scrollbar) {
    appearance: none;
  }
</style>