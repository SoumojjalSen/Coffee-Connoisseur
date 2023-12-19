import '@/styles/globals.css'
import StoreProvider from "../store/store-context.js"




export default function App({ Component, pageProps }) {
  return( 
    <StoreProvider>
      <Component {...pageProps} />  {/* all the different pages */}
    </StoreProvider>
  );  
}
