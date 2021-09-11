<template>
  <!-- Divider: -->
  <div
    class="w-52 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 mx-auto"
    style="height: 1px"
  ></div>

  <div>
    <router-link :to="link" class="flex">
      <div
        class="
          card
          flex
          w-full
          hover:bg-gray-800
          mx-2
          rounded-md
          overflow-hidden
          items-center
        "
        style="height: 68px"
      >
        <div class="h-full relative group">
          <div
            v-if="showMaker"
            class="w-2 h-full opacity-60 brand-color"
            :class="brand.color"
          ></div>
          <span class="brand-name whitespace-nowrap">{{ brand.name }}</span>
        </div>

        <div class="flex flex-1 flex-col px-3">
          <div class="flex items-baseline">
            <p class="text-white inline">{{ name }}</p>
            <Tooltip inline class="ml-2">
              <span
                v-if="loaded"
                :class="{
                  'text-green-600': status == 'online',
                  'text-yellow-500 animate-pulse': status == 'syncing',
                  'text-red-700': status == 'offline',
                }"
                >●</span
              >
              <template #tooltip>
                <span class="capitalize">{{ status }}</span>
              </template>
            </Tooltip>
            <Tooltip inline v-if="relayed" class="ml-1.5">
              <span class="text-yellow-700">●</span>
              <template #tooltip>Relayed</template>
            </Tooltip>
          </div>

          <div class="flex w-full items-center mt-0.5">
            <LoadingDots v-if="!location" />
            <span class="text-sm inline flex-1">
              {{ location }}
            </span>
            <!-- <span
              v-if="blocksLeft"
              class="text-xs bg-gray-800 px-1.5 pb-0.5 rounded-md"
              >{{ blocksLeft }}</span
            > -->
          </div>
        </div>
        <!-- Spinner -->
        <div v-if="!loaded" class="flex items-center justify-center h-16">
          <div
            class="
              loader
              ease-linear
              rounded-full
              border-4 border-t-4 border-gray-800
              mr-3
              h-12
              w-12
            "
          ></div>
        </div>
        <div
          v-else
          class="
            flex flex-col
            justify-center
            items-end
            pr-2
            text-sm
            space-y-0.5
          "
        >
          <span
            class="
              bg-purple-900 bg-opacity-50
              text-gray-100
              py-0.5
              px-2
              rounded-full
            "
          >
            <span class="text-gray-400 text-xs pr-1">Day</span>{{ rewardsDay }}
          </span>
          <span
            class="
              bg-indigo-900 bg-opacity-50
              text-gray-100
              py-0.5
              px-2
              rounded-full
            "
          >
            <span class="text-gray-400 text-xs pr-0.5">Total</span>
            {{ rewardsTotal }}
          </span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import animalHash from "angry-purple-tiger"
import store from "~/store"
import Tooltip from "./Tooltip.vue"
import LoadingDots from "~/components/LoadingDots.vue"
import { getBrand } from "~/utils"

export default {
  components: { Tooltip, LoadingDots },
  props: ["item"],
  data() {
    return {
      status: "",
      blocksLeft: "",
      relayed: false,
      location: "",
      rewardsTotal: "",
      rewardsDay: "",
      timestampAdded: "",
      loaded: false,
      timer: "",
      brand: "",
    }
  },

  computed: {
    link() {
      return "/hotspot/" + this.item
    },
    name() {
      let n = animalHash(this.item)
      if (n.length > 29) {
        return n.slice(0, 28) + "..."
      } else return n
    },
    showMaker() {
      return store.display.maker
    },
  },

  methods: {
    async getHotspotInfos(address) {
      const res = await fetch("https://api.helium.io/v1/hotspots/" + address)
      let { data } = await res.json()
      this.timestampAdded = data.timestamp_added.split(".")[0] + "Z"
      this.status = data.status.online
      // Brand:
      this.brand = getBrand(data.payer)

      // if (id === data.owner) {
      //   return "Data Only"
      // }

      // Status:
      if (
        data.status.listen_addrs &&
        data.status.listen_addrs[0] &&
        data.status.listen_addrs[0].includes("p2p")
      ) {
        this.relayed = true
      }
      if (
        data.block - data.status.height > 500 &&
        data.status.online != "offline"
      ) {
        this.status = "syncing"
        this.blocksLeft = data.block - data.status.height + " left"
      }

      // Location:
      if (data.geocode.long_city) {
        this.location =
          data.geocode.long_city + ", " + data.geocode.short_country
        if (this.location.length > 22 && this.blocksLeft) {
          this.location = this.location.slice(0, 21) + "..."
        } else if (this.location.length > 30) {
          this.location = this.location.slice(0, 29) + "..."
        }
      } else {
        this.location = "No location set"
      }
    },

    async getRewards(address) {
      const res = await fetch(
        "https://api.helium.io/v1/hotspots/" +
          address +
          "/rewards/sum?min_time=" +
          this.timestampAdded
      )
      let body = await res.json()
      this.rewardsTotal = body.data.total.toFixed("2")
    },

    async getDailyRewards(address) {
      let nowTime = new Date()
      nowTime.setHours(23)
      nowTime.setMinutes(59)
      nowTime.setSeconds(59)
      let UTCTime = new Date(
        Date.UTC(
          nowTime.getUTCFullYear(),
          nowTime.getUTCMonth(),
          nowTime.getUTCDate(),
          nowTime.getUTCHours(),
          nowTime.getUTCMinutes(),
          nowTime.getUTCSeconds()
        )
      )
      let params = new URLSearchParams({
        bucket: "day",
        min_time: "-30 day",
        max_time: UTCTime.toISOString(),
      })
      const res = await fetch(
        "https://api.helium.io/v1/hotspots/" +
          address +
          "/rewards/sum?" +
          params.toString()
      )
      let { data } = await res.json()

      this.rewardsDay = data[0].total.toFixed("2")
    },
    async reload() {
      this.loaded = false
      await this.updateData()
      this.loaded = true
    },
    async updateData() {
      await this.getHotspotInfos(this.item)
      await this.getRewards(this.item)
      await this.getDailyRewards(this.item)
    },
    // async test() {
    //   const res = await fetch(
    //     "https://api.helium.io/v1/hotspots"
    //   )
    //   let { data, cursor } = await res.json()
    //   const knownMakers = [
    //     "13daGGWvDQyTyHFDCPz8zDSVTWgPNNfJ4oh31Teec4TRWfjMx53",
    //     "13ENbEQPAvytjLnqavnbSAzurhGoCSNkGECMx7eHHDAfEaDirdY",
    //     "14rb2UcfS9U89QmKswpZpjRCUVCVu1haSyqyGY486EvsYtvdJmR",
    //     "13Zni1he7KY9pUmkXMhEhTwfUpL9AcEV1m2UbbvFsrU9QPTMgE3",
    //     "14sKWeeYWQWrBSnLGq79uRQqZyw3Ldi7oBdxbF6a54QboTNBXDL",
    //     "14NBXJE5kAAZTMigY4dcjXSMG4CSqjYwvteQWwQsYhsu2TKN6AF",
    //     "12zX4jgDGMbJgRwmCfRNGXBuphkQRqkUTcLzYHTQvd4Qgu8kiL4",
    //     "13cbbZXzqwp6YMM5JvAu5T1TRhenENEJVU5Q8vpLhunQYE1Acpp",
    //     "14h2zf1gEr9NmvDb2U53qucLN2jLrKU1ECBoxGnSnQ6tiT6V2kM",
    //     "14iC6N1HkqUjH7WEChHVQhPqJ1hbWBKpZXZVeHHykCA7tNDYF2C",
    //     "13MS2kZHU4h6wp3tExgoHdDFjBsb9HB9JBvcbK9XmfNyJ7jqzVv",
    //     "134C7Hn3vhfBLQZex4PVwtxQ2uPJH97h9YD2bhzy1W2XhMJyY6d",
    //     "14eUfY1GsjK4WH6uZYoeagnFtigBKdvPruAXLmc5UsUMEDj3yib",
    //     "13Mpg5hCNjSxHJvWjaanwJPBuTXu1d4g5pGvGBkqQe3F8mAwXhK",
    //     "13y2EqUUzyQhQGtDSoXktz8m5jHNSiwAKLTYnHNxZq2uH5GGGym",
    //     "13XuP2DjHEHVkKguDDZD2ev5AeqMLuJ8UQ44efEcDmVTnBcvc6F",
    //     "13LVwCqZEKLTVnf3sjGPY1NMkTE7fWtUVjmDfeuscMFgeK3f9pn",
    //   ]
    //   let maker
    //   data.map((e) => {
    //     if (!knownMakers.includes(e.payer)) {
    //       if (
    //         e.payer == "14fzfjFcHpDR1rTH8BNPvSi5dKBbgxaDnmsVPbCjuq9ENjpZbxh"
    //       ) {
    //         maker = "Helium Old"
    //       } else if (e.payer == e.owner) {
    //         maker = "Data-Only"
    //       } else {
    //         maker = "Unknown"
    //       }
    //       console.log(maker + ": " + e.address)
    //     }
    //   })
    //   console.log(cursor)
    // },
  },
  async created() {
    this.timer = setInterval(this.updateData, 600000)
    await this.updateData()

    // Show when the rest is loaded
    this.loaded = true
    // this.test()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>

<style scoped>
.card:hover {
  .brand-color {
    @apply opacity-100;
  }
}
.brand-name {
  @apply absolute uppercase text-white font-extralight hidden group-hover:block left-3 top-0 bottom-0;
  font-size: 10px;
  letter-spacing: 1.5px;
}
</style>
