import * as React from 'react'
import Head from 'next/head'
import theme from '../lib/theme'
import { ThemeProvider } from 'theme-ui'

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default App
