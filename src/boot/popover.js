import { boot } from 'quasar/wrappers'
import { VClosePopper } from 'floating-vue'

export default boot(({ app }) => {
  app.directive('close-popover', VClosePopper)
})
