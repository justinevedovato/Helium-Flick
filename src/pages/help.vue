<template>
  <h2 class="text-center uppercase text-gray-300 mt-2 mb-3">
    Help / Infos section
  </h2>

  <perfect-scrollbar class="list flex-1">
    <div class="w-5/6 mx-auto mb-5">
      <h3>Hotspot Status</h3>

      <div class="text-sm text-gray-400 space-y-2">
        <p>
          <span class="text-green-600 mr-2">●</span> Your hotspot is online on
          the network
        </p>
        <p>
          <span class="text-yellow-500 animate-pulse mr-2">●</span> Your hotspot
          is on the network, but still syncing with the blockchain
        </p>
        <p>
          <span class="text-red-700 mr-2">●</span>Your hotspot is offline, and
          stopped syncing with the blockchain
        </p>
        <p>
          <span class="text-yellow-700 mr-2">●</span>Your hotspot is relayed
        </p>
      </div>
      <p
        class="
          text-sm
          mt-3
          text-gray-400 text-justify
          bg-black bg-opacity-20
          p-4
          rounded-md
        "
      >
        <span class="underline">Warning</span>: Please note that depending on
        your miner*, the status information given by Helium API is very likely
        <b>outdated</b>. If your hotspot shows "syncing" but you are seeing
        activity happening, then it is actually online.<br />Those bullets are
        shown as an indicator, but if you have a dedicated dashboard, your
        status info will be much more reliable there.<br />If you see different
        status in several places, then you should always trust your dashboard
        before this app, or the Explorer.
      </p>

      <p class="text-xs text-gray-400 text-justify py-4 px-2 rounded-md">
        * If you own a LongAP device, the status info comes from their own API,
        which gives you more accurate data. In case it fails, it falls back to
        Helium API.
      </p>

      <h3>
        Releases
        <span
          v-if="updateReady"
          class="bg-red-700 text-white py-0.5 px-1 rounded-sm ml-2"
          style="font-size: 10px"
          >NEW</span
        >
      </h3>

      <div v-if="updateReady" class="text-gray-400 text-sm leading-6">
        <p>An update is available!</p>
        <p>
          Your version is
          <span class="font-bold">{{ currentVersion }}.</span>
        </p>
        <p>
          The latest version is
          <span class="font-bold">{{ newVersion }}.</span>
        </p>
        <p class="text-center my-4">
          <a
            href="#"
            @click.prevent="
              openExternalUrl(
                'https://github.com/justinevedovato/Helium-Flick/releases'
              )
            "
            class="
              hover:underline
              text-gray-200
              bg-seagreen bg-opacity-70
              py-2
              px-3
              rounded-md
            "
            >Download it here!
          </a>
        </p>
      </div>

      <div v-else class="text-gray-400 text-sm leading-6">
        <p>You are up to date!</p>
        <p class="text-center my-4">
          <a
            href="#"
            @click.prevent="
              openExternalUrl(
                'https://github.com/justinevedovato/Helium-Flick/releases'
              )
            "
            class="hover:underline bg-black bg-opacity-30 py-2 px-3 rounded-md"
          >
            Find the releases here
          </a>
        </p>
      </div>
      <h3>Wallets</h3>
      <p class="text-sm mt-2 text-justify">
        <span class="underline">Balance</span>: The given USD price is
        calculated according to Oracle, which is also used by Helium Explorer.
      </p>
      <p class="text-sm mt-2 text-justify">
        <span class="underline">More details</span>: Clicking on the Wallet name
        will open it on the Explorer webpage, if you want more data about your
        activities and transactions.
      </p>
      <p class="text-sm mt-2 text-justify">
        <span class="underline">Graphs</span>: If your wallet doesn't give you
        the option to toggle between the Balance graph and the Rewards graph,
        it's because it doesn't have hotspots attached, and therefore can't earn
        HNT. Any transfered/received HNT will be visible in the Balance graph
        only.
      </p>
    </div>
  </perfect-scrollbar>

  <Footer></Footer>
</template>

<script>
import Footer from '../components/Footer.vue'
import store from '../store.js'

export default {
  components: { Footer },
  data() {
    return {
      currentVersion: store.versions.current,
      newVersion: store.versions.new,
      updateReady: false,
    }
  },
  methods: {
    openExternalUrl,
    hasNewVersion() {
      if (this.currentVersion !== this.newVersion) {
        this.updateReady = true
      }
    },
  },
  created() {
    this.hasNewVersion()
  },
}
</script>

<style scoped>
h3 {
  @apply mb-3 mt-2 text-gray-300 relative;
  &::after {
    @apply w-48 absolute -bottom-0.5 left-0 bg-gradient-to-r from-gray-500 to-gray-900;
    content: '';
    height: 1px;
  }
}
</style>
