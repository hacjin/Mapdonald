import React,{useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import apis from '../apis/apis'
import ReviewGroup from './ReviewCardlist';
import Review from '../interface/Review';
import Store from '../interface/Store';

interface Props {
  open : boolean,
  setOpen : Function,
  store : Store
}

export default function StoreDetailDialog(props : Props) {
  const { open, setOpen, store} = props
  let dummyReviews : Array<Review>
  dummyReviews = [
    {
      date : "aa",
      reviewer : "reviewer",
      text : "text",
    },
    {
      date : "aa",
      reviewer : "reviewer",
      text : "text",
    },
    {
      date : "aa",
      reviewer : "reviewer",
      text : "text",
    },
  ]
  function handleClose(){
    setOpen(false)
  }
  return (
    <div>
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">음식점 정보</DialogTitle>
        <DialogContent>
          <DialogContentText>
            음식점 이름
          </DialogContentText>
          {/* <img src={dummy[storeId].image} alt={"이미지"}/> */}
          {store ?
            <div>
              id : {store.id}<br/>
              store_name : {store.store_name}<br/>
              branch : {store.branch}<br/>
              area : {store.area}<br/>
              tel : {store.tel}<br/>
              address : {store.address}<br/>
              latitude : {store.latitude}<br/>
              longitude : {store.longitude}<br/>
              category_list : {store.category_list}
            </div>
            : null
          }
          <br/>
          review=====================
          {/* <ReviewGroup reviews={dummyReviews}/> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
