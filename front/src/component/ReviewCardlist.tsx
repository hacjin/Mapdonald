import React, {useState, useEffect} from 'react';
import ReviewCard from './ReviewCard';
import Review from '../interface/Review'
import apis from '../apis/apis';

interface Props {
  storeId : number
}

export default function ReviewCardlist(props : Props){
  const {storeId} = props
  let key = 0
  const [reviews, setReviews] = useState([])
  useEffect(() => {
    getReviewsAPI(storeId, setReviews)
  })

  async function getReviewsAPI(storeId : number, setReviews : Function){
    const response = await apis.get(`/review?store=${storeId}`)
    setReviews(response.data.results)
  }

  return(
    <div>
      { reviews.length !== 0 ? 
      reviews.map(review => {
        key+= 1
        return <ReviewCard review={review} key={key} />
      })
      :
      null
      }
    </div>
  )
}