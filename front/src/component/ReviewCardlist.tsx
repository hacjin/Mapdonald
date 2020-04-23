import React from 'react';
import ReviewCard from './ReviewCard';
import Review from '../interface/Review'

interface Props {
  reviews : Array<Review>
}

export default function ReviewCardlist(props : Props){
  const {reviews} = props
  console.log(reviews)
  return(
    <div>
      {reviews.map(review => <ReviewCard review={review}/>)}
    </div>
  )
}