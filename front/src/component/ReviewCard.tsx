import React from 'react';
import Review from '../interface/Review'


interface Props{
  review : Review
}

export default function ReviewCard(props : Props){
  const {review} = props
  return(
    <div>
      {review.rid}<br/>
      {review.store}<br/>
      {review.score}<br/>
      {review.content}<br/>
      {review.reg_time}<br/>
    </div>
  )
}