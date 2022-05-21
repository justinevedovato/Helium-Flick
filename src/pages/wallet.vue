<template>
  <div class="flex flex-col space-y-0.5 flex-1 overflow-y-hidden relative">
    <h1 class="uppercase text-gray-300 text-center my-2">My Wallets</h1>

    <div class="absolute right-1 top-2 items-center flex">
      <Tooltip inline dir="left" class="mr-1.5">
        <img
          @click="refreshWallets"
          src="../assets/refresh.svg"
          alt="Refresh"
          class="h-6 opacity-40 hover:opacity-70 cursor-pointer mx-auto"
        /><template #tooltip>Refresh</template>
      </Tooltip>
    </div>

    <perfect-scrollbar class="list flex-1 px-2 pb-3">
      <div v-if="wallets.length" class="flex-1 pb-1">
        <WalletCard
          v-for="(item, index) in wallets"
          :ref="setCardRef"
          :key="index"
          :item="item"
        />
      </div>
      <div v-else class="flex flex-col">
        <p class="text-center mt-10 mb-12">No wallets yet</p>
        <p
          @click="toggleAdd"
          class="bg-gray-800 hover:bg-indigo-900 px-2.5 py-1.5 rounded-lg text-sm mx-auto mb-5 text-gray-300 cursor-pointer"
        >
          Add a wallet
        </p>
      </div>

      <div v-if="wallets.length" class="w-full flex">
        <Tooltip inline dir="left" class="flex ml-auto"
          ><p
            @click="toggleAdd"
            class="cursor-pointer px-1 mr-2 pb-1 rounded-sm inline-block text-3xl font-extralight leading-5 bg-gray-900 hover:bg-gray-800 my-2 text-gray-600 hover:text-gray-500"
          >
            +
          </p>
          <template #tooltip>
            {{ panelOpened ? 'Close' : 'Add a wallet' }}</template
          ></Tooltip
        >
      </div>
      <div
        v-if="panelOpened"
        class="flex flex-col w-11/12 space-y-1.5 mx-auto bg-black bg-opacity-30 rounded-lg py-2 px-4"
      >
        <div class="flex items-center">
          <span class="text-sm w-20">Address:</span>
          <input
            type="text"
            v-model="newWallet"
            name="wallet"
            id="wallet"
            placeholder="ex: 112ABtapyGs6amTaZUauXe6..."
            class="placeholder-gray-700 text-gray-300 px-2"
          />
        </div>
        <div class="flex items-center">
          <span class="text-sm w-20">Label:</span>
          <input
            type="text"
            v-model="newLabel"
            name="label"
            id="label"
            placeholder="Enter wallet name"
            class="placeholder-gray-700 text-gray-300 px-2"
          />
        </div>
        <div class="flex space-x-1.5 justify-end">
          <button
            @click="toggleAdd"
            class="self-end bg-gray-700 hover:bg-gray-600 hover:text-gray-200 px-2 py-0.5 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            @click="addNew"
            class="self-end bg-gray-700 hover:bg-indigo-900 hover:text-gray-200 px-2 py-0.5 rounded-md text-sm"
          >
            Add
          </button>
        </div>
        <p class="text-sm text-center">{{ message }}</p>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import WalletCard from '../components/WalletCard.vue'
import Tooltip from '../components/Tooltip.vue'
import store from '../store.js'

export default {
  components: { WalletCard, Tooltip },
  data() {
    return {
      newWallet: '',
      newLabel: '',
      loaded: false,
      cardRefs: [],
      panelOpened: false,
      message: '',
    }
  },
  computed: {
    wallets() {
      return store.wallets
    },
  },
  methods: {
    async addNew() {
      const res = await fetch(
        'https://ugxlyxnlrg9udfdyzwnrvghlu2vydmvycg.blockjoy.com/v1/accounts/' +
          this.newWallet
      )
      let { data } = await res.json()
      // No 404 response from ApplicationCache, check data instead:
      if (!data.block) {
        this.loaded = false
        this.message = "Sorry! This user doesn't exist"
        this.user = ''
        this.id = ''
      } else {
        if (!this.newLabel) {
          store.wallets.push({
            label: 'My Wallet',
            id: this.newWallet,
            showRewards: false,
          })
        } else {
          store.wallets.push({
            label: this.newLabel,
            id: this.newWallet,
            showRewards: false,
          })
        }
        this.newWallet = ''
        this.message = ''
        this.newLabel = ''
        this.panelOpened = false
      }
    },
    toggleAdd() {
      this.panelOpened = !this.panelOpened
      this.message = ''
    },
    refreshWallets() {
      this.cardRefs.forEach((c) => c.reload())
    },
    setCardRef(el) {
      if (el) {
        this.cardRefs.push(el)
      }
    },
  },
  beforeUpdate() {
    this.itemRefs = []
  },
}
</script>

<style lang="postcss" scoped>
input {
  @apply w-full h-7 rounded-md bg-gray-800 border border-gray-700 focus:border-indigo-700 focus:outline-none;
}
</style>
