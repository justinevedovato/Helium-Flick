<template>
  <div>
    <span class="flex mt-2 mb-2">
      <a
        href="#"
        @click.prevent="
          openExternalUrl('https://explorer.helium.com/accounts/' + item.id)
        "
        class="flex flex-1 items-baseline"
      >
        <p
          class="
            text-white
            mx-auto
            w-11/12
            text-center
            bg-gray-800 bg-opacity-70
            hover:bg-opacity-100
            rounded-full
            py-0.5
          "
        >
          {{ item.label }}
        </p>
      </a>
      <span @click="showDel = !showDel" class="flex items-center"
        ><Tooltip inline dir="left" class="ml-auto"
          ><img
            src="../assets/trash.svg"
            alt=""
            class="delete-icon w-4 h-4 mr-3"
          /><template #tooltip> Delete </template>
        </Tooltip></span
      >
    </span>
    <div v-if="showDel" class="flex justify-center mr-3 mb-3">
      <p class="text-xs flex space-x-2">
        <span>Delete this wallet?</span>
        <span
          @click="showDel = false"
          class="
            bg-gray-800
            px-1.5
            rounded-md
            hover:bg-gray-700 hover:text-gray-200
            cursor-pointer
          "
          >No</span
        ><span
          @click="deleteWallet(item.id)"
          class="
            bg-gray-800
            px-1.5
            rounded-md
            hover:bg-red-900 hover:text-gray-200
            cursor-pointer
          "
          >Yes</span
        >
      </p>
    </div>

    <div class="flex w-full mx-2 h-28 overflow-hidden mb-2 items-center">
      <div class="flex flex-col justify-center">
        <div class="divide divide-x divide-gray-500 text-sm mx-auto mb-1">
          <span
            @click="showRewards = false"
            class="px-2 cursor-pointer"
            :class="{
              'text-gray-200 underline': !showRewards,
              'text-gray-400': showRewards,
            }"
            >Balance</span
          >
          <span
            @click="showRewards = true"
            class="px-2 cursor-pointer"
            :class="{
              'text-gray-400': !showRewards,
              'text-gray-200 underline': showRewards,
            }"
            >Rewards</span
          >
        </div>
        <div
          class="mx-auto bg-black mt-1 bg-opacity-20 rounded-md flex text-sm"
        >
          <MonthlyChart
            v-if="showRewards"
            :data="rewardsMonth"
            :color="[
              '#533975',
              '#5f4885',
              '#775f9e',
              '#7d6da8',
              '#a191c2',
              '#bfb2d4',
              '#cac1de',
            ]"
          />
          <MonthlyChart
            v-if="!showRewards"
            type="line"
            :data="balanceMonth"
            :color="['#85092e']"
          />
        </div>
      </div>
      <div v-if="loaded" class="flex flex-1 flex-col items-center">
        <p class="text-xs text-center mt-2">Current balance</p>
        <span class="font-extralight text-2xl text-gray-200">
          {{ balance }} HNT
        </span>
        <span class="font-light leading-5 text-gray-500">
          (~{{ oraclePrice }} USD)
        </span>
      </div>

      <!-- Spinner -->
      <div
        v-if="!loaded"
        class="flex items-center self-center mx-auto justify-center h-16"
      >
        <div
          class="
            loader
            ease-linear
            rounded-full
            border-4 border-t-4 border-gray-800
            h-16
            w-16
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '~/store'
import Tooltip from './Tooltip.vue'
import LoadingDots from '~/components/LoadingDots.vue'
import MonthlyChart from '~/components/MonthlyChart.vue'

export default {
  components: { Tooltip, LoadingDots, MonthlyChart },
  props: ['item'],
  data() {
    return {
      balance: '',
      rewardsTotal: '',
      balanceMonth: [],
      rewardsMonth: [],
      timestampAdded: '',
      loaded: false,
      timer: '',
      showRewards: false,
      showDel: false,
      oraclePrice: '',
    }
  },

  methods: {
    openExternalUrl,
    async geWalletInfos(address) {
      const res = await fetch(
        'https://helium-api.stakejoy.com/v1/accounts/' + address
      )
      let { data } = await res.json()
      this.balance = (data.balance / 100000000).toFixed(2)
      this.oraclePrice = (
        (data.balance / 100000000) *
        (store.oraclePrice / 100000000)
      ).toFixed(2)
    },

    async getBalance(address) {
      const res = await fetch(
        'https://helium-api.stakejoy.com/v1/accounts/' + address + '/stats'
      )
      let { data } = await res.json()
      let monthAll = data.last_month
      this.balanceMonth = monthAll.map((r) => r.balance / 100000000).reverse()
    },

    deleteWallet(id) {
      for (let i = 0; i < store.wallets.length; i++) {
        if (store.wallets[i].id == id) {
          store.wallets.splice(i, 1)
          i--
        }
        localStorage.setItem('wallets', JSON.stringify(store.wallets))
      }
    },

    async getRewards(address) {
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
        min_time: '-30 day',
        max_time: UTCTime.toISOString(),
      })
      const res = await fetch(
        'https://helium-api.stakejoy.com/v1/accounts/' +
          address +
          '/rewards/sum?' +
          params.toString()
      )
      let { data } = await res.json()
      this.rewardsMonth = data.map((r) => r.total).reverse() // For the graph
    },
    async reload() {
      this.loaded = false
      await this.updateData()
      this.loaded = true
    },
    async updateData() {
      await this.geWalletInfos(this.item.id)
      await this.getBalance(this.item.id)
      await this.getRewards(this.item.id)
    },
  },
  async created() {
    this.timer = setInterval(this.updateData, 600000)
    await this.updateData()

    // Show when the rest is loaded
    this.loaded = true
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
}
</script>

<style lang="postcss" scoped>
.delete-icon {
  filter: invert(50%) sepia(40%) hue-rotate(170deg);
  @apply opacity-20 hover:opacity-50 cursor-pointer;
}
</style>
