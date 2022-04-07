<script lang="ts" setup>

interface Props {
  value?: string
}

const props = defineProps<Props>()
const model = useVModel(props, 'value')
</script>

<template>
  <input
    v-model="model"
    v-bind="$attrs"
    type="text"
    autocomplete="false"
    p="x-4 y-2"
    w="500px"
    text="center"
    bg="transparent"
    border="~ rounded gray-200 dark:gray-700"
    outline="none active:none"
  >
</template>
