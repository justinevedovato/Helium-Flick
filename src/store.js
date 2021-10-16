import { reactive } from 'vue'

export default reactive({
  addresses: [],
  hotspots: {},
  wallets: [],
  versions: {},
  display: {
    maker: true,
  },
  oraclePrice: ''
})
