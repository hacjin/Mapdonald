import React,{useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import apis from '../apis/apis'
import ReviewCardlist from './ReviewCardlist';
import Review from '../interface/Review';
import Store from '../interface/Store';
import './List.css'

interface Props {
  open : boolean,
  setOpen : Function,
  store : Store
}

export default function StoreDetailDialog(props : Props) {
  const { open, setOpen, store} = props
  let result = ''
  function handleClose(){
    setOpen(false)
  }
  return (
    <div>
      <Dialog  open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="store-dialog-title">{store.store_name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {store.area} | {store.category_list.map((element,i) => {
              result+=`${element}`
              if(i<store.category_list.length-1) result += `, `
              else if(i===store.category_list.length)return ( {result}) 
            })} <span id="store-category">{result}</span>
          </DialogContentText>
          {store ?
            <div className="store-info">
              <li className="locat">{store.address}</li>
              <li className="tel">{store.tel}</li>
              {/* <p>latitude : {store.latitude}</p>
              <p>longitude : {store.longitude}</p> */}
            </div>
            : null
          }
          <br/>
          <ReviewCardlist storeId={145030}/>
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
