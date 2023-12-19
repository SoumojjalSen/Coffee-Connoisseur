import React from 'react'
import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlforCoffeeStores = (latlong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`
}

const getCoffeeStorePhotos = async () => {
  const store_photos = await unsplash.search.getPhotos({
    query: 'coffee shops',
    page: 1,
    perPage: 30, //  Here number changed
  });
  
  console.log("store_photos:::", store_photos.response.results)
  const photoResults = store_photos.response.results;
  console.log("photoResults", photoResults)
  return photoResults.map(photo=>{
    // console.log("newwwww")
    // console.log(photo.urls["small"]);
    return photo.urls["small"]
  })
}

const fetchCoffeeStores = async (
  latLong="23.414604855180677,85.43906585242169", 
  limit=30) => {
  const photos = await getCoffeeStorePhotos();
  // const photos = [null, null, null, null, null, null]

  console.log("photos req :::", photos)
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
    }
  };

  const response = await fetch(getUrlforCoffeeStores(latLong, "coffee tea", limit), options)  // Here number cahnged
  
  const data = await response.json() // returns a promise
  console.log(data);
  return data.results.map((result, idx)=>{
    return {
      // ...result,
      id: result.fsq_id,
      name: result.name,
      address: result.location.address || "Currently not available",
      full_address: result.location.formatted_address || "Currently not available",
      imgUrl: photos[idx] || "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80",
    }
  });
}

export default fetchCoffeeStores
