// We create a dynamic route

import React from "react";
import { useRouter } from "next/router"; // Next js provides us with a hook which lets is use the id
import Link from "next/link";
import coffeeStoresData from "../../data/coffee-stores.json";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import ClassNames from "classnames";
import fetchCoffeeStores from "@/lib/fetch-coffee-stores";
import { useState, useContext, useEffect } from "react";
import { StoreContext } from "../../store/store-context.js";
import { fetcher, isEmpty } from "../../utils";
import useSWR from "swr";

export async function getStaticProps(staticProps) {
  // We pre-render this page
  const params = staticProps.params; // params contains the dynamic id of the page
  const data = await fetchCoffeeStores();
  const findCoffeeStoresById = data.find((coffeeStore) => {
    // Only the details of the coffee shop is req.
    return coffeeStore.id === params.store_id; //dynamic id
  });
  return {
    props: {
      coffeeStore: findCoffeeStoresById ? findCoffeeStoresById : {},
    },
  };
}

export async function getStaticPaths(props) {
  // Statically generates all the dynamic routes
  const data = await fetchCoffeeStores();
  const paths = data.map((coffeeStore) => {
    return {
      params: { store_id: coffeeStore.id },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  console.log(router.query);
  console.log("console props", initialProps);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  const id = router.query.store_id;

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, address, full_address, votes, imgUrl } = coffeeStore; // coffee store details already present in the context on client side rendering when the rotre changes
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          address: address || "",
          full_address: full_address || "",
          votes: 0,
          imgUrl,
        }),
      });

      const dbCoffeeStore = await response.json(); // just to print the content
      console.log("dbCoffeeStore", { dbCoffeeStore });
    } catch (error) {
      console.error("Error creating coffee store", error);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length) {
        // from the context
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          // Only the details of the coffee shop is req.
          return coffeeStore.id === id; //dynamic id
        });
        console.log("initial coffee store", { coffeeStoreFromContext });
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      // Static site generation
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);

  // const {name, address, neighbourhood, imgUrl} = props.coffeeStore
  const { name, address, full_address, imgUrl } = coffeeStore;

  const [voteCount, setVoteCount] = useState(0);

  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher); // from the airtable

  useEffect(() => {
    if (data && data.length > 0) {
      console.log("data from SWR :", { data });
      const coffeeDataFromDb = {
        address: data[0].address,
        full_address: data[0].full_address,

        ...data[0],
      };
      setCoffeeStore(coffeeDataFromDb);
      setVoteCount(data[0].votes);
    }
  }, [data]);

  const handleUpvoteButton = async () => {
    console.log("Handle upvote");

    try {
      const response = await fetch("/api/upvoteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json(); // just to print the content
      console.log("dbCoffeeStore", { dbCoffeeStore });
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = voteCount + 1;
        setVoteCount(count);
      }
    } catch (error) {
      console.error("Error upvoting the coffee store", error);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving the coffee store page</div>;
  }

  return (
    <main>
      <div className={styles.layout}>
        <Head>
          <title>{name}</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.backToHomeLink}>
              {/* <a href='/'>Back to Home</a> This refreshes the page */}
              <Link href="/" scroll={false}>
                ← Back to Home
              </Link>
            </div>
            <div className={styles.nameWrapper}>
              <h1 className={styles.name}>{name}</h1>
            </div>
            <Image
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
              }
              width={600}
              height={360}
              className={styles.storeImg}
              alt={name}
            />
          </div>
          <div className={ClassNames("glass", styles.col2)}>
            {address && (
              <div className={styles.iconWrapper}>
                <Image src="/static/icons/places.svg" height="24" width="24" />
                <p className={styles.text}>{address}</p>
              </div>
            )}
            {full_address && (
              <div className={styles.iconWrapper}>
                <Image src="/static/icons/nearMe.svg" height="24" width="24" />
                <p className={styles.text}>{full_address}</p>
              </div>
            )}
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/star.svg"
                width={24}
                height={24}
                alt="Star icon"
              />
              <p className={styles.text}>{voteCount}</p>
            </div>
            <button
              className={styles.upvoteButton}
              onClick={handleUpvoteButton}
            >
              Up Vote!
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CoffeeStore;
