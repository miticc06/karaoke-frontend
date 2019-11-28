import { createMuiTheme } from '@material-ui/core'

import palette from './palette'
import typography from './typography'
import overrides from './overrides'

const theme = createMuiTheme({
  palette,
  typography,
  overrides,
  zIndex: {
    appBar: 1100,
    drawer: 1000
  }
})

export default theme
