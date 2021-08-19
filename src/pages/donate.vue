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
        mt-5
        mb-7
        text-center
        space-y-5
        text-gray-400
      "
    >
      <img src="../assets/gift.svg" class="w-12 mx-auto opacity-50" />

      <p>HeliumFlick is open source and free to use.</p>
      <p>
        If you want to support this project, and have some HNT to spare, here is
        the QR code to my HNT wallet, that you can use with your mobile
        <b>Helium Hotspot</b> app.
      </p>
      <p>Any tip will be greatly appreciated!</p>
    </div>

    <QRCodeVue3
      :width="190"
      :height="190"
      value="walletaddresshere"
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
      class="mx-auto"
    />

    <router-link
      to="/settings"
      class="
        px-3
        py-1.5
        mx-auto
        rounded-md
        mt-5
        mb-7
        bg-black bg-opacity-30
        hover:bg-opacity-60
        text-sm text-gray-400
      "
      >Back
    </router-link>
  </perfect-scrollbar>
</template>

<script>
import QRCodeVue3 from "qrcode-vue3"

export default {
  components: { QRCodeVue3 },
}
</script>

<style lang="postcss" scoped></style>
