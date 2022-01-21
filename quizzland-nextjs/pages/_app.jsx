import { useRouter } from "next/router"
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { useStore } from '../sotre'

import '../styles/styles.scss'
import '../styles/tailwind_build.css'

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();

  const store = useStore(pageProps.initialReduxState);

  useEffect(() => {

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100)
  }, [pathname]);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
