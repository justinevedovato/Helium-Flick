<template>
  <div
    class="
      navbar
      relative
      w-full
      space-x-1
      flex
      text-xs
      uppercase
      ml-1
      my-0.5
      pointer-events-auto
    "
  >
    <router-link to="/" class="hover:text-gray-300 px-2 py-1 flex"
      >Home
    </router-link>

    <router-link to="/settings" class="hover:text-gray-300 px-2 py-1 flex"
      >Settings
    </router-link>
    <router-link
      to="/help"
      class="hover:text-gray-300 px-2 py-1 flex"
      :class="{
        'text-red-600 font-bold hover:text-red-400': updateReady,
      }"
      >?
    </router-link>
    <div class="drag-area w-full cursor-move"></div>

    <div class="w-12 flex align-items-center pr-1">
      <img
        @click="minimize"
        src="./assets/close.svg"
        class="
          h-5
          opacity-75
          mt-0.5
          p-1
          cursor-pointer
          hover:opacity-100 hover:bg-gray-600
          rounded-full
        "
      />
    </div>
  </div>

  <router-view></router-view>
</template>

<script>
import store from './store.js'
import { version } from '../package.json'
import axios from 'axios'

export default {
  data() {
    return {
      newVersion: '',
      updateReady: false,
      timer: '',
    }
  },
  methods: {
    async minimize() {
      hideWindow() // function in the preload file
    },
    async getNewRelease() {
      try {
        const res = await axios.get(
          'https://api.github.com/repos/justinevedovato/Helium-Flick/releases/latest'
        )
        store.versions = { new: res.data.tag_name, current: 'v' + version }

        if (store.versions.current !== store.versions.new) {
          this.updateReady = true
        }
      } catch (err) {
        if (err.code === 'ENOTFOUND') {
          throw new Error('Network error.')
        } else if (err.response && err.response.status === 404) {
          throw new Error('Could not find a release.')
        }
        throw new Error(err)
      }
    },
  },
  created() {
    const allHotspots = JSON.parse(localStorage.getItem('addresses'))
    store.addresses = allHotspots || []

    // Show brand
    const display = JSON.parse(localStorage.getItem('display'))
    if (display) {
      // Get default from the store, but keep user's changed values:
      store.display = Object.assign({}, store.display, display)
    }

    this.timer = setInterval(this.getNewRelease, 3600000) // Every hour
    this.getNewRelease()
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
}
</script>

<style lang="postcss">
.drag-area {
  -webkit-app-region: drag;
  cursor: pointer;
}
.navbar::after {
  @apply w-full absolute -bottom-1 bg-gradient-to-r from-gray-700 to-gray-900;
  content: '';
  height: 1px;
}

.page-enter-active,
.page-leave-active {
  transition-property: opacity;
  transition-timing-function: ease-in-out;
  transition-duration: 300ms;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
</style>
