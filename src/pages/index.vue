<template>
  <div class="flex flex-col space-y-0.5 flex-1 overflow-y-hidden relative">
    <h1 class="uppercase text-gray-300 text-center my-2">My Hotspots</h1>

    <div class="absolute right-1 top-2 items-center flex">
      <Tooltip inline dir="left" class="mr-1.5">
        <img
          @click="refreshHotspots"
          src="../assets/refresh.svg"
          alt="Refresh"
          class="h-6 opacity-40 hover:opacity-70 cursor-pointer mx-auto"
        /><template #tooltip>Refresh</template>
      </Tooltip>
    </div>

    <perfect-scrollbar class="list flex-1 px-2 pb-3">
      <div v-if="addresses.length" class="flex-1 pb-1">
        <HotspotCard
          v-for="(item, index) in addresses"
          :ref="setCardRef"
          :key="index"
          :item="item"
        />
      </div>
      <div v-else class="flex flex-col">
        <p class="text-center mt-10 mb-12">No hotspots yet</p>
        <router-link
          to="/settings"
          class="
            bg-gray-800
            hover:bg-indigo-900
            px-2.5
            py-1.5
            rounded-lg
            text-sm
            mx-auto
            text-gray-300
          "
        >
          Add a hotspot
        </router-link>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import HotspotCard from "../components/HotspotCard.vue"
import Tooltip from "../components/Tooltip.vue"
import store from "../store.js"

export default {
  components: { HotspotCard, Tooltip },
  data() {
    return {
      loaded: false,
      cardRefs: [],
    }
  },
  computed: {
    addresses() {
      return store.addresses
    },
    showMaker() {
      return store.display.maker
    },
  },
  methods: {
    refreshHotspots() {
      this.cardRefs.forEach((c) => c.reload())
    },
    setCardRef(el) {
      if (el) {
        this.cardRefs.push(el)
      }
    },
  },
  beforeUpdate() {
    this.itemRefs = []
  },
  created() {},
}
</script>
