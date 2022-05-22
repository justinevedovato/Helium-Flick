<template>
  <div class="flex flex-col flex-1 overflow-y-hidden relative">
    <h1 class="uppercase text-gray-300 text-center mt-2 mb-1">My Hotspots</h1>

    <div class="absolute right-1 top-2 items-center flex">
      <Tooltip inline dir="left" class="mr-1.5">
        <img
          @click="updateData"
          src="../assets/refresh.svg"
          alt="Refresh"
          class="h-6 opacity-40 hover:opacity-70 cursor-pointer mx-auto"
        /><template #tooltip>Refresh</template>
      </Tooltip>
    </div>

    <div class="flex justify-between px-5 text-sm mb-1">
      <div v-if="addresses.length">
        <select
          v-model="sortValue"
          class="flex border outline-none pb-0.5 border-gray-800 rounded bg-gray-900 pr-1"
        >
          <optgroup label="Sort by">
            <option value="default">Default</option>
            <option value="status">Status</option>
            <option value="day">Daily HNT</option>
            <option value="total">Total HNT</option>
          </optgroup>
        </select>
      </div>
      <span v-if="!loaded">
        {{ allHotspots.length }}/{{ addresses.length }}
      </span>
    </div>

    <perfect-scrollbar class="list flex-1 px-1.5 pb-3">
      <div v-if="allHotspots.length && loaded" class="flex-1 pb-1">
        <HotspotCard
          v-for="(item, index) in allHotspots"
          :key="index"
          :item="item"
        />
      </div>
      <div v-if="!addresses.length" class="flex flex-col">
        <p class="text-center mt-10 mb-12">No hotspots yet</p>
        <router-link
          to="/settings"
          class="bg-gray-800 hover:bg-indigo-900 px-2.5 py-1.5 rounded-lg text-sm mx-auto text-gray-300"
        >
          Add a hotspot
        </router-link>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import HotspotCard from '../components/HotspotCard.vue'
import Tooltip from '../components/Tooltip.vue'
import store from '../store.js'

export default {
  components: { HotspotCard, Tooltip },
  data() {
    return {
      allHotspotsObj: {},
      sortValue: 'default',
      timer: '',
    }
  },
  computed: {
    addresses() {
      return store.addresses
    },

    allHotspots() {
      return Object.entries(this.allHotspotsObj).map((e) => e[1])
    },

    showMaker() {
      return store.display.maker
    },

    loaded() {
      return true // this.allHotspots.length == this.addresses.length
    },
  },
  methods: {
    async sortHotspots(sortBy) {
      let newObj = {}
      // Default sorting (arranged by the user in the drag and drop)
      if (sortBy == 'default') {
        for (let address of this.addresses) {
          for (let i = 0; i < this.allHotspots.length; i++) {
            if (address == Object.keys(this.allHotspotsObj)[i]) {
              newObj[address] = this.allHotspotsObj[address]
            }
          }
        }
        // Sort by online status:
      } else if (sortBy == 'status') {
        let onlineArr = []
        let offlineArr = []
        for (let hotspot of this.allHotspots) {
          hotspot.status.online == 'online'
            ? onlineArr.push(hotspot)
            : offlineArr.push(hotspot)
        }

        onlineArr.concat(offlineArr).forEach((h) => {
          newObj[h.address] = h
        })

        // Sort by earnings:
      } else if (sortBy == 'day' || sortBy == 'total') {
        let arr = this.allHotspots
        if (sortBy == 'day') {
          arr.sort((a, b) => {
            return Number(b.rewards_day) - Number(a.rewards_day)
          })
        } else {
          arr.sort((a, b) => {
            return Number(b.rewards_total) - Number(a.rewards_total)
          })
        }

        arr.forEach((h) => {
          newObj[h.address] = h
        })
      }

      this.allHotspotsObj = newObj
    },

    async getHotspotInfos(address) {
      const res = await fetch(
        'https://ugxlyxnlrg9udfdyzwnrvghlu2vydmvycg.blockjoy.com/v1/hotspots/' +
          address
      )
      let { data } = await res.json()

      data.rewards_total = this.allHotspotsObj[address]?.rewards_total || 0
      data.rewards_day = this.allHotspotsObj[address]?.rewards_day || 0

      this.allHotspotsObj[address] = data
    },

    async getTotalRewards(address) {
      const res = await fetch(
        'https://ugxlyxnlrg9udfdyzwnrvghlu2vydmvycg.blockjoy.com/v1/hotspots/' +
          address +
          '/rewards/sum?min_time=' +
          this.allHotspotsObj[address].timestamp_added
      )
      let { data } = await res.json()
      this.allHotspotsObj[address].rewards_total = data.total
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
        bucket: 'day',
        min_time: '-1 day',
        max_time: UTCTime.toISOString(),
      })
      const res = await fetch(
        'https://ugxlyxnlrg9udfdyzwnrvghlu2vydmvycg.blockjoy.com/v1/hotspots/' +
          address +
          '/rewards/sum?' +
          params.toString()
      )
      let { data } = await res.json()
      this.allHotspotsObj[address].rewards_day = data[0].total
    },

    async updateData() {
      if (!this.addresses) return
      let promises = []

      this.addresses.forEach((a) => {
        promises.push(
          new Promise(async (resolve) => {
            await this.getHotspotInfos(a)
            await this.getTotalRewards(a)
            await this.getDailyRewards(a)
            resolve()
          })
        )
      })

      await Promise.allSettled(promises)
      console.log('updated')
      this.sortHotspots(this.sortValue)
    },
  },

  async created() {
    if (this.addresses) {
      let preparedHotspots = {}
      this.addresses.forEach((address) => {
        preparedHotspots[address] = { address }
      })
      this.allHotspotsObj = preparedHotspots
    }

    this.updateData()
    this.timer = setInterval(this.updateData, 60_000 * 5)
  },

  beforeUnmount() {
    clearInterval(this.timer)
    console.log('timer cleared')
  },

  watch: {
    loaded() {
      if (this.loaded) {
        this.updateData()
      }
    },
    sortValue() {
      this.sortHotspots(this.sortValue)
    },
  },
}
</script>
