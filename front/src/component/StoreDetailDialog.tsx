import React,{useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import apis from '../apis/apis'
import Axios from 'axios';
export default function StoreDetailDialog(props : any) {
  const [store, setStore] = useState(null)
  useEffect(() => {
    getStoreAPI()
  })
  const open = props.open
  const setOpen = props.setOpen
  const storeId = props.store
  const dummy = [
    {
      name : "네네임0",
      number : "버언호0",
      image : "https://reactjsexample.com/content/images/2016/08/20160815212151.jpg",
      menu : [],
    },
    {
      name : "네네임1",
      number : "버언호1",
      image : "https://reactjsexample.com/content/images/2016/08/20160815212151.jpg",
      menu : [],
    },
    {
      name : "네네임2",
      number : "버언호2",
      image : "https://reactjsexample.com/content/images/2016/08/20160815212151.jpg",
      menu : [],
    },
  ]
  function handleClose(){
    setOpen(false)
  }
  
  async function getStoreAPI(){
    const response = await apis.get(`/stores/${storeId}`)
    console.log('response')
    console.log(response)
    console.log(response.status)
  }

  return (
    <div>
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">음식점 정보</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dummy[storeId].name}
          </DialogContentText>
          menu : {dummy[storeId].menu}
          number : {dummy[storeId].number}
          <img src={dummy[storeId].image} alt={"이이미지"}/>
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
