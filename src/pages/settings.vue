<template>
  <div class="flex flex-col flex-1 overflow-y-hidden">
    <div class="flex flex-col">
      <h2 class="uppercase text-gray-300 text-center my-2">
        Manage my Hotspots
      </h2>
      <div class="w-10/12 mx-auto text-sm text-gray-300 my-4 flex">
        <div
          @click="toggle"
          class="flex items-center cursor-pointer"
          :class="{ active: showMaker }"
        >
          <!-- toggle -->
          <div class="relative">
            <!-- line -->
            <div
              class="block w-6 h-4 rounded-full"
              :class="[showMaker ? 'bg-green-600' : 'bg-gray-600']"
            ></div>
            <!-- dot -->
            <div
              class="
                dot
                absolute
                top-0.5
                bg-white
                w-3
                h-3
                rounded-full
                transition
              "
              :class="[showMaker ? 'right-0.5' : 'left-0.5']"
            ></div>
          </div>
          <span class="ml-1.5">Show hotspot brand</span>
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
          mb-1
        "
        style="height: 1px"
      ></div>
      <div class="add-hotspots mx-auto w-5/6 flex flex-col">
        <label for="address" class="text-sm text-gray-300 py-2">
          Add hotspot address:
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

        <p class="text-center text-sm mt-3 -mb-2">- OR -</p>

        <label for="user" class="text-sm text-gray-300 pb-2">
          Add account ID:
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
      </div>
      <p class="text-center h-4 mt-1">
        <LoadingDots v-if="loaded" />
        <span v-else class="text-center text-sm"> {{ message }}</span>
      </p>

      <div
        @click="clearAll"
        class="
          bg-black bg-opacity-30
          text-gray-300
          cursor-pointer
          mx-auto
          text-sm text-center
          py-1.5
          px-2.5
          mt-3
          mb-4
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
        mb-1
      "
      style="height: 1px"
    ></div>
    <perfect-scrollbar class="list flex-1 px-6 pb-3 w-11/12 mx-auto">
      <draggable v-model="addresses" item-key="id" @change="saveNewList">
        <template #item="{ element }">
          <div class="flex-1 select-none cursor-move">
            <div
              class="
                flex
                w-full
                mx-auto
                py-1
                px-3
                items-center
                text-sm
                hover:bg-black hover:bg-opacity-20
                rounded-md
              "
            >
              <p class="text-gray-300 flex-1">
                {{ newName(element) }}
              </p>
              <span
                @click="deleteAddress(element)"
                class="
                  text-right
                  bg-gray-800
                  cursor-pointer
                  hover:bg-indigo-900 hover:text-gray-200
                  rounded-full
                  text-sm
                "
              >
                <img src="../assets/close.svg" alt="" class="h-5 w-5 p-1.5" />
              </span>
            </div>
          </div>
        </template>
      </draggable>
    </perfect-scrollbar>
    <Footer></Footer>
  </div>
</template>

<script>
import store from "~/store.js"
import LoadingDots from "~/components/LoadingDots.vue"
import Tooltip from "../components/Tooltip.vue"
import Footer from "../components/Footer.vue"
import animalHash from "angry-purple-tiger"
import draggable from "vuedraggable"

export default {
  components: { LoadingDots, Tooltip, Footer, draggable },
  data() {
    return {
      address: "",
      addresses: store.addresses,
      user: "",
      message: "",
      loaded: false,
      drag: false,
      showMaker: store.display.maker,
    }
  },

  methods: {
    toggle() {
      this.showMaker = !this.showMaker
      store.display.maker = this.showMaker
      localStorage.setItem("display", JSON.stringify(store.display))
    },
    saveNewList() {
      store.addresses = this.addresses
      localStorage.setItem("addresses", JSON.stringify(store.addresses))
    },
    newName(address) {
      return animalHash(address)
    },
    async addFromAddress() {
      this.loaded = true
      const res = await fetch(
        "https://api.helium.io/v1/hotspots/" + this.address
      )
      // Check if the hotspot exists
      if (res.status == "404" || !this.address) {
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
      localStorage.removeItem("addresses")
      store.addresses = []
      this.addresses = []
    },
  },
  created() {
    // Show brand
    store.display = JSON.parse(localStorage.getItem("display"))
    console.log(store.display)

    if (store.display == undefined) {
      this.showMaker = true
      store.display = { maker: true } // Set to 'true' by default if doesn't exist
      localStorage.setItem("display", JSON.stringify(store.display))
    } else {
      this.showMaker = store.display.maker
    }
  },
}
</script>

<style lang="postcss" scoped>
.add-hotspots {
  input {
    @apply w-full h-8 rounded-l-md bg-gray-800 border border-gray-700 focus:border-indigo-700 focus:outline-none;
  }
}

button {
  @apply bg-gray-700 text-gray-300 px-2.5 text-sm rounded-r-md hover:bg-indigo-700;
}
</style>
