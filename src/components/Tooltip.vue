<template>
  <div class="group relative" :class="{ inline: inline }">
    <slot></slot>
    <span
      class="tooltip"
      :class="{
        'left-full top-1/2 transform -translate-y-1/2 ml-1': dir == 'right',
        '-left-1 top-1/2 transform -translate-y-1/2 -translate-x-full':
          dir == 'left',
        'left-1/2 top-1 transform -translate-y-full -translate-x-1/2':
          dir == 'top',
        'left-1/2 -top-1 transform translate-y-full -translate-x-1/2':
          dir == 'bottom',
      }"
      ><slot name="tooltip"></slot
    ></span>
  </div>
</template>

<script>
export default {
  props: {
    inline: { type: Boolean, default: false },
    dir: { type: String, default: 'right' },
  },
}
</script>

<style scoped>
.tooltip {
  @apply invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute text-gray-300 text-sm py-1 px-1.5 rounded-md z-50;
  background-color: #090f1c;
  transition: opacity 0.3s;
}

/* .tooltip {
  @apply text-lg leading-6 ml-1 relative inline-block;
  &:hover {
    .tooltip-text {
      @apply block;
    }
  }
} */
</style>
