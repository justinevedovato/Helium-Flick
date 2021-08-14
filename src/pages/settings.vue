<template>
  <div class="flex flex-col flex-1 overflow-y-hidden">
    <div class="flex flex-col mt-3">
      <label
        for="address"
        class="uppercase text-sm text-gray-300 text-center py-2 bottom"
      >
        Add hotspot address
      </label>
      <div class="mx-6 flex group">
        <input
          @keypress.enter="addFromAddress"
          type="text"
          v-model="address"
          name="address"
          id="address"
          placeholder="ex: 112ABtapyGs6amTaZUauXe6..."
          class="placeholder-gray-700 text-gray-300 px-2"
        />
        <button @click="addFromAddress">Add</button>
      </div>

      <label
        for="user"
        class="uppercase text-sm text-gray-300 text-center py-2 bottom mt-3"
      >
        Add from user id
      </label>
      <div class="mx-6 flex group">
        <input
          @keypress.enter="addFromUser"
          type="text"
          v-model="user"
          name="user"
          id="user"
          placeholder="ex: 13swJYKbCSZt1aCBfMxL5Y..."
          class="placeholder-gray-700 text-gray-300 px-2"
        />
        <button @click="addFromUser">Add</button>
      </div>

      <p class="text-center h-7 mt-2">
        <LoadingDots v-if="loaded" />
        <span v-else class="text-center h-7 mt-2"> {{ message }}</span>
      </p>

      <div
        @click="clearAll"
        class="
          bg-gray-800
          text-gray-300
          cursor-pointer
          mx-auto
          text-sm text-center
          py-1.5
          px-2.5
          mt-3
          mb-5
          rounded-md
          hover:bg-red-900
        "
      >
        Clear all
      </div>
    </div>

    <perfect-scrollbar class="list flex-1 px-2 pb-3">
      <div class="flex-1">
        <div
          v-for="item in addresses"
          :key="item"
          class="flex w-full px-10 py-1.5 items-center"
        >
          <p class="text-gray-300 flex-1">
            {{ newName(item) }}
          </p>
          <span
            @click="deleteAddress(item)"
            class="
              text-right
              bg-gray-800
              cursor-pointer
              hover:bg-indigo-900 hover:text-gray-200
              rounded-full
              leading-5
              text-sm
              px-1.5
              py-0.5
            "
          >
            ✖
          </span>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import store from "~/store.js"
import LoadingDots from "~/components/LoadingDots.vue"
import animalHash from "angry-purple-tiger"

export default {
  components: { LoadingDots },
  data() {
    return {
      address: "",
      user: "",
      message: "",
      loaded: false,
    }
  },
  computed: {
    addresses() {
      return store.addresses
    },
  },
  methods: {
    newName(address) {
      return animalHash(address)
    },
    async addFromAddress() {
      this.loaded = true
      const res = await fetch(
        "https://api.helium.io/v1/hotspots/" + this.address
      )
      // Check if the hotspot exists
      if (res.status == "404") {
        this.loaded = false
        this.message = "Sorry! This address doesn't exist"
        this.address = ""
      } else {
        store.addresses.push(this.address)
        localStorage.setItem("addresses", JSON.stringify(store.addresses))
        this.address = ""

        this.loaded = false
        this.message = "Your hotspot has been added!"
      }
    },

    async addFromUser() {
      this.loaded = true
      const res = await fetch(
        "https://api.helium.io/v1/accounts/" + this.user + "/hotspots"
      )
      let { data } = await res.json()

      // No 404 response from ApplicationCache, check data array instead:
      if (!data.length) {
        this.loaded = false
        this.message = "Sorry! This user doesn't exist"
        this.user = ""
      } else {
        let userAddresses = data.map((e) => e.address)
        store.addresses.push(...userAddresses)
        localStorage.setItem("addresses", JSON.stringify(store.addresses))
        this.loaded = false
        this.message = "All hotspots have been added!"
        this.user = ""
      }
    },

    deleteAddress(item) {
      for (let i = 0; i < store.addresses.length; i++) {
        if (store.addresses[i] == item) {
          store.addresses.splice(i, 1)
          i--
        }
        localStorage.setItem("addresses", JSON.stringify(store.addresses))
      }
    },

    clearAll() {
      store.addresses = []
      localStorage.clear()
    },
  },
}
</script>

<style lang="postcss" scoped>
input {
  @apply w-full h-8 rounded-l-md bg-gray-800 border border-gray-700 focus:border-indigo-700 focus:outline-none;
}

button {
  @apply bg-gray-700 text-gray-300 px-2.5 text-sm rounded-r-md hover:bg-indigo-700;
}
</style>
