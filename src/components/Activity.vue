<template>
  <div>
    <div class="text-center flex w-full pl-2">
      <div class="group flex items-baseline">
        <div
          @click="toggleDetails"
          class="text-white text-customxs font-light w-32 py-1.5 rounded-full"
          :class="{ 'cursor-pointer': item.path || item.rewards }"
          :style="{ backgroundColor: info.color }"
        >
          {{ info.name }}
        </div>
        <div>
          <p class="w-12 text-center text-xs leading-3">{{ timeHour }}</p>
        </div>
      </div>

      <!-- If witness: -->
      <div
        v-if="item.path"
        class="text-customxs ml-auto mr-2 flex self-center items-baseline"
      >
        <p>
          {{ getLocation }}
        </p>
        <span class="bg-gray-800 text-gray-300 rounded-full py-0.5 px-2 ml-2">{{
          item.path[0].witnesses.length
        }}</span>
      </div>

      <!-- If reward: -->
      <div
        v-if="item.rewards"
        class="
          text-sm text-gray-200
          ml-auto
          mr-2
          flex
          self-center
          items-baseline
        "
      >
        <span>{{ totalRewards }} HNT</span>
      </div>

      <!-- If packet transfer: -->
      <div
        v-if="item.state_channel"
        class="
          text-sm text-gray-200
          ml-auto
          mr-2
          flex
          self-center
          items-baseline
        "
      >
        <span>{{ item.state_channel.summaries[0].num_dcs }} DC</span>
      </div>
    </div>

    <!-- Dropdown for rewards details:  -->
    <div v-if="item.rewards && detailVisible" class="mt-1 mx-1.5 px-1 py-0.5">
      <RewardsDetail v-for="item in item.rewards" :key="item" :item="item" />
    </div>

    <!-- Dropdown for witness details:  -->
    <div
      v-if="item.path && detailVisible"
      class="mt-1 bg-black bg-opacity-20 mx-1.5 px-1 py-0.5 rounded-lg"
    >
      <template v-if="item.path[0].witnesses.length">
        <div
          v-if="item.challenger !== address"
          class="text-sm w-11/12 mx-auto flex my-2"
        >
          <div class="flex-1">
            <span class="text-gray-400 block mb-0.5">Challenger</span>
            <span class="text-yellow-500 m-1.5">➜</span>

            <LoadingDots v-if="!isLoaded" />

            <span
              class="text-gray-300 hover:bg-gray-800 px-2 py-0.5 rounded-md"
            >
              <a
                href="#"
                @click.prevent="
                  openExternalUrl(
                    'https://explorer.helium.com/hotspots/' + challenger
                  )
                "
              >
                {{ challengerName }}
              </a></span
            >
          </div>
          <span class="text-right flex items-end"
            >{{ challengerLocation }}
            <img :src="challengerFlagURL" class="h-4 ml-2 mb-0.5"
          /></span>
        </div>
        <div
          v-if="item.path[0].challengee !== address"
          class="text-sm w-11/12 mx-auto flex my-2"
        >
          <div class="flex-1">
            <span class="text-gray-400 block mb-0.5">Beaconer</span>
            <span class="text-blue-500 mx-1.5">➜</span>
            <span
              class="text-gray-300 hover:bg-gray-800 px-2 py-0.5 rounded-md"
            >
              <a
                href="#"
                @click.prevent="
                  openExternalUrl(
                    'https://explorer.helium.com/hotspots/' + beaconer
                  )
                "
              >
                {{ beaconerName }}
              </a>
            </span>
          </div>
          <span class="text-right flex items-end"
            >{{ beaconerLocation }}
            <img :src="beaconerFlagURL" class="h-4 ml-2 mb-0.5"
          /></span>
        </div>
        <div class="flex justify-center mt-3 mb-1.5">
          <p
            class="
              font-light
              align-center
              inline-flex
              space-x-4
              py-1.5
              px-2.5
              rounded-md
              bg-gray-800 bg-opacity-50
              uppercase
              text-customxs text-gray-100
            "
          >
            <span> Valid: {{ validWitnesses }} </span>
            <span> Invalid: {{ invalidWitnesses.length }} </span>
          </p>
        </div>

        <div v-if="invalidWitnesses.length" class="my-3">
          <p class="uppercase text-xs text-gray-300 ml-4 py-1">
            Invalid Witnesses:
          </p>
          <InvalidWitness
            v-for="witness in invalidWitnesses"
            :key="witness"
            :item="witness"
          />
        </div>
      </template>
      <div v-else class="text-center py-2 text-sm">No Witnesses</div>
    </div>

    <!-- Divider: -->
    <div
      class="w-52 bg-gradient-to-r from-gray-900 to-gray-800 ml-auto"
      style="height: 1px; margin-top: 1px; margin-bottom: 1px"
    ></div>
  </div>
</template>

<script>
import animalHash from 'angry-purple-tiger'
import RewardsDetail from './RewardsDetail.vue'
import InvalidWitness from './InvalidWitness.vue'
import LoadingDots from './LoadingDots.vue'

export default {
  components: { RewardsDetail, InvalidWitness, LoadingDots },
  props: ['item', 'index', 'address'],
  data() {
    return {
      isValid: true,
      detailVisible: false,
      isLoaded: false,
      challenger: '',
      challengerName: '',
      challengerLocation: '',
      challengerFlagURL: '',
      beaconer: '',
      beaconerName: '',
      beaconerLocation: '',
      beaconerFlagURL: '',
    }
  },

  computed: {
    info() {
      switch (this.item.type) {
        case 'rewards_v2':
          return { name: 'Mining Reward', color: '#cf7d00' }

        case 'poc_receipts_v1':
          if (this.item.challenger == this.address)
            return { name: 'Challenger', color: '#480087' }

          if (this.item.path[0].challengee == this.address)
            return { name: 'Beacon', color: '#414278' }

          let witness = this.item.path[0].witnesses.find(
            (w) => w.gateway == this.address
          )
          if (witness.is_valid) return { name: 'Witness', color: '#914c07' }

          return { name: 'Witness', color: '#6f6f6f' }

        case 'poc_request_v1':
          return { name: 'PoC Challenger', color: '#21a974' }

        case 'state_channel_close_v1':
          return { name: 'Packets Transferred', color: '#006666' }

        case 'add_gateway_v1':
          return { name: 'Add Hotspot', color: '#3b4b6a' }

        case 'assert_location_v2':
          return { name: 'Assert Location', color: '#12a5ba' }

        case 'consensus_group_v1':
          return { name: 'Consensus Election', color: '#8f0000' }

        default:
          return { name: this.item.type, color: '#666' }
      }
    },

    getLocation() {
      let hotspot = this.item.path[0]
      if (
        hotspot.geocode.short_city &&
        hotspot.geocode.short_city.length > 20
      ) {
        return (
          hotspot.geocode.short_city.slice(0, 19) +
          '..., ' +
          hotspot.geocode.short_country
        )
      } else {
        return hotspot.geocode.short_city + ', ' + hotspot.geocode.short_country
      }
    },
    timeHour() {
      let date = new Date(this.item.time * 1000)
        .toLocaleString('fr')
        .split(',')[1]
        .split(':')
      return date[0] + ':' + date[1]
    },

    totalRewards() {
      return (
        this.item.rewards.reduce((acc, r) => acc + r.amount, 0) / 100000000
      ).toFixed(3)
    },

    validWitnesses() {
      return this.item.path[0].witnesses.filter((w) => w.is_valid).length
    },

    invalidWitnesses() {
      return this.item.path[0].witnesses.filter((w) => !w.is_valid)
    },
  },
  methods: {
    openExternalUrl,
    toggleDetails() {
      this.detailVisible = !this.detailVisible
      if (this.detailVisible) {
        this.getChallenger()
      }
    },
    async getChallenger() {
      if (this.item.challenger) {
        let res = await fetch(
          'https://helium-api.stakejoy.com/v1/hotspots/' + this.item.challenger
        )
        let { data } = await res.json()

        this.challenger = this.item.challenger
        // get name:
        this.challengerName = data.name
          .split('-')
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join(' ')

        // get location:
        if (!data.geocode.short_city) {
          this.challengerLocation = 'unknown, ' + data.geocode.short_country
        } else if (data.geocode.short_city.length > 16) {
          this.challengerLocation =
            data.geocode.short_city.slice(0, 14) +
            '...,' +
            data.geocode.short_country
        } else {
          this.challengerLocation =
            data.geocode.short_city + ', ' + data.geocode.short_country
        }

        // get flag:
        this.challengerFlagURL = `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/${data.geocode.short_country.toLowerCase()}.svg`

        this.isLoaded = true
      }
    },

    async getBeaconer() {
      if (this.item.path && this.item.path[0].challengee !== this.address) {
        let hotspot = this.item.path[0]
        // get name:
        this.beaconer = hotspot.challengee
        this.beaconerName = animalHash(hotspot.challengee)

        // get location:
        if (hotspot.geocode && hotspot.geocode.short_city.length > 16) {
          this.beaconerLocation =
            hotspot.geocode.short_city.slice(0, 14) +
            '...,' +
            hotspot.geocode.short_country
        } else {
          this.beaconerLocation =
            hotspot.geocode.short_city + ', ' + hotspot.geocode.short_country
        }

        // get flag:
        this.beaconerFlagURL = `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/${hotspot.geocode.short_country.toLowerCase()}.svg`
      }
    },
  },
  created() {
    this.getBeaconer()
  },
}
</script>
