<script setup lang="ts">
import { lyla } from 'lyla'
const channelRegex = /https:\/\/discord.com\/channels\/*.*\/(.*)/

const token = $(useStorage('token', 'MzUwNTc3NjgyMDM3MDgwMDY1.YkxXvA._vSKbZ7JDOU53IiHXX7hOgxgi0c'))
const mainChannel = $(useStorage('mainChannel', 'https://discord.com/channels/960915142042845284/960915142588137614')) // Test1
const channels = $(
  useStorage('channels', [
    'https://discord.com/channels/960927218291310645/960927218769473618', // Test2
    'https://discord.com/channels/961627753378091079/961627753982083124', // Test3
  ]),
)
// 1 hours
const cacheTimes = $(useStorage('cacheTimes', [0, 0, 0, 10]))

let isLoading = $ref(false)
let user = $ref<any>(null)

onMounted(async() => {
  await getUser()
})

async function getUser() {
  isLoading = true
  const { json } = await lyla.get('/user')
  user = json
  isLoading = false
}

async function login() {
  isLoading = true
  const _channels = channels.map(channel => channelRegex.exec(channel)?.[1])
  const _mainChannel = channelRegex.exec(mainChannel)?.[1]
  const _cacheTimes = cacheTimes.map(time => time || 0)
  const cacheTime = _cacheTimes[0] * 24 * 60 * 60 * 1000 + _cacheTimes[1] * 60 * 60 * 1000 + _cacheTimes[2] * 60 * 1000 + _cacheTimes[3] * 1000
  const { json } = await lyla.post('/start', {
    json: {
      token,
      channels: _channels,
      mainChannel: _mainChannel,
      cacheTime,
    },
  })
  user = json
  isLoading = false
}

async function stop() {
  isLoading = true
  const { json } = await lyla.post('/stop', {
    json: {},
  })
  isLoading = false
  user = null
}

const canSubmit = $computed(() => channels.some(item => item))

</script>

<template>
  <div>
    <div i-carbon:center-circle text-4xl inline-block />
    <p>
      <a rel="noreferrer" href="https://web-minterscan.vercel.app" target="_blank">MinterScan</a>
    </p>

    <div class="flex my-10 gap-4 justify-center">
      <div class="flex flex-col">
        <div py-4 flex="~ col" items="center" justify="center" gap="10px">
          <em text-sm op75>Token</em>
          <InputField v-model:value="token" placeholder="Selfbot Token" />
        </div>

        <div py-4 flex="~ col" items="center" justify="center" gap="10px">
          <em text-sm op75>Destination Channels</em>
          <InputField v-model:value="mainChannel" placeholder="Channel Link" />
        </div>
        <div py-4 flex="~ col" items="center" justify="center" gap="10px">
          <em text-sm op75>Cache Time (of link from a channel)</em>
          <div class="flex items-center gap-1">
            <div class="flex flex-col items-center gap-2">
              <InputNumberField
                v-model:value="cacheTimes[0]"
                :min="0"
                :max="365"
                placeholder="days"
              />
              <em text-sm op75>days</em>
            </div>
            <div class="flex flex-col items-center gap-2">
              <InputNumberField
                v-model:value="cacheTimes[1]"
                :min="0"
                :max="24"
                placeholder="hours"
              />
              <em text-sm op75>hours</em>
            </div>
            <div class="flex flex-col items-center gap-2">
              <InputNumberField
                v-model:value="cacheTimes[2]"
                :min="0"
                :max="59"
                placeholder="minutes"
              />
              <em text-sm op75>minutes</em>
            </div>
            <div class="flex flex-col items-center gap-2">
              <InputNumberField
                v-model:value="cacheTimes[3]"
                :min="0"
                :max="59"
                placeholder="seconds"
              />
              <em text-sm op75>seconds</em>
            </div>
          </div>
        </div>
      </div>

      <div py-4 flex="~ col" items="center" gap="10px">
        <em text-sm op75>Source Channels</em>
        <InputField v-model:value="channels[0]" placeholder="Channel 1 Link" />
        <InputField v-model:value="channels[1]" placeholder="Channel 2 Link" />
        <InputField v-model:value="channels[2]" placeholder="Channel 3 Link" />
      </div>
    </div>
    <div>
      <div v-if="!user">
        <button class="m-3 text-sm btn" :disabled="!canSubmit" @click="login">
          <div class="flex items-center gap-2">
            <div
              v-if="isLoading"
              i-carbon:center-circle
              text-normal
              inline-block
              animate-spin
              animate-3s
              preserve-3d
            />
            <span v-else>Login</span>
          </div>
        </button>
      </div>
      <div v-else>
        <div class="m-3 text-sm">
          Running!
        </div>
        <div class="flex items-center gap-4 justify-center">
          <img class="rounded-full w-18 h-18" :src="user.avatarURL">
          <div class="text-sm font-medium">
            <p>{{ user.tag }}</p>
            <p>{{ user.emailAddress }}</p>
          </div>
        </div>
        <button class="m-3 text-sm btn" :disabled="isLoading" @click="stop">
          Stop
        </button>
      </div>
    </div>
  </div>
</template>
