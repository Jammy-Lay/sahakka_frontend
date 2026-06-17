<template>


  <div class="d-flex align-items-center border-bottom bg-white">
    <div>
      <button class="btn toolbar-btn rounded-0 lh-1 d-flex align-items-center gap-2 fw-semibold" @click="$router.back()">
        <ArrowLeft size="20" stroke-width="2"/> Back
      </button>
    </div>
    <div class="h-100 border-2 border-start px-2"></div>
    <div>
      <h5 :contenteditable="edit" @dblclick="edit = true" @blur="edit = false" class="fw-bold text-nowrap lh-1 m-0">{{ title.length > 20 && !edit ? title.substring(0, 20) + '...' : title  }}</h5>
    </div>
    <div class="d-flex ms-auto">
      <div v-for="(tool, index) in heading" :key="index">
        <ToolbarButton
          :class="{ 'active': editor.isActive(tool.class.toLowerCase().replace(/ \d+/, ''), { level: tool.level }) }"
          :action="tool.fn" class="btn toolbar-btn rounded-0" :icon="tool.icon" :type="tool.class" :title="tool.class"/>
      </div>
      <div v-for="(tool, index) in icons" :key="index">
        <ToolbarButton :class="{ 'active': editor.isActive(tool.class.toLowerCase()) }" :action="tool.fn"
          class="btn toolbar-btn rounded-0" :icon="tool.icon" :type="tool.class" :title="tool.class"/>
      </div>
      <div v-for="(tool, index) in lists" :key="index">
        <ToolbarButton :class="{ 'active': editor.isActive(tool.class) }" :action="tool.fn"
          class="btn toolbar-btn rounded-0" :icon="tool.icon" :type="tool.class" :title="tool.class.charAt(0).toLocaleUpperCase() + tool.class.slice(1)"/>
      </div>
      <div v-for="(tool, index) in undoRedo" :key="index">
        <ToolbarButton :class="{ 'active': editor.isActive(tool.class.toLowerCase()) }" :action="tool.fn"
          class="btn toolbar-btn rounded-0" :icon="tool.icon" :type="tool.class" :title="tool.class"/>
      </div>
    </div>
  </div>

</template>

<script setup>
  import { ArrowLeft, Bold, Code2, Heading1, Heading2, Heading3, Indent, Italic, List, ListOrdered, Pilcrow, Quote, Redo2, Strikethrough, Underline, Undo2 } from 'lucide-vue-next';
  import ToolbarButton from './ToolbarButton.vue';
  import { ref } from 'vue';

  const props = defineProps({
    editor: {
      type: Object
    },
    title: String
  })

  const edit = ref(false);

  const heading = [
    { icon: Pilcrow, fn: () => props.editor.chain().focus().toggleHeading({ level: 1 }).run(), class: 'Paragraph' },
    { icon: Heading1, fn: () => props.editor.chain().focus().toggleHeading({ level: 1 }).run(), class: 'Heading 1', level: 1 },
    { icon: Heading2, fn: () => props.editor.chain().focus().toggleHeading({ level: 2 }).run(), class: 'Heading 2', level: 2 },
    { icon: Heading3, fn: () => props.editor.chain().focus().toggleHeading({ level: 3 }).run(), class: 'Heading 3', level: 3 },
  ];

  const icons = [
    { icon: Italic, fn: () => props.editor.chain().focus().toggleItalic().run(), class: 'Italic' },
    { icon: Bold, fn: () => props.editor.chain().focus().toggleBold().run(), class: 'Bold' },
    { icon: Quote, fn: () => props.editor.chain().focus().setBlockquote().run(), class: 'Quote' },
    { icon: Code2, fn: () => props.editor.chain().focus().setCodeBlock().run(), class: 'Code' },
    { icon: Strikethrough, fn: () => props.editor.chain().focus().toggleStrike().run(), class: 'Strike' },
    { icon: Underline, fn: () => props.editor.chain().focus().toggleUnderline().run(), class: 'Underline' },
    { icon: Indent, fn: () => props.editor.chain().focus().insertContent('\t').run(), class: 'Increase indent' },
  ];

  const lists = [
    { icon: List, fn: () => props.editor.chain().focus().toggleBulletList().run(), class: 'bulletList' },
    { icon: ListOrdered, fn: () => props.editor.chain().focus().toggleOrderedList().run(), class: 'orderedList' },
  ]

  const undoRedo = [
    { icon: Undo2, fn: () => props.editor.chain().focus().undo().run(), class: 'Undo' },
    { icon: Redo2, fn: () => props.editor.chain().focus().redo().run(), class: 'Redo' },
  ]


</script>

<style scoped>
  .toolbar-btn {
    --active: #e0f0ff;
    --transparent: transparent;
    background-color: var(--transparent);
    border: none;

    &:hover {
      background-color: var(--active);
      color: hsl(from var(--active) h s calc(l - 40));
    }
  }

  .active {
    --active: #cde7ff;
    background-color: var(--active);
    color: hsl(from var(--active) h s calc(l - 40));
    outline: none;
    border: none;
  }

  :deep(.n-base-select) {
    background-color: transparent !important;
  }
</style>