<script setup lang="ts">
const servers = $ref([])

function login() {
  console.log('[LOG] ~ file: index.vue ~ line 3 ~ servers', servers)
}

const canSubmit = $computed(() => servers.some(item => item))

</script>

<template>
  <div>
    <div i-carbon:center-circle text-4xl inline-block />
    <p>
      <a rel="noreferrer" href="https://web-minterscan.vercel.app" target="_blank">MinterScan</a>
    </p>
    <p>
      <em text-sm op75>MinterScan SelfBot</em>
    </p>
    {{ name }}

    <div py-4 flex="~ col" items="center" justify="center" gap="10px">
      <InputField v-model:value="servers[0]" placeholder="Server 1 ID" />
      <InputField v-model:value="servers[1]" placeholder="Server 2 ID" />
      <InputField v-model:value="servers[2]" placeholder="Server 3 ID" />
    </div>

    <div>
      <button class="m-3 text-sm btn" :disabled="!canSubmit" @click="login">
        Login
      </button>
    </div>
  </div>
</template>
