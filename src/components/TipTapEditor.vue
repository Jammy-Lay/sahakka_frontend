<template>

  <TipTapToolbar :editor="editor" v-if="editor"/>
  <editor-content :editor="editor" class="h-100" />

</template>

<script setup>
  import { onBeforeUnmount } from 'vue';

  import { useEditor, EditorContent } from '@tiptap/vue-3'
  import { Placeholder, CharacterCount } from '@tiptap/extensions';
  import StarterKit from '@tiptap/starter-kit'
  import TipTapToolbar from './TipTapToolbar.vue';
  import Blockquote from '@tiptap/extension-blockquote'
  import { HardBreak } from '@tiptap/extension-hard-break'

  
  const emit = defineEmits(['update:modelValue'])
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something, or press / for commands…',
      }),
      Blockquote,
      HardBreak,
    ],

    editorProps: {
      attributes: {
      }
    },

    injectCSS: false,
    autofocus: true,

    onUpdate: () => {
      emit('update:modelValue', editor.value.getHTML())
    },

  })

  onBeforeUnmount(() => editor.value?.destroy())

</script>

<style scoped>

  :deep(.tiptap) {
    height: 97% !important;
    background-color: var(--bs-white);
    outline: none;
    padding: 20px;
    border-radius: 20px;
    overflow: hidden scroll;

    blockquote {
      border-left: 3px solid var(--bs-gray);
      padding-left: 1rem;
    }

    p {
      margin: 0;
    }
  }

  :deep(.ProseMirror) {
    white-space: pre-wrap;
  }

  :deep(.tiptap::-webkit-scrollbar) {
    appearance: none;
  }

  :deep(.tiptap p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
  }
</style>