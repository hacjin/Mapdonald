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
  store : Store,
}

let map : any
export default function StoreDetailDialog(props : Props) {

  const { open, setOpen, store} = props
  const kakao = window.kakao
  let result = ''
  useEffect(() => {
    console.log('storedetaildialog - useEffect')
    console.log('document')
    console.log(document)
    const container = document.getElementById('storemap') //지도를 담을 영역의 DOM 레퍼런스
    console.log('useeffect container')
    console.log(container)
    return () => makeMap()
    // if(!map){  
    //   makeMap()
    //   // 현재 위치정보 권한 요청
    // }
  })
  function handleClose(){
    setOpen(false)
  }

  function makeMap() {
    console.log('makemap')
    const container = document.getElementById('storemap') //지도를 담을 영역의 DOM 레퍼런스
    console.log('makemap container')
    console.log(container)
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(store.latitude, store.longitude), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    }

    map = new kakao.maps.Map(container, options) //지도 객체 생성

    const mapTypeControl = new kakao.maps.MapTypeControl() // 지도, 스카이뷰 컨트롤러
    const zoomControl = new kakao.maps.ZoomControl() // 확대, 축소 컨트롤러

    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
      imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
      imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin: new kakao.maps.Point(0, 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      

    point = new kakao.maps.Marker({
      position: map.getCenter(),
      image: markerImage,
    })

    // 컨트롤러 붙이기
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT)
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)
    point.setMap(map)
  }

  const category_list = store.category.split(' ')
  return (
    <div>
      <Dialog  open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="store-dialog-title">{store.store_name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {store.area} | {category_list.map((element,i) => {
              result+=`${element}`
              if(i<category_list.length-1) result += `, `
              else if(i===category_list.length)return ( {result}) 
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
          <div id="storemap" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}></div>

          <ReviewCardlist storeId={store.id}/>
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