<template>
  <div class="h-screen flex flex-col relative overflow-y-hidden">
    <!-- Header -->
    <div class="flex-1 flex flex-col h-screen w-full absolute">
      <div class="flex pb-2 px-3 pt-3">
        <img
          alt="Vue logo"
          src="https://cryptologos.cc/logos/helium-hnt-logo.svg"
          class="
            w-14
            object-top object-contain
            h-full
            justify-self-start
            mt-2
            mr-5
            ml-0.5
          "
        />
        <div class="text-center flex-1 mb-2">
          <div>
            <h1 class="text-white text-lg inline font-thin">
              {{ name }}
            </h1>

            <div class="inline overflow-hidden mt-1 ml-1.5">
              <span v-if="hotspot.status == 'online'">
                <span class="text-green-600 text-xl ml-1">●</span>
              </span>
              <span v-if="hotspot.status == 'syncing'">
                <span class="text-yellow-500 text-xl ml-1 animate-pulse"
                  >●</span
                >
              </span>
              <span v-if="hotspot.status == 'offline'">
                <span class="text-red-700 text-xl ml-1">●</span>
              </span>
              <span v-if="hotspot.relayed">
                <span class="text-yellow-700 text-xl ml-1">●</span>
              </span>
            </div>
          </div>

          <div class="flex flex-col text-white mt-1 -mb-1.5">
            <span
              class="
                text-indigo-300 text-xl
                py-0.5
                mx-2
                rounded-full
                bg-gray-800 bg-opacity-50
              "
              ><LoadingDots v-if="!hotspot.rewardAmount" class="self-center" />
              <span>{{ hotspot.rewardAmount }}</span>
            </span>
            <!-- Last activity seen: -->
            <div
              class="
                text-sm
                justify-end
                text-gray-400
                mt-2
                mr-1.5
                flex
                align-baseline
              "
            >
              <LoadingDots v-if="!hotspot.lastUpdated" class="self-center" />
              <p>{{ hotspot.lastUpdated }}</p>
              <img
                @click="reload"
                src="/src/assets/refresh.svg"
                alt="Refresh"
                class="ml-2 h-5 opacity-40 hover:opacity-70 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- If no activities: -->
      <p v-if="!hotspot.lastUpdated && loaded" class="text-center mt-10">
        No activity
      </p>

      <!-- Activity feed:  -->
      <perfect-scrollbar class="list flex-1 px-2 pb-3">
        <div class="flex">
          <div
            class="
              w-56
              h-20
              bg-black bg-opacity-20
              rounded-md
              flex
              text-sm
              justify-center
              items-center
            "
          >
            <MonthlyChart :data="hotspot.monthAll" />
          </div>
          <div
            class="
              text-xs text-center
              flex-1
              text-gray-500
              justify-center
              flex flex-col
              space-y-1
            "
          >
            <p>
              <span>Today: </span>
              <LoadingDots v-if="!hotspot.today" class="self-center" />
              <span class="text-gray-200 uppercase"> {{ hotspot.today }}</span>
            </p>
            <p>
              <span>Last 7 days:</span>
              <LoadingDots v-if="!hotspot.week" class="self-center" />
              <span class="text-gray-200 uppercase"> {{ hotspot.week }} </span>
            </p>
            <p>
              <span>Last 30 days:</span>
              <LoadingDots v-if="!hotspot.month" class="self-center" />
              <span class="text-gray-200 uppercase"> {{ hotspot.month }}</span>
            </p>
          </div>
        </div>

        <!-- Spinner -->
        <div v-if="!loaded" class="flex justify-center mt-10">
          <div
            class="
              loader
              ease-linear
              rounded-full
              border-4 border-t-4 border-gray-800
              h-20
              w-20
            "
          ></div>
        </div>

        <div v-else v-for="(group, date) of activity2" :key="date">
          <h2
            @click="group.opened = !group.opened"
            class="text-gray-200 my-1 py-0.5 cursor-pointer"
            :class="{
              'bg-gray-800 rounded-md  bg-opacity-50': !group.opened,
            }"
          >
            <span
              v-if="group.opened"
              class="text-gray-700 text-customxs mx-1 cursor-pointer"
              >▼</span
            >
            <span v-else class="text-gray-700 text-customxs mx-1 cursor-pointer"
              >►</span
            >

            {{ date }}
          </h2>
          <transition-group
            appear
            v-if="group.opened"
            tag="div"
            name="slide-in"
            :style="{ '--total': group.items }"
          >
            <div
              v-if="group.opened"
              :class="{
                'border-l-2 border-gray-800 border-opacity-50': group.opened,
              }"
            >
              <Activity
                v-for="(item, index) of group.items"
                :key="index"
                :item="item"
                :address="address"
                :style="{ '--i': index }"
              /></div
          ></transition-group>
        </div>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import animalHash from "angry-purple-tiger"
import Activity from "~/components/Activity.vue"
import MonthlyChart from "~/components/MonthlyChart.vue"
import prettyms from "pretty-ms"
import LoadingDots from "~/components/LoadingDots.vue"

export default {
  components: { Activity, MonthlyChart, LoadingDots },
  props: ["address"],
  data() {
    return {
      hotspot: {
        status: "",
        relayed: false,
        lastUpdated: "",
        rewardAmount: "",
        today: "",
        week: "",
        month: "",
        monthAll: [],
      },
      activity: [],
      activity2: {},
      loaded: false,
      dropdownOpen: true,
      timestampAdded: "",
      timer: "",
    }
  },
  computed: {
    name() {
      let n = animalHash(this.address)
      if (n.length > 29) {
        return n.slice(0, 28) + "..."
      } else return n
    },
  },
  methods: {
    async getHotspotInfos(address) {
      const res = await fetch("https://api.helium.io/v1/hotspots/" + address)
      let { data } = await res.json()
      this.hotspot.status = data.status.online
      this.timestampAdded = data.timestamp_added.split(".")[0] + "Z"

      if (
        data.status.listen_addrs &&
        data.status.listen_addrs[0] &&
        data.status.listen_addrs[0].includes("p2p")
      ) {
        this.hotspot.relayed = true
      }
      if (
        data.block - data.status.height > 500 &&
        data.status.online != "offline"
      ) {
        this.hotspot.status = "syncing"
      }
    },

    async getActivity(address) {
      const res = await fetch(
        "https://api.helium.io/v1/hotspots/" + address + "/activity"
      )
      let { data, cursor } = await res.json()
      this.activity = data
      if (cursor) {
        const res2 = await fetch(
          "https://api.helium.io/v1/hotspots/" +
            address +
            "/activity?cursor=" +
            cursor
        )

        let { data: data2 } = await res2.json()
        this.activity = this.activity.concat(data2)
      }

      this.activity2 = this.activity.reduce((acc, item) => {
        const date = new Date(item.time * 1000)

        const dateString = date.toLocaleDateString(navigator.language, {
          month: "short",
          day: "numeric",
        })
        acc[dateString] = acc[dateString] || {}
        acc[dateString].items = acc[dateString].items || []
        acc[dateString].items.push(item)
        acc[dateString].opened = true
        return acc
      }, {})

      // Get latest activity time:
      if (this.activity[0]) {
        let latest = this.activity[0].time * 1000
        this.hotspot.lastUpdated =
          prettyms(+new Date() - latest, {
            compact: true,
          }) + " ago"
      }
    },

    async getTotalRewards(minTime) {
      const res = await fetch(
        "https://api.helium.io/v1/hotspots/" +
          this.address +
          "/rewards/sum?min_time=" +
          minTime
      )

      let { data } = await res.json()
      this.hotspot.rewardAmount = data.total.toFixed("2") + " HNT"
      return data
    },

    async getRewards() {
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
          this.address +
          "/rewards/sum?" +
          params.toString()
      )
      let { data } = await res.json()

      this.hotspot.monthAll = data.map((r) => r.total).reverse() // For the graph

      // For Day / Week / Month totals:
      this.hotspot.today = data[0].total.toFixed("2")
      this.hotspot.week = data
        .slice(0, 7)
        .reduce((acc, curr) => acc + curr.total, 0)
        .toFixed("2")
      this.hotspot.month = data
        .reduce((acc, curr) => acc + curr.total, 0)
        .toFixed("2")
    },
    async reload() {
      clearInterval(this.timer)
      this.loaded = false
      await this.updateData()
      this.loaded = true
    },
    async updateData() {
      await this.getHotspotInfos(this.address)

      await Promise.all([
        this.getTotalRewards(this.timestampAdded), // Total
        this.getRewards(), // Daily/weekly/monthly rewards
        this.getActivity(this.address), // Activity feed
      ])
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

<style lang="postcss"></style>
