<template>
  <perfect-scrollbar class="flex flex-col">
    <h2 class="text-gray-300 mt-4 text-sm text-center">
      You found the <span class="uppercase block">donation page!</span>
    </h2>
    <div
      class="
        text-sm
        w-10/12
        mx-auto
        flex flex-col
        mt-3
        mb-5
        text-center
        space-y-5
        text-gray-400
      "
    >
      <img src="../assets/gift.svg" class="w-10 mx-auto opacity-50 -mb-2" />

      <p>
        <b>HeliumFlick</b> is open source and free to use.<br />
        If you want to support this project, and have some HNT to spare, here is
        the QR code to
        <a
          href="#"
          @click.prevent="
            openExternalUrl(
              'https://explorer.helium.com/accounts/149kQ47ptZDkajLCsTg3AEX3G6qgaLBj18NBLcokjA9i4KznBVo'
            )
          "
          class="text-blue-500 underline hover:text-white"
          >my HNT wallet</a
        >, that you can use with your mobile <b>Helium App</b>.
      </p>

      <QRCodeVue3
        :width="190"
        :height="190"
        value="149kQ47ptZDkajLCsTg3AEX3G6qgaLBj18NBLcokjA9i4KznBVo"
        :dotsOptions="{
          type: 'rounded',
          color: '#26249a',
          gradient: {
            type: 'linear',
            rotation: 0,
            colorStops: [
              { offset: 0, color: '#000000' },
              { offset: 1, color: '#26249a' },
            ],
          },
        }"
        :cornersSquareOptions="{
          type: 'square',
        }"
        class="mx-auto py-1"
      />
      <p>Any tip is greatly appreciated, <br />thank you for your support!</p>
    </div>
  </perfect-scrollbar>
</template>

<script>
import QRCodeVue3 from 'qrcode-vue3'

export default {
  components: { QRCodeVue3 },
  methods: {
    openExternalUrl,
  },
}
</script>

<style lang="postcss" scoped></style>
