<template>
  <div class="h-screen flex flex-col relative overflow-y-hidden">
    <!-- Header -->
    <div class="flex-1 flex flex-col h-screen w-full absolute">
      <div class="flex pb-1.5 p-3">
        <div>
          <img
            alt="heliumflick logo"
            src="../../assets/nocirclelogo.svg"
            class="logo object-contain rounded-full object-top mt-1 mr-3 ml-1"
            style="width: 64px; height: 64px; border: 1px solid #7384c3"
          />
          <a
            href="#"
            @click.prevent="
              openExternalUrl(
                'https://explorer.helium.com/accounts/' + hotspot.brandAddress
              )
            "
            class="
              text-sm
              mt-2
              flex
              items-center
              px-1.5
              py-0.5
              hover:bg-black hover:bg-opacity-20 hover:text-gray-300
              cursor-pointer
              rounded-md
              absolute
            "
          >
            <div
              class="h-2 w-2 mr-2"
              :class="{
                'bg-seagreen': hotspot.brand == 'SenseCAP',
                'bg-blumine': hotspot.brand == 'LongAP',
                'bg-red-800': hotspot.brand == 'Bobcat',
                'bg-black': hotspot.brand == 'Nebra',
                'bg-purple-800': hotspot.brand == 'Helium Inc',
                'bg-indigo-900': hotspot.brand == 'Helium Inc (old)',
                'bg-yellow-600': hotspot.brand == 'Cal-Chip',
                'bg-purple-500': hotspot.brand == 'SyncroBit',
                'bg-pink-700': hotspot.brand == 'Linxdot',
                'bg-yellow-500': hotspot.brand == 'Kerlink',
                'bg-red-600': hotspot.brand == 'RAK wireless',
                'bg-green-400': hotspot.brand == 'COTX Networks',
                'bg-indigo-700': hotspot.brand == 'Heltec Automation',
                'bg-pink-500': hotspot.brand == 'Smart Mimic',
                'bg-green-300': hotspot.brand == 'Pisces Miner',
                'bg-gray-600': hotspot.brand == 'DeWi Foundation',
                'bg-blue-800': hotspot.brand == 'FreedomFi',
                'bg-eastblue': hotspot.brand == 'ClodPi',
                'bg-corn': hotspot.brand == 'Controllino',
                'bg-white': hotspot.brand == 'Data Only',
              }"
            ></div>
            <span>{{ hotspot.brand }}</span>
          </a>
        </div>

        <div class="text-center flex-1 mb-2">
          <div
            class="
              inline
              hover:bg-black hover:bg-opacity-20
              px-2
              rounded-md
              pt-1
              pb-1.5
            "
          >
            <h1 class="text-white text-lg inline font-thin leading-6">
              <a
                href="#"
                @click.prevent="
                  openExternalUrl(
                    'https://explorer.helium.com/hotspots/' + address
                  )
                "
              >
                {{ name }}
              </a>
            </h1>

            <Tooltip inline dir="bottom" class="ml-2">
              <span
                :class="{
                  'text-green-600': hotspot.status == 'online',
                  'text-yellow-500 animate-pulse': hotspot.status == 'syncing',
                  'text-red-700': hotspot.status == 'offline',
                }"
                >●</span
              >
              <template #tooltip>
                <span class="capitalize">{{ hotspot.status }}</span>
              </template>
            </Tooltip>
            <Tooltip inline dir="bottom" v-if="hotspot.relayed" class="ml-1.5">
              <span class="text-yellow-700">●</span>
              <template #tooltip>Relayed</template>
            </Tooltip>
          </div>

          <div class="flex flex-col text-white mt-2.5">
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
                mt-2.5
                mr-1.5
                -mb-1
                flex
                align-baseline
              "
            >
              <LoadingDots v-if="!hotspot.lastUpdated" class="self-center" />
              <p class="mr-2">{{ hotspot.lastUpdated }}</p>
              <Tooltip inline dir="left">
                <img
                  @click="reload"
                  src="/src/assets/refresh.svg"
                  alt="Refresh"
                  class="h-5 opacity-40 hover:opacity-70 cursor-pointer"
                />
                <template #tooltip>Reload</template></Tooltip
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Activity feed:  -->
      <perfect-scrollbar class="list flex-1 px-2 pb-3">
        <div class="flex">
          <div
            class="
              w-56
              h-20
              ml-1.5
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
        <!-- If no activities: -->
        <p v-if="!hotspot.lastUpdated && loaded" class="text-center mt-10">
          No activity
        </p>

        <div v-else v-for="(group, date) of activity2" :key="date">
          <h2
            @click="toggleDay(date)"
            class="text-gray-200 my-1 py-0.5 cursor-pointer"
            :class="{
              'bg-gray-800 rounded-md  bg-opacity-50':
                daysClosed.includes(date),
            }"
          >
            <span
              v-if="!daysClosed.includes(date)"
              class="text-gray-700 text-customxs mx-1 cursor-pointer"
              >▼</span
            >
            <span v-else class="text-gray-700 text-customxs mx-1 cursor-pointer"
              >►</span
            >

            {{ date }}
          </h2>
          <!-- <transition-group
            appear
            v-if="group.opened"
            tag="div"
            name="slide-in"
            :style="{ '--total': group.items }"
          > -->
          <div
            v-if="!daysClosed.includes(date)"
            :class="{
              'border-l-2 border-gray-800 border-opacity-50':
                !daysClosed.includes(date),
            }"
          >
            <Activity
              v-for="(item, index) of group.items"
              :key="index"
              :item="item"
              :address="address"
              :style="{ '--i': index }"
            />
          </div>
          <!-- </transition-group> -->
        </div>

        <!-- Spinner -->
        <div v-if="!loaded" class="flex justify-center mt-10 mb-12">
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

        <!-- Load More button  -->
        <div
          v-if="loaded && nextCursor"
          @click="loadMoreActivity"
          class="
            mx-auto
            w-24
            px-3
            py-2
            text-center
            rounded-md
            bg-black bg-opacity-30
            hover:bg-opacity-50
            cursor-pointer
            mt-7
            mb-12
            text-sm
          "
        >
          Load more
        </div>

        <div
          v-if="loaded && activity && !nextCursor"
          class="mt-5 mb-10 text-center text-sm"
        >
          End of the activity list
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
import Tooltip from "~/components/Tooltip.vue"

export default {
  components: { Activity, MonthlyChart, LoadingDots, Tooltip },
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
        brand: "",
        brandAddress: "",
      },
      activity: [],
      activity2: {},
      daysClosed: [],
      nextCursor: "",
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
    openExternalUrl,
    async getHotspotInfos(address) {
      const res = await fetch("https://api.helium.io/v1/hotspots/" + address)
      let { data } = await res.json()

      this.timestampAdded = data.timestamp_added.split(".")[0] + "Z"
      this.hotspot.brandAddress = data.payer

      // Status
      // Check if LongAP
      // if (data.payer == "12zX4jgDGMbJgRwmCfRNGXBuphkQRqkUTcLzYHTQvd4Qgu8kiL4") {
      //   const longapRes = await fetch(
      //     "https://status.longap.com/hotspot/status/" + address,
      //     {
      //       mode: "no-cors",
      //     }
      //   )
      //   let longapData = await longapRes.json()
      //   console.log(longapData)
      // } else {

      this.hotspot.status = data.status.online
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
      // }

      // Brand:
      if (data.payer == "13daGGWvDQyTyHFDCPz8zDSVTWgPNNfJ4oh31Teec4TRWfjMx53") {
        this.hotspot.brand = "Helium Inc"
      } else if (
        data.payer == "13ENbEQPAvytjLnqavnbSAzurhGoCSNkGECMx7eHHDAfEaDirdY"
      ) {
        this.hotspot.brand = "Cal-Chip"
      } else if (
        data.payer == "13Zni1he7KY9pUmkXMhEhTwfUpL9AcEV1m2UbbvFsrU9QPTMgE3"
      ) {
        this.hotspot.brand = "Nebra"
      } else if (
        data.payer == "14rb2UcfS9U89QmKswpZpjRCUVCVu1haSyqyGY486EvsYtvdJmR"
      ) {
        this.hotspot.brand = "SyncroBit"
      } else if (
        data.payer == "14sKWeeYWQWrBSnLGq79uRQqZyw3Ldi7oBdxbF6a54QboTNBXDL"
      ) {
        this.hotspot.brand = "Bobcat"
      } else if (
        data.payer == "14NBXJE5kAAZTMigY4dcjXSMG4CSqjYwvteQWwQsYhsu2TKN6AF"
      ) {
        this.hotspot.brand = "SenseCAP"
      } else if (
        data.payer == "14fzfjFcHpDR1rTH8BNPvSi5dKBbgxaDnmsVPbCjuq9ENjpZbxh"
      ) {
        this.hotspot.brand = "Helium Inc (old)"
      } else if (
        data.payer == "14eUfY1GsjK4WH6uZYoeagnFtigBKdvPruAXLmc5UsUMEDj3yib"
      ) {
        this.hotspot.brand = "Linxdot"
      } else if (
        data.payer == "12zX4jgDGMbJgRwmCfRNGXBuphkQRqkUTcLzYHTQvd4Qgu8kiL4"
      ) {
        this.hotspot.brand = "LongAP"
      } else if (
        data.payer == "13Mpg5hCNjSxHJvWjaanwJPBuTXu1d4g5pGvGBkqQe3F8mAwXhK"
      ) {
        this.hotspot.brand = "Kerlink"
      } else if (
        data.payer == "14h2zf1gEr9NmvDb2U53qucLN2jLrKU1ECBoxGnSnQ6tiT6V2kM"
      ) {
        this.hotspot.brand = "RAK wireless"
      } else if (
        data.payer == "13cbbZXzqwp6YMM5JvAu5T1TRhenENEJVU5Q8vpLhunQYE1Acpp"
      ) {
        this.hotspot.brand = "COTX Networks"
      } else if (
        data.payer == "14iC6N1HkqUjH7WEChHVQhPqJ1hbWBKpZXZVeHHykCA7tNDYF2C"
      ) {
        this.hotspot.brand = "Heltec Automation"
      } else if (
        data.payer == "13MS2kZHU4h6wp3tExgoHdDFjBsb9HB9JBvcbK9XmfNyJ7jqzVv"
      ) {
        this.hotspot.brand = "Smart Mimic"
      } else if (
        data.payer == "134C7Hn3vhfBLQZex4PVwtxQ2uPJH97h9YD2bhzy1W2XhMJyY6d"
      ) {
        this.hotspot.brand = "Pisces Miner"
      } else if (
        data.payer == "13LVwCqZEKLTVnf3sjGPY1NMkTE7fWtUVjmDfeuscMFgeK3f9pn"
      ) {
        this.hotspot.brand = "DeWi Foundation"
      } else if (
        data.payer == "13y2EqUUzyQhQGtDSoXktz8m5jHNSiwAKLTYnHNxZq2uH5GGGym"
      ) {
        this.hotspot.brand = "FreedomFi"
      } else if (
        data.payer == "13XuP2DjHEHVkKguDDZD2ev5AeqMLuJ8UQ44efEcDmVTnBcvc6F"
      ) {
        this.hotspot.brand = "ClodPi"
      } else if (
        data.payer == "14go8hvEDnotWTyhYv6Hu5PTnRUAQzJqbB6dsDm1oThkCcZe9zd"
      ) {
        this.hotspot.brand = "Controllino"
      } else if (data.payer === data.owner) {
        this.hotspot.brand = "Data Only"
      } else {
        this.hotspot.brand = "Unknown"
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

        let { data: data2, cursor: cursor2 } = await res2.json()
        this.activity = this.activity.concat(data2)
        this.nextCursor = cursor2
      }

      this.sortByDate()

      // Get latest activity time:
      if (this.activity[0]) {
        let latest = this.activity[0].time * 1000
        this.hotspot.lastUpdated =
          prettyms(+new Date() - latest, {
            compact: true,
          }) + " ago"
      }
    },

    async loadMoreActivity() {
      this.loaded = false
      try {
        const res = await fetch(
          "https://api.helium.io/v1/hotspots/" +
            this.address +
            "/activity?cursor=" +
            this.nextCursor
        )
        let { data, cursor } = await res.json()
        this.activity = this.activity.concat(data)
        this.nextCursor = cursor

        this.sortByDate()
        this.loaded = true
      } catch (e) {
        console.log(e)
        this.loaded = true
      }
    },

    sortByDate() {
      this.activity2 = this.activity.reduce((acc, item) => {
        const date = new Date(item.time * 1000)

        const dateString = date.toLocaleDateString(navigator.language, {
          month: "short",
          day: "numeric",
        })
        acc[dateString] = acc[dateString] || {}
        acc[dateString].items = acc[dateString].items || []
        acc[dateString].items.push(item)

        return acc
      }, {})
    },

    toggleDay(date) {
      if (this.daysClosed.includes(date)) {
        let index = this.daysClosed.indexOf(date)
        this.daysClosed.splice(index, 1)
      } else {
        this.daysClosed.push(date)
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
