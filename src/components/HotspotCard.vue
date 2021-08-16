<template>
  <!-- Divider: -->
  <div
    class="w-52 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 mx-auto"
    style="height: 1px"
  ></div>

  <div>
    <router-link :to="link" class="flex">
      <div
        class="flex w-full hover:bg-gray-800 mx-2 rounded-lg h-16 items-center"
      >
        <div class="flex flex-1 flex-col px-3">
          <div class="flex items-baseline">
            <p class="text-white inline">{{ name }}</p>
            <Tooltip inline class="ml-2">
              <span
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
            <!-- Bullet placeholder during loading: -->
            <span v-if="!loaded" class="text-transparent text-lg">●</span>
          </div>

          <div class="flex w-full items-center mt-0.5">
            <span class="text-sm inline flex-1">
              {{ location }}
            </span>
            <!-- <span
              v-if="blocksLeft"
              class="text-xs bg-gray-800 px-1.5 pb-0.5 rounded-md"
              >{{ blocksLeft }}</span>-->
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
import Tooltip from "./Tooltip.vue"

export default {
  components: { Tooltip },
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
  },

  methods: {
    async getHotspotInfos(address) {
      const res = await fetch("https://api.helium.io/v1/hotspots/" + address)
      let { data } = await res.json()
      this.timestampAdded = data.timestamp_added.split(".")[0] + "Z"
      this.status = data.status.online

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
  },
  async created() {
    this.timer = setInterval(this.updateData, 600000)
    await this.updateData()

    this.loaded = true
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>

<style lang="postcss" scoped></style>
