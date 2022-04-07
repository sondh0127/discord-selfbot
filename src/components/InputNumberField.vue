<script lang="ts" setup>

interface Props {
  value?: number
}

const props = defineProps<Props>()
const model = useVModel(props, 'value')

function imposeMinMax(e) {
  const input = e.target
  if (input.value !== '') {
    if (parseInt(input.value) < parseInt(input.min))
      model.value = input.min

    if (parseInt(input.value) > parseInt(input.max))
      model.value = input.max
  }
}
</script>

<template>
  <input
    v-model="model"
    v-bind="$attrs"
    type="number"
    autocomplete="false"
    p="x-4 y-2"
    w="80px"
    text="center"
    bg="transparent"
    border="~ rounded gray-200 dark:gray-700"
    outline="none active:none"
    @keyup="imposeMinMax"
  >
</template>
