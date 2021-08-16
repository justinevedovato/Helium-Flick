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

      <p class="text-center h-5 mt-2">
        <LoadingDots v-if="loaded" />
        <span v-else class="text-center h-7 mt-2 text-sm"> {{ message }}</span>
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

    <!-- Divider: -->
    <div
      class="
        w-full
        bg-gradient-to-r
        from-gray-900
        via-gray-700
        to-gray-900
        mx-auto
      "
      style="height: 1px"
    ></div>
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
            "
          >
            <img src="../assets/close.svg" alt="" class="h-6 w-6 p-1.5" />
          </span>
        </div>
      </div>
    </perfect-scrollbar>
    <!-- Divider: -->
    <div
      class="
        w-full
        bg-gradient-to-r
        from-gray-900
        via-gray-700
        to-gray-900
        mx-auto
      "
      style="height: 1px"
    ></div>
    <div class="h-10 mb-0.5 flex items-center w-full relative">
      <span class="text-xs text-center mx-auto"
        >HeliumFlick v{{ version }}
      </span>

      <div
        class="absolute right-2 w-7 opacity-50 hover:opacity-100 cursor-pointer"
      >
        <Tooltip inline dir="left">
          <img src="../assets/heart.svg" alt="" class="heart" />
          <img src="../assets/hand.svg" alt="" class="w-6 bottom-1.5 right-3" />
          <template #tooltip> Donate </template>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import store from "~/store.js"
import { version } from "../../package.json"
import LoadingDots from "~/components/LoadingDots.vue"
import Tooltip from "../components/Tooltip.vue"
import animalHash from "angry-purple-tiger"

export default {
  components: { LoadingDots, Tooltip },
  data() {
    return {
      address: "",
      user: "",
      message: "",
      loaded: false,
      version: "",
    }
  },
  computed: {
    addresses() {
      return store.addresses
    },
    version() {
      return version
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

.heart {
  @apply -mb-2.5 ml-1.5;
  width: 13px;
  -webkit-animation: heartbeat 1.2s ease infinite;
  animation: heartbeat 1.2s ease infinite;
}

@-webkit-keyframes heartbeat {
  0% {
    -webkit-transform: scale(0.8);
  }
  10% {
    -webkit-transform: scale(1);
  }
  30% {
    -webkit-transform: scale(0.8);
  }
  40% {
    -webkit-transform: scale(0.95);
  }
  to {
    -webkit-transform: scale(0.8);
  }
}
@keyframes heartbeat {
  0% {
    transform: scale(0.8);
  }
  10% {
    transform: scale(1);
  }
  30% {
    transform: scale(0.8);
  }
  40% {
    transform: scale(0.95);
  }
  to {
    transform: scale(0.8);
  }
}
</style>
