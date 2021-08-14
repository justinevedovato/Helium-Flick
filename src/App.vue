<template>
  <div
    class="navbar relative w-full space-x-1 flex text-xs uppercase ml-1 my-0.5"
  >
    <router-link to="/" class="hover:text-gray-300 px-2 py-1">Home</router-link>

    <router-link to="/settings" class="hover:text-gray-300 px-2 py-1"
      >Settings</router-link
    >
    <div class="drag-area flex-1 cursor-pointer"></div>
  </div>

  <router-view></router-view>
</template>

<script>
import store from "./store.js"

export default {
  created() {
    const allHotspots = JSON.parse(localStorage.getItem("addresses"))
    store.addresses = allHotspots || []
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
  content: "";
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
