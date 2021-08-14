<template>
  <div class="flex flex-col space-y-0.5 flex-1 overflow-y-hidden relative">
    <h1 class="uppercase text-gray-300 text-center py-2">My Hotspots</h1>
    <img
      @click="refreshHotspots"
      src="../assets/refresh.svg"
      alt="Refresh"
      class="
        ml-2
        h-5
        opacity-40
        hover:opacity-70
        cursor-pointer
        absolute
        right-5
        top-2.5
      "
    />

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
import store from "../store.js"

export default {
  components: { HotspotCard },
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
}
</script>
