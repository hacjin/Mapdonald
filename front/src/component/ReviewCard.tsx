import React from 'react';
import Review from '../interface/Review'


interface Props{
  review : Review
}

export default function ReviewCard(props : Props){
  const {review} = props
  return(
    <div>
      {review.reviewer}<br/>
      {review.text}<br/>
      {review.date}<br/>
    </div>
  )
}