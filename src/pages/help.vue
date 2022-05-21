<template>
  <h2 class="text-center uppercase text-gray-300 mt-2 mb-3">
    Help / Infos section
  </h2>

  <perfect-scrollbar class="list flex-1">
    <div class="w-5/6 mx-auto mb-5">
      <h3>
        Releases
        <span
          v-if="updateReady"
          class="bg-red-700 text-white py-0.5 px-1 rounded-sm ml-2"
          style="font-size: 10px"
          >NEW
        </span>
      </h3>

      <div v-if="updateReady" class="text-gray-400 leading-6">
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
            class="hover:underline text-gray-200 bg-emerald-600 bg-opacity-70 py-2 px-3 rounded-md"
            >Download it here!
          </a>
        </p>
      </div>

      <div v-else class="text-gray-400 leading-6">
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

      <h3>Hotspot Status</h3>

      <div class="text-gray-400 space-y-2">
        <p>
          <span class="text-green-600 mr-2">●</span> Your hotspot is online on
          the network
        </p>
        <p>
          <span class="text-yellow-500 animate-pulse mr-2">●</span> Your hotspot
          is still below the light-hotspot block (after that happens, the
          "syncing" status becomes irrelevant). You should see a "__ blocks
          left" to indicate how far you are from this block.
        </p>
        <p>
          <span class="text-red-700 mr-2">●</span>Your hotspot is
          offline/inactive
        </p>
      </div>
      <p
        class="mt-3 text-gray-400 text-justify bg-black bg-opacity-20 p-4 rounded-md"
      >
        <span class="underline">Warning</span>: Please note that depending on
        your miner*, the status information given by Helium API is very likely
        <b>outdated</b>. If your hotspot shows "syncing" but you are seeing
        activity happening, then it is actually online.<br />Those bullets are
        only shown as an indicator.
      </p>

      <p class="!text-xs text-gray-400 text-justify pt-4 px-2 rounded-md">
        * If you own a LongAP device, the status info comes from their own API,
        which gives you more accurate data. In case it fails, it falls back to
        Helium API.
      </p>

      <h3>Invalid Witnesses</h3>
      <p class="mt-2 text-justify">
        <span class="underline">Signal / RSSI</span>: Received Signal Strength
        Indicator; it is reported by the hotspot and indicates how strong the
        signal device's radio signal was; the larger the number (closer to 0),
        the better the signal.
      </p>
      <p class="mt-2 text-justify">
        <span class="underline">SNR</span>: Signal to Noise Ratio; it is
        reported by the hotspot to indicate how clear the signal was relative to
        environmental noise (in dB); this generally ranges between -20 and +10
        and the larger the number (closer to 10 dB) the better.
      </p>

      <h3>Wallets</h3>
      <p class="mt-2 text-justify">
        <span class="underline">Balance</span>: The given USD price is
        calculated according to Oracle, which is also used by Helium Explorer.
      </p>
      <p class="mt-2 text-justify">
        <span class="underline">More details</span>: Clicking on the Wallet name
        will open it on the Explorer webpage, if you want more data about your
        activities and transactions.
      </p>
      <p class="mt-2 text-justify">
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

<style lang="postcss" scoped>
h3 {
  @apply mb-3 mt-4 first:mt-0 text-gray-300 relative;
  &::after {
    @apply w-48 absolute -bottom-0.5 left-0 bg-gradient-to-r from-gray-500 to-gray-900;
    content: '';
    height: 1px;
  }
}
p {
  @apply text-sm;
}
</style>
