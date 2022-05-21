import { reactive } from 'vue'
import { useStorage } from '@vueuse/core'

export default reactive({
  addresses: useStorage('addresses', []),
  hotspots: {},
  wallets: useStorage('wallets', []),
  versions: {},
  display: useStorage('display', { maker: true }),
  oraclePrice: '',
  lightBlock: 1350664,
  lastSeenBlock: useStorage('lastSeenBlock', {}),
})
