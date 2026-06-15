<template>

  <div class="main overflow-hidden h-100 m-auto" style="width: 80%;">
    <div class="h-100 d-flex flex-column mt-5 border">
      <TipTapToolbar :editor="editor" v-if="editor" />
      <editor-content :editor="editor" class="h-100 overflow-y-auto" />
    </div>
  </div>

</template>

<script setup>
  import { onBeforeUnmount, onMounted } from 'vue';

  import { useEditor, EditorContent, Extension } from '@tiptap/vue-3'
  import { Placeholder } from '@tiptap/extensions';
  import StarterKit from '@tiptap/starter-kit';
  import TipTapToolbar from './TipTapToolbar.vue';
  import { useDocumentStore } from '@/stores/user/document.js';
  import { useRoute } from 'vue-router';

  const useDocument = useDocumentStore();
  const route = useRoute()

  const workspace_id = route.params.workspace_id;
  const team_id = route.params.team_id;
  const document_id = route.params.document_id

  const emit = defineEmits(['update:modelValue'])
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {},
        hardBreak: {},
      }),
      Placeholder.configure({
        placeholder: 'Write something, or press / for commands…',
      }),
    ],

    editorProps: {
      attributes: {
      },
    },


    injectCSS: false,

    onUpdate: async () => {
      emit('update:modelValue', editor.value.getHTML())
      await useDocument.updateContentDocument(workspace_id, team_id, document_id, editor.value.getHTML());
    },

  })

  onMounted(async () => {
    const res = await useDocument.getDocumentById(workspace_id, team_id, document_id);
    editor.value.commands.setContent(res.content);
    editor.value.chain().focus().run()
  })

  onBeforeUnmount(() => {
    editor.value?.destroy()
  })


</script>

<style scoped>

  :deep(.tiptap) {
    height: 100%;
    background-color: var(--bs-white);
    outline: none;
    padding: 20px;
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