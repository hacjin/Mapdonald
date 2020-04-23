/*global kakao*/
import React, {useEffect, useState} from 'react';
import FormDialog from './FormDialog';
import StoreDetailDialog from './StoreDetailDialog';
import Store from '../interface/Store';
import apis from '../apis/apis';
declare global {
    // kakao 변수가 스크립트 파일로 인하여 window 변수 안에 할당되는데, 타입스크립트 특성상 미리 타입에 대하여 선언을 해줘야 함
    interface Window {  
        kakao: any;
    }
}

// 디폴트 역삼역
const DEFAULT_LATITUDE =  37.501392
const DEFAULT_LONGITUDE =  127.039648
const kakao = window.kakao
const wardImage = '/ward.png'
const imageSize = new kakao.maps.Size(64,69)
const imageOption = {offset : new kakao.maps.Point(27,69)}
const markerImage = new kakao.maps.MarkerImage(wardImage, imageSize, imageOption)
let marker : any;
let map : any;
let watchId : number;
export default function KakaoMap(){
  const [detail, setDetail] = useState(false)
  const [store, setStore] = useState()
  const dummyStore = {
    id : 1,
    store_name : ",",
    branch : "zzz",
    area : "zzz",
    tel : "zzz",
    address : "zzz",
    latitude : 3,
    longitude : 4,
    category_list : ["zzz","zzz","zzz"],
  }

  async function getStoreAPI(){
    const response =  await apis.get(`/stores/1`)
    console.log(response)
    setStore(response.data)
  }

  useEffect(() => { 
    if(!map){  
      makeMap()
      // 현재 위치정보 권한 요청
      getCurrentPositionPermission()
    }
  })
  
  function detailMethod(){
    setDetail(true)
    getStoreAPI()
  }


  function retDetail(){
    if(store){
      return <StoreDetailDialog open={detail} setOpen={setDetail} store={store}/>
    }
  }
  function getCurrentPositionPermission(){    
    navigator.geolocation.getCurrentPosition(geoSuccess)
    getCurrentPosition()
  }

  function getCurrentPosition(){
    watchId = navigator.geolocation.watchPosition(geoSuccess)
  }

  function geoSuccess (position : any){
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    moveMap(latitude, longitude)
    
    if(marker){
      marker.setPosition(new kakao.maps.LatLng(latitude, longitude))
    }else{
      marker = new kakao.maps.Marker({
        position : new kakao.maps.LatLng(latitude, longitude),
        image : markerImage
      })
      marker.setMap(map)
    }
    navigator.geolocation.clearWatch(watchId)
  }

  // 처음 카카오맵을 생성
  function makeMap(){ 
    const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    const options = { //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE), //지도의 중심좌표.
      level: 3 //지도의 레벨(확대, 축소 정도)
    };
    map = new kakao.maps.Map(container, options);

    const mapTypeControl = new kakao.maps.MapTypeControl()   // 지도, 스카이뷰 컨트롤러
    const zoomControl = new kakao.maps.ZoomControl();    // 확대, 축소 컨트롤러
    
    // 컨트롤러 붙이기
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  }

  // 전달 받은 위도, 경도로 카카오맵을 이동시키는 함수
  function moveMap(latitude : number, longitude : number){ 
    const moveLocation = new window.kakao.maps.LatLng(latitude, longitude)
    map.panTo(moveLocation)
  }

  return(
    <div>
      <div id="map" style={{width:"800px", height:"400px"}}>
        <FormDialog/>
        <button style={{zIndex:3, top : "3px", left : "3px", position:"absolute"}} onClick={getCurrentPosition}> 현재 위치 </button>
        <button style={{zIndex:3, top : "50px",left : "10px", position:"absolute"}} onClick={detailMethod}> 디테일 </button>
        {retDetail()}
      </div>
    </div>
  )
}