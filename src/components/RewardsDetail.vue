<template>
  <div class="mx-auto py-0.5 items-baseline">
    <div
      class="
        flex
        text-white text-left
        pl-3
        text-customxs
        font-light
        w-11/12
        mx-auto
        border-b border-l
        bg-gradient-to-tr
        rounded-bl-md
        py-1
      "
      :style="{
        borderColor: info.color,
        backgroundImage: getGradient(info.color),
      }"
    >
      <p class="w-28">{{ info.name }}</p>
      <span class="flex-1 text-right text-customxs text-gray-300 mr-3">
        {{ (item.amount / 100000000).toFixed(6) }} HNT</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  data() {
    return {
      gradient: '',
    }
  },
  computed: {
    info() {
      switch (this.item.type) {
        case 'poc_challengers':
          return { name: 'Challenger', color: '#480087' }

        case 'poc_challengees':
          return { name: 'Beacon', color: '#414278' }

        case 'data_credits':
          return { name: 'Data Credits', color: '#006666' }

        case 'poc_witnesses':
          return { name: 'Witness', color: '#b86f00' }

        // case "assert_location_v2":
        //   return { name: "Assert Location", color: "#12a5ba" }

        case 'consensus':
          return { name: 'Consensus', color: '#8f0000' }

        default:
          return { name: this.item.type, color: '#666' }
      }
    },
    // getGradient() {
    //   return `linear-gradient(45deg, ${this.info.color}, transparent)`
    // },
  },
  methods: {
    getGradient(color) {
      return `linear-gradient(5deg, ${color} 0%, transparent 45%)`
    },
  },
}
</script>
