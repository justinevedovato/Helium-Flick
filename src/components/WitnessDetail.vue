<template>
  <div class="w-11/12 mx-auto py-0.5 items-baseline">
    <div
      class="text-white text-left pl-2 text-customxs font-light w-full border-b border-l bg-gradient-to-tr to-transparent via-transparent rounded-bl-md py-1"
      :class="[
        isValid
          ? 'border-emerald-800 from-emerald-900'
          : 'border-gray-600 from-gray-700',
      ]"
    >
      <div class="flex items-center">
        <p class="text-customxs leading-4">{{ name }}</p>
        <span
          v-if="!isValid"
          class="flex-1 text-right text-xs uppercase text-gray-200"
        >
          {{ reason }}
        </span>
        <div
          v-else
          class="flex-1 text-right divide-x divide-gray-700 text-xs text-gray-300"
        >
          <span class="pr-2">Signal: {{ item.signal }}</span>
          <span class="pl-2">SNR: {{ item.snr.toFixed(1) }}</span>
        </div>
      </div>
      <div
        v-if="!isValid"
        class="flex justify-end divide-x divide-gray-700 text-xs my-0.5 text-gray-300"
      >
        <span class="pr-2">Signal: {{ item.signal }}</span>
        <span class="pl-2">SNR: {{ item.snr.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import animalHash from 'angry-purple-tiger'

export default {
  props: ['item'],
  data() {
    return {
      name: '',
    }
  },
  computed: {
    reason() {
      switch (this.item.invalid_reason) {
        case 'witness_rssi_below_lower_bound':
          return 'RSSI below lower bound'

        case 'witness_rssi_too_high':
          return 'RSSI too high'

        case 'witness_too_close':
          return 'Witness too close'

        case 'witness_too_far':
          return 'Witness too far'

        default:
          return this.item.invalid_reason
      }
    },
    isValid() {
      return !this.item.invalid_reason
    },
  },
  methods: {
    async getName() {
      this.name = animalHash(this.item.gateway)
    },
  },
  created() {
    this.getName()
  },
}
</script>
