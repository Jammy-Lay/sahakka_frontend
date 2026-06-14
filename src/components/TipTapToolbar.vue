<template>

  <div class="editor-format border-bottom" style="background-color: #eeeeee;">

    <div class="d-flex align-items-center">
      <n-select class="n-select" v-model:value="value" :bordered="false" :options="options"
        @update:value="setHeading(value)" />
      <div v-for="(tool, index) in icons" :key="index">
        <ToolbarButton :class="{ 'active': editor.isActive(tool.class.toLowerCase()) }" :action="tool.fn"
          class="btn toolbar-btn rounded-0" :icon="tool.icon" :type="tool.class" />
      </div>
    </div>
  </div>

</template>

<script setup>
  import { Bold, Indent, Italic, Quote, Strikethrough, Underline } from 'lucide-vue-next';
  import ToolbarButton from './ToolbarButton.vue';
  import { ref } from 'vue';

  const props = defineProps({
    editor: {
      type: Object
    }
  })

  const icons = [
    { icon: Italic, fn: () => props.editor.chain().focus().toggleItalic().run(), class: 'Italic' },
    { icon: Bold, fn: () => props.editor.chain().focus().toggleBold().run(), class: 'Bold' },
    { icon: Quote, fn: () => props.editor.chain().focus().setBlockquote().run(), class: 'Quote' },
    { icon: Strikethrough, fn: () => props.editor.chain().focus().toggleStrike().run(), class: 'Strike' },
    { icon: Underline, fn: () => props.editor.chain().focus().toggleUnderline().run(), class: 'Underline' },
    { icon: Indent, fn: () => props.editor.chain().focus().insertContent('     ').run(), class: 'Increase indent' },
  ]

  const value = ref(0);
  const options = [
    { label: 'Paragraph', value: 0 },
    { label: 'Heading 1', value: 1 },
    { label: 'Heading 2', value: 2 },
    { label: 'Heading 3', value: 3 },
  ];


  function setHeading(n) {
    console.log(n);
    const chain = props.editor.chain().focus();
    n === 0 ? chain.setParagraph().run() : chain.toggleHeading({ level: n }).run();
  }


</script>

<style scoped>
  .toolbar-btn {
    --active: #e0f0ff;
    --no-active: #eeeeee;
    background-color: var(--no-active);
    border: none;

    &:hover {
      background-color: var(--active);
    }
  }

  .active {
    --active: #cde7ff;
    background-color: var(--active);
    outline: none;
    border: none;
  }

  :deep(.n-base-select) {
    background-color: transparent !important;
  }
</style>