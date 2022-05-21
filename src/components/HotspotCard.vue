<template>
  <!-- Divider: -->
  <div
    class="w-52 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 mx-auto"
    style="height: 1px"
  ></div>

  <div>
    <router-link :to="link" class="flex">
      <div
        class="card flex w-full hover:bg-gray-800 mx-2 rounded-md h-16 overflow-hidden items-center"
      >
        <Tooltip v-if="showMaker" class="w-2 h-full">
          <div
            class="h-full opacity-60 brand-color"
            style="width: 7px"
            :class="brand.color"
          ></div>
          <template #tooltip>
            <span class="whitespace-nowrap">{{ brand.name }}</span>
          </template>
        </Tooltip>

        <div class="flex flex-1 flex-col px-3">
          <div class="flex items-baseline">
            <p class="text-white inline">
              {{ name }}
            </p>
            <Tooltip v-if="loaded" inline class="ml-2">
              <span
                :class="{
                  'text-green-600': status == 'online',
                  'text-yellow-500 animate-pulse': status == 'syncing',
                  'text-red-700': status == 'offline',
                }"
                >●
              </span>
              <template #tooltip>
                <span class="capitalize">{{ status }}</span>
              </template>
            </Tooltip>
          </div>

          <div class="flex w-full items-center mt-0.5">
            <span class="text-sm inline flex-1 h-6">
              {{ location }}
            </span>
            <span v-if="!isLight" class="text-xs">{{ blocksLeft }}</span>
          </div>
        </div>

        <div
          class="flex flex-col justify-center items-end pr-2 text-sm space-y-0.5"
        >
          <span
            class="bg-purple-900 bg-opacity-50 text-gray-100 py-0.5 px-2 rounded-full"
          >
            <span class="text-gray-400 text-xs pr-1">Day</span
            >{{ item.rewards_day ? item.rewards_day.toFixed(2) : '0.00' }}
          </span>
          <span
            class="bg-indigo-900 bg-opacity-50 text-gray-100 py-0.5 px-2 rounded-full"
          >
            <span class="text-gray-400 text-xs pr-0.5">Total</span>
            {{ item.rewards_total ? item.rewards_total.toFixed(2) : '0.00' }}
          </span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import animalHash from 'angry-purple-tiger'
import store from '~/store'
import Tooltip from './Tooltip.vue'
import LoadingDots from '~/components/LoadingDots.vue'
import { getBrand } from '~/utils'

export default {
  components: { Tooltip, LoadingDots },
  props: ['item'],
  data() {
    return {
      status: '',
      blocksLeft: '',
      location: '',
      rewardsDay: '',
      loaded: '',
    }
  },

  computed: {
    link() {
      return '/hotspot/' + this.item.address
    },
    name() {
      let n = animalHash(this.item.address)
      if (n.length > 29) {
        return n.slice(0, 25) + '...'
      } else return n
    },
    showMaker() {
      return store.display.maker
    },
    timestampAdded() {
      return this.item.timestamp_added.split('.')[0] + 'Z'
    },

    brand() {
      return getBrand(this.item.payer)
    },

    isLight() {
      return this.item.status.height > store.lightBlock
    },

    status() {
      if (this.item.status.online !== 'offline' && !this.isLight) {
        return 'syncing'
      } else {
        return this.item.status.online
      }
    },
  },

  methods: {
    getHotspotInfos(hotspot) {
      this.loaded = true
      if (!this.isLight && hotspot.status.online !== 'offline') {
        this.blocksLeft =
          store.lightBlock - hotspot.status.height + ' blocks left'
      }

      // Location:
      if (hotspot.geocode.long_city) {
        this.location =
          hotspot.geocode.long_city + ', ' + hotspot.geocode.short_country
        if (this.location.length > 22 && this.blocksLeft) {
          this.location = this.location.slice(0, 21) + '...'
        } else if (this.location.length > 30) {
          this.location = this.location.slice(0, 29) + '...'
        }
      } else {
        this.location = 'No location set'
      }
    },
  },

  created() {
    this.getHotspotInfos(this.item)
  },
}
</script>

<style lang="postcss" scoped>
.card:hover {
  .brand-color {
    @apply opacity-100;
  }
}
</style>
