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
        <!-- When there is no data to show yet: -->
        <template v-if="!hasHotspotItem">
          <template v-if="showMaker">
            <div
              class="h-full opacity-60 bg-gray-800"
              style="width: 7px"
              :class="brand.color"
            ></div>
          </template>
          <div class="h-full flex-1 flex-col px-3 pt-2">
            <p class="text-white inline mt-2">{{ name }}</p>
            <span class="ml-2 text-gray-600 animate-pulse">●</span>
          </div>
          <!-- Spinner -->
          <div class="flex items-center justify-center h-16">
            <div
              class="loader ease-linear rounded-full border-4 border-t-4 border-gray-800 mr-3 h-12 w-12"
            ></div>
          </div>
        </template>

        <!-- After data arrives: -->
        <template v-else>
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
              <p class="text-white inline">{{ name }}</p>
              <Tooltip inline class="ml-2">
                <span
                  :class="{
                    'text-green-600': item.new_status == 'online',
                    'text-yellow-500 animate-pulse':
                      item.new_status == 'syncing',
                    'text-red-700': item.new_status == 'offline',
                  }"
                  >●
                </span>
                <template #tooltip>
                  <span class="capitalize">{{ item.new_status }}</span>
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
              >{{ item.rewards_day.toFixed(2) }}
            </span>
            <span
              class="bg-indigo-900 bg-opacity-50 text-gray-100 py-0.5 px-2 rounded-full"
            >
              <span class="text-gray-400 text-xs pr-0.5">Total</span>
              {{ item.rewards_total.toFixed(2) }}
            </span>
          </div>
        </template>
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
      blocksLeft: '',
      location: '',
      status: '',
      loaded: '',
    }
  },

  computed: {
    hasHotspotItem() {
      return !!this.item.name
    },
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
      if (!this.hasHotspotItem) return ''
      return this.item.timestamp_added.split('.')[0] + 'Z'
    },

    brand() {
      return getBrand(this.item.payer)
    },

    isLight() {
      if (!this.hasHotspotItem) return ''
      return this.item.status.height > store.lightBlock
    },
  },

  methods: {
    async getHotspotInfos(hotspot) {
      if (!this.hasHotspotItem) return
      this.loaded = true

      if (hotspot.new_status == 'syncing') {
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

  watch: {
    hasHotspotItem() {
      this.getHotspotInfos(this.item)
    },
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
