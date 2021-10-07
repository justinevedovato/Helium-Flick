<template>
  <div class="w-11/12 mx-auto py-0.5 items-baseline">
    <div
      class="
        flex
        text-white text-left
        pl-2
        text-customxs
        font-light
        w-full
        border-b border-l
        bg-gradient-to-tr
        from-gray-700
        to-transparent
        via-transparent
        border-gray-600
        rounded-bl-md
        py-1.5
      "
    >
      <p class="text-customxs">{{ name }}</p>
      <span class="flex-1 text-right text-xs uppercase text-gray-300 mr-2">
        {{ reason }}</span
      >
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
          return 'Below lower bound'

        case 'witness_too_close':
          return 'Too close'

        case 'witness_rssi_too_high':
          return 'Too high'

        default:
          return this.item.invalid_reason
      }
    },
  },
  methods: {
    async getInvalid() {
      this.name = animalHash(this.item.gateway)
    },
  },
  created() {
    this.getInvalid()
  },
}
</script>
