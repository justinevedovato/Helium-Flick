<template>
  <!-- Divider: -->
  <div
    class="
      w-full
      bg-gradient-to-r
      from-gray-900
      via-gray-700
      to-gray-900
      mx-auto
    "
    style="height: 1px"
  ></div>
  <div class="h-10 mb-0.5 flex items-center w-full relative">
    <a
      href="#"
      @click.prevent="
        openExternalUrl('https://github.com/justinevedovato/Helium-Flick')
      "
      class="text-xs text-gray-500 text-center mx-auto"
      >HeliumFlick v{{ version }}
    </a>

    <div
      class="absolute right-2 w-7 opacity-50 hover:opacity-100 cursor-pointer"
    >
      <Tooltip inline dir="left">
        <router-link to="/donate">
          <img src="../assets/heart.svg" alt="" class="heart" />
          <img src="../assets/hand.svg" alt="" class="w-6 bottom-1.5 right-3" />
        </router-link>
        <template #tooltip> Donate </template>
      </Tooltip>
    </div>
  </div>
</template>

<script>
import Tooltip from "./Tooltip.vue"
import { version } from "../../package.json"

export default {
  components: { Tooltip },
  computed: {
    version() {
      return version
    },
  },
  methods: {
    openExternalUrl,
  },
}
</script>

<style>
.heart {
  @apply -mb-2.5 ml-1.5;
  width: 13px;
  -webkit-animation: heartbeat 1.2s ease infinite;
  animation: heartbeat 1.2s ease infinite;
}

@-webkit-keyframes heartbeat {
  0% {
    -webkit-transform: scale(0.8);
  }
  10% {
    -webkit-transform: scale(1);
  }
  30% {
    -webkit-transform: scale(0.8);
  }
  40% {
    -webkit-transform: scale(0.95);
  }
  to {
    -webkit-transform: scale(0.8);
  }
}
@keyframes heartbeat {
  0% {
    transform: scale(0.8);
  }
  10% {
    transform: scale(1);
  }
  30% {
    transform: scale(0.8);
  }
  40% {
    transform: scale(0.95);
  }
  to {
    transform: scale(0.8);
  }
}
</style>
