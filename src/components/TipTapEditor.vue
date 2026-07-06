<template>
  <div class="main overflow-hidden h-100 m-auto pt-4">
    <div class="h-100 d-flex flex-column border rounded-3 overflow-hidden">
      <TipTapToolbar :editor="editor" v-if="editor" :title="title" />
      <editor-content :editor="editor" class="h-100 overflow-y-auto" />
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useEditor, EditorContent, Extension } from "@tiptap/vue-3";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TipTapToolbar from "./TipTapToolbar.vue";
import { useDocumentStore } from "@/stores/user/document.js";
import { useRoute } from "vue-router";
import Image from "@tiptap/extension-image";
import { socket } from "@/utils/socket";

const useDocument = useDocumentStore();
const route = useRoute();

const workspace_id = route.params.workspace_id;
const team_id = route.params.team_id;
const document_id = route.params.document_id;

const title = ref("");
let saveTimeout = null;
let isLocalUpdate = false;

const PreventTab = Extension.create({
  name: "preventTab",
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        editor.value.commands.insertContent("\t");
        return true;
      },
      "Shift-Tab": () => {
        editor.value.commands.sinkListItem();
      },
    };
  },
});

const emit = defineEmits(["update:modelValue"]);
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      blockquote: {},
      hardBreak: {},
      history: {},
      underline: false,
    }),
    Placeholder.configure({
      placeholder: "Write something…",
    }),
    Image.configure({ allowBase64: true }),
    Underline,
    PreventTab,
  ],
  editorProps: {
    handlePaste(view, event) {
      const text = event.clipboardData?.getData("text/plain") ?? "";
      const isImageUrl = text.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
      if (isImageUrl) {
        view.dispatch(
          view.state.tr.replaceSelectionWith(
            view.state.schema.nodes.image.create({ src: text })
          )
        );
        return true;
      }
      return false;
    },
  },
  injectCSS: false,
  onUpdate: () => {
    emit("update:modelValue", editor.value.getHTML());

    isLocalUpdate = true;

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      await useDocument.updateContentDocument(
        workspace_id,
        team_id,
        document_id,
        editor.value.getHTML()
      );
      setTimeout(() => {
        isLocalUpdate = false;
      }, 300);
    }, 800);
  },
});

const handleDocumentUpdated = (data) => {
  if (String(data.document_id) !== String(document_id)) return;
  if (isLocalUpdate) return;

  const incoming = data.content;
  const current = editor.value.getHTML();
  if (incoming === current) return;

  editor.value.chain().setMeta("addToHistory", false).setContent(incoming, false).run();
};

onMounted(async () => {
  const res = await useDocument.getDocumentById(workspace_id, team_id, document_id);
  title.value = res.title;
  editor.value
    .chain()
    .setMeta("addToHistory", false)
    .setContent(res.content, false)
    .run();
  editor.value.chain().focus().run();

  socket.on("document-updated-content", handleDocumentUpdated);
});

onBeforeUnmount(() => {
  clearTimeout(saveTimeout);
  socket.off("document-updated-content", handleDocumentUpdated);
  editor.value?.destroy();
});
</script>

<style scoped>
:deep(.tiptap) {
  --primary: #cde7ff;
  height: 100%;
  background-color: var(--bs-white);
  outline: none;
  padding: 40px;
  overflow: hidden scroll;

  &::selection {
    background-color: var(--primary);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-block: 5px 15px;
    font-weight: 600;
    color: hsl(from var(--primary) h s calc(l - 30));
    margin-block: 10px 20px;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1.25rem;
  }

  h5 {
    font-size: 1rem;
  }

  h6 {
    font-size: 0.95rem;
  }

  blockquote {
    border-left: 5px solid hsl(from var(--primary) h s calc(l - 20));
    background-color: var(--primary);
    padding-left: 1rem;
    padding-block: 1rem;
    margin-block: 1rem;
  }

  p {
    margin: 0;
    font-weight: normal;
  }

  img {
    width: 500px;
    object-fit: cover;
    border: 2px solid hsl(from var(--bs-gray) h s l / 0.2);
    border-radius: 8px;
    margin-block: 20px;
  }

  pre {
    width: fit-content;
    border: 2px solid var(--bs-border-color);
    padding: 4px;
    background-color: hsl(from var(--bs-dark) h s l / 0.1);
    border-radius: 6px;
    margin: 20px 0;
    overflow-x: auto;

    code {
      font-family: monospace;
      font-size: 14px;
      font-weight: 500;
      color: var(--bs-pink);
      line-height: 1.5;
      direction: ltr;
      text-align: left;
      white-space: pre;
      word-spacing: normal;
      word-break: normal;
    }
  }

  ul {
    li {
      font-size: 1rem;
    }
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
