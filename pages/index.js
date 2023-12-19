import Head from 'next/head'
import Image from 'next/image'  // Downloads image on the webpage on demand
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Banner from '@/components/banner'
import Card from '@/components/card'
import coffeeStoresData from '../data/coffee-stores.json' 
import fetchCoffeeStores from '@/lib/fetch-coffee-stores'
import trackUserLocation from '@/hooks/track-user-location'
import { useEffect, useState, useContext } from 'react'
import { ACTION_TYPES, StoreContext } from "../store/store-context.js"

const inter = Inter({ subsets: ['latin'] })


export async function getStaticProps() { // This code is on the server side
  const data = await fetchCoffeeStores(); // Should not fetch API as fetched at build time
  console.log("data :::", data);
  return {
    props: {
      stores: data,
    },
  }
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = trackUserLocation();
  const { dispatch, state } = useContext(StoreContext);
  
  // const [coffeeStoresNearMe, setCoffeeStoresNearMe] = useState(""); 
  const [storesNearMeError, setStoresNearMeError] = useState(null); 
  const { coffeeStores, latLong } = state;
  console.log("Home page ::: ", {latLong})

  const coffeeStoresNearMe = coffeeStores;

  useEffect(() => {
    const fetchData = async () => {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
          ); 
          
          const coffeeStores = await fetchedCoffeeStores.json();  

          dispatch ({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores,
            }
          });
          setStoresNearMeError("")
        } catch (error) {
          console.log({ error });
          setStoresNearMeError(error.message);
        }
      }
      
    };

    fetchData();
  
  }, [latLong]);

  const handleOnButtonClick = ()=>{
      handleTrackLocation();
  }

  return (
    <> {/* Root element */}
    {/* Appends to the head tag of the page. Head tells the technical details of the page */}
    <Head> 
      <title>Coffee Connoisseur</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    
    <main className={`${styles.main} ${inter.className}`}>
      <Banner buttonText={isFindingLocation ? "Locating..." : "View stores nearby"} handleOnClick={handleOnButtonClick}/>
      {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
      <div className={styles.heroImage}>
        <Image 
          src="/static/Hero-image.png"
          priority 
          // height={400} 
          // width={400}
          fill
          alt='coffee shop photo'
        />
      </div>

      {console.log(`props are:`, props)} {/* Appearing in inspect element*/}

      {storesNearMeError && <p>Something went wrong: {storesNearMeError}</p>}
      {coffeeStoresNearMe.length > 0 &&
      <>
      
        <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}>Stores near me</h2>
          <div className={styles.cardLayout}>
            {coffeeStoresNearMe.map((CoffeeStore)=>{
              return(  
                <Card 
                  key={CoffeeStore.id}
                  name={CoffeeStore.name}
                  imgUrl={CoffeeStore.imgUrl || "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"} 
                  href={`/coffee-store/${CoffeeStore.id}`} 
                  className={styles.card}
                />
              );
            })}
          </div>
        </div>    
      </>  
      }

      
      {props.stores.length > 0 &&
      <>      
        <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}>Stores near BIT Mesra</h2>
          <div className={styles.cardLayout}>
            {props.stores.map((CoffeeStore, idx)=>{
              if(idx < 6){
                return(  
                  <Card 
                    key={CoffeeStore.id}
                    name={CoffeeStore.name}
                    imgUrl={CoffeeStore.imgUrl || "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"} 
                    href={`/coffee-store/${CoffeeStore.id}`} 
                    className={styles.card}
                  />
                );
              }  
            })}
          </div>
        </div>    
      </>  
      }      
    </main>
    </>
  )
}
