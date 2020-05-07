/*global kakao*/
import React, { useEffect, FormEvent, useState } from 'react'
import apis from '../apis/apis'
import Store from '../interface/Store'
import StoreDetailDialog from './StoreDetailDialog'
import './map.css'
import Nav from './Nav'
import FormDialog from './FormDialog'

declare global {
  // kakao 변수가 스크립트 파일로 인하여 window 변수 안에 할당되는데, 타입스크립트 특성상 미리 타입에 대하여 선언을 해줘야 함
  interface Window {
    kakao: any
  }
}

// 디폴트 역삼역
<<<<<<< HEAD
const DEFAULT_LATITUDE = 37.501392
const DEFAULT_LONGITUDE = 127.039648

let map: any
var ps: any
let infowindow: any
let point: any // 내 위치
export default function KakaoMap() {
  console.log('kakaoMap')
  let watchId: number
  var markers: Array<any> = []
  const [detail, setDetail] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [version, setVersion] = useState(true) // true : 지역 선택, false : store 선택
  const [store, setStore] = useState<Store>() 
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [gender, setGender] = useState(1)
  const [age, setAge] = useState(20)
  const [like, setLike] = useState('')
  const kakao = window.kakao
  useEffect(() => {
    console.log('useEffect')
    if(!map){  
      makeMap()
      // 현재 위치정보 권한 요청
      getCurrentPositionPermission()
    }
  })
  // watchposition 함수를 이용해 위치 정보 갱신 - 클릭 이벤트 https://unikys.tistory.com/375


  function getCurrentPositionPermission(){    
    navigator.geolocation.getCurrentPosition(geoSuccess)
    getCurrentPosition()
  }

  function getCurrentPosition(){
    watchId = navigator.geolocation.watchPosition(geoSuccess)
  }
  // 현재 위치 정보 권한에 동의 받았을 때
  function geoSuccess(position: any) {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    setLatitude(latitude)
    setLongitude(longitude)
    moveMap(latitude, longitude)
    
    if(point){
      point.setPosition(new kakao.maps.LatLng(latitude, longitude))
    }else{
      point = new kakao.maps.Marker({
        position : new kakao.maps.LatLng(latitude, longitude),
        image : point
      })
      point.setMap(map)
=======
const DEFAULT_LATITUDE =  37.501392
const DEFAULT_LONGITUDE =  127.039648

export default function KakaoMap(){

    let map : any;
    const kakao = window.kakao
    useEffect(() => { 
      makeMap()
      // 현재 위치정보 권한 요청
      navigator.geolocation.getCurrentPosition(geoSuccess)
    })

    // 현재 위치 정보 권한에 동의 받았을 때
    function geoSuccess (position : any){
        const latitude = position.coords.latitude 
        const longitude = position.coords.longitude 
        
        moveMap(latitude, longitude)
>>>>>>> 8fff11047f5218f2548bc32abacbb7987811d9c5
    }
    navigator.geolocation.clearWatch(watchId)
  }

  // 처음 카카오맵을 생성
  function makeMap() {
    const container = document.getElementById('map') //지도를 담을 영역의 DOM 레퍼런스
    console.log('document')
    console.log(document)
    console.log('kakaommap - makemap - container')
    console.log(container)
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    }

    map = new kakao.maps.Map(container, options) //지도 객체 생성
    // 장소 검색 객체를 생성합니다
    ps = new window.kakao.maps.services.Places()

    // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
    infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 })

    const mapTypeControl = new kakao.maps.MapTypeControl() // 지도, 스카이뷰 컨트롤러
    const zoomControl = new kakao.maps.ZoomControl() // 확대, 축소 컨트롤러

    const wardImage = '/ward.png'

    const imageSize = new kakao.maps.Size(64, 69)
    const imageOption = { offset: new kakao.maps.Point(27, 69) }

    const markerImage = new kakao.maps.MarkerImage(wardImage, imageSize, imageOption)

    point = new kakao.maps.Marker({
      position: map.getCenter(),
      image: markerImage,
    })

    // 컨트롤러 붙이기
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT)
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)
    point.setMap(map)
  }

  // 전달 받은 위도, 경도로 카카오맵을 이동시키는 함수
  function moveMap(latitude: number, longitude: number) {
    const moveLocation = new window.kakao.maps.LatLng(latitude, longitude)

    point.setPosition(moveLocation)
    map.panTo(moveLocation)
  }
  // 키워드 검색을 요청하는 함수입니다
  function searchPlaces(e: FormEvent) {
    e.preventDefault()
    console.log('searchPlace version ' + version)
    if (!keyword.replace(/^\s+|\s+$/g, '')) {
      alert('키워드를 입력해주세요!')
      return false
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    console.log('version : ' + version)
    ps.keywordSearch(keyword, placesSearchCB)
  }

  async function getStoreAPI(displayStores : Function){
    console.log('getStoreAPI')
    const result = await apis.post(`/user`,{
      gender : gender,
      age : age,
      likeFood : like,
      latitude : latitude,
      longitude : longitude
    })

    console.log('==============================stores')
    const stores = result.data
    console.log(stores.length)
    console.log(stores)
    displayStores(stores)
  }

  // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
  function placesSearchCB(data: any, status: any, pagination: any) {
    if (status === window.kakao.maps.services.Status.OK) {
      // 정상적으로 검색이 완료됐으면
      // 검색 목록과 마커를 표출합니다
      
      displayPlaces(data)

      // 페이지 번호를 표출합니다
      displayPagination(pagination)
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다.')
      return
    } else if (status === window.kakao.maps.services.Status.ERROR) {
      alert('검색 결과 중 오류가 발생했습니다.')
      return
    }
  }

  // 검색 결과 목록과 마커를 표출하는 함수입니다
  function displayPlaces(places: any) {
    var listEl: HTMLElement | null = document.getElementById('placesList'),
      menuEl: HTMLElement | null = document.getElementById('menu_wrap'),
      fragment = document.createDocumentFragment(),
      bounds = new window.kakao.maps.LatLngBounds(),
      listStr = ''

    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl)

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker()

    for (var i = 0; i < places.length; i++) {
      // 마커를 생성하고 지도에 표시합니다
      let placePosition: HTMLElement = new window.kakao.maps.LatLng(places[i].y, places[i].x)
      let marker: any = addMarker(placePosition, i)
      let itemEl: HTMLElement | null = getListItem(i, places[i]) // 검색 결과 항목 Element를 생성합니다
      let title: string = places[i].place_name
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      bounds.extend(placePosition) // 마커와 검색결과 항목에 mouseover 했을때
      // 해당 장소에 인포윈도우에 장소명을 표시합니다
      // mouseout 했을 때는 인포윈도우를 닫습니다
      ;(function (y: any, x: any, marker: any, title: any) {
        window.kakao.maps.event.addListener(marker, 'click', function () {
          console.log('클릭')
          console.log(y, x)
        })
        window.kakao.maps.event.addListener(marker, 'mouseover', function () {
          displayInfowindow(marker, title)
        })

        window.kakao.maps.event.addListener(marker, 'mouseout', function () {
          infowindow.close()
        })
        if (itemEl !== null) {
          itemEl.onmouseover = function () {
            displayInfowindow(marker, title)
          }

          itemEl.onmouseout = function () {
            infowindow.close()
          }
          itemEl.onclick = function () {
            console.log(y, x)
            moveMap(y,x)
            console.log('version 이 false됨')
            setVersion(false)
            infowindow.close()
            // 검색 결과 목록에 추가된 항목들을 제거합니다
            removeAllChildNods(listEl)
        
            // 지도에 표시되고 있는 마커를 제거합니다
            removeMarker()
            getStoreAPI(displayStores)
          }
        }
      })(places[i].y, places[i].x, marker, places[i].place_name)
      fragment.appendChild(itemEl)
    }

    // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
    if (listEl !== null) listEl.appendChild(fragment)
    if (menuEl !== null) menuEl.scrollTop = 0

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds)
  }
  // 검색 결과 목록과 마커를 표출하는 함수입니다
  function displayStores(stores: any) {
    console.log('displayStores')
    console.log(stores)
    var listEl: HTMLElement | null = document.getElementById('placesList'),
      menuEl: HTMLElement | null = document.getElementById('menu_wrap'),
      fragment = document.createDocumentFragment(),
      bounds = new window.kakao.maps.LatLngBounds(),
      listStr = ''

    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl)

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker()

    for (var i = 0; i < stores.length; i++) {
      // 마커를 생성하고 지도에 표시합니다
      let placePosition: HTMLElement = new window.kakao.maps.LatLng(stores[i].latitude, stores[i].longitude)
      let marker: any = addMarker(placePosition, i)
      let itemEl: HTMLElement | null = getStoreItem(i, stores[i]) // 검색 결과 항목 Element를 생성합니다
      let title: String = stores[i].store_name
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      bounds.extend(placePosition) // 마커와 검색결과 항목에 mouseover 했을때
      // 해당 장소에 인포윈도우에 장소명을 표시합니다
      // mouseout 했을 때는 인포윈도우를 닫습니다
      ;(function (store : Store, marker : any) {
        const latitude = store.latitude
        const longitude = store.longitude
        const title = store.store_name
        console.log('latitude : ' + latitude  + '  longitude : ' + longitude)
        window.kakao.maps.event.addListener(marker, 'click', function () {
          console.log('클릭')
          console.log(latitude, longitude)
        })
        window.kakao.maps.event.addListener(marker, 'mouseover', function () {
          displayInfowindow(marker, title)
        })

        window.kakao.maps.event.addListener(marker, 'mouseout', function () {
          infowindow.close()
        })
        if (itemEl !== null) {
          itemEl.onmouseover = function () {
            displayInfowindow(marker, title)
          }

          itemEl.onmouseout = function () {
            infowindow.close()
          }
          itemEl.onclick = function () {
            console.log(latitude, longitude)
            console.log('스토어클릭')
            console.log(store)
            detailMethod(store)
          }
        }
      })(stores[i], marker)
      fragment.appendChild(itemEl)
    }

    // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
    if (listEl !== null) listEl.appendChild(fragment)
    if (menuEl !== null) menuEl.scrollTop = 0

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    console.log('bounds')
    console.log(bounds)
    map.setBounds(bounds)
  }

  function detailMethod(store : Store){
    setDetail(true)
    setStore(store)
  }

  // 검색결과 항목을 Element로 반환하는 함수입니다
  function getListItem(index: number, places: any) {
    var el = document.createElement('li'),
      itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' + '<div class="info">' + '   <h5>' + places.place_name + '</h5>'

    if (places.road_address_name) {
      itemStr += '    <span>' + places.road_address_name + '</span>'
    } else {
      itemStr += '    <span>' + places.address_name + '</span>'
    }

    if(places.phone){
      itemStr += '  <span class="tel">' + places.phone + '</span>' + '</div>'
    }
    el.innerHTML = itemStr
    el.className = 'item'

    return el
  }

  function getStoreItem(index: number, store: Store) {
    var el = document.createElement('li'),
      itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' + '<div class="info">' + '   <h5>' + store.store_name + '</h5>'

    if (store.address) {
      itemStr += '    <span>' + store.address + '</span>' + '   <span class="jibun gray">' + store.address + '</span>'
    } else {
      itemStr += '    <span>' + store.address + '</span>'
    }

    itemStr += '  <span class="tel">' + store.tel + '</span>' + '</div>'

    el.innerHTML = itemStr
    el.className = 'item'

    return el
  }
  // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
  function addMarker(position: any, idx: any) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
      imageSize = new window.kakao.maps.Size(36, 37), // 마커 이미지의 크기
      imgOptions = {
        spriteSize: new window.kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin: new window.kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new window.kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      marker = new window.kakao.maps.Marker({
        position: position, // 마커의 위치
        image: markerImage,
      })

    marker.setMap(map) // 지도 위에 마커를 표출합니다
    markers.push(marker) // 배열에 생성된 마커를 추가합니다

    return marker
  }

  // 지도 위에 표시되고 있는 마커를 모두 제거합니다
  function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null)
    }
    markers = []
  }

  // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
  function displayPagination(pagination: any) {
    var paginationEl: HTMLElement | null = document.getElementById('pagination'),
      fragment = document.createDocumentFragment(),
      i

    // 기존에 추가된 페이지번호를 삭제합니다
    if (paginationEl === null) return
    while (paginationEl.hasChildNodes()) {
      if (paginationEl.lastChild !== null) paginationEl.removeChild(paginationEl.lastChild)
    }

    for (i = 1; i <= pagination.last; i++) {
      var el = document.createElement('a')
      el.href = '#'
      el.innerHTML = i + ''

      if (i === pagination.current) {
        el.className = 'on'
      } else {
        el.onclick = (function (i) {
          return function () {
            pagination.gotoPage(i)
          }
        })(i)
      }

      fragment.appendChild(el)
    }
    paginationEl.appendChild(fragment)
  }

  // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
  // 인포윈도우에 장소명을 표시합니다
  function displayInfowindow(marker: any, title: any) {
    var content = '<div style="padding:5px;z-index:1;">' + title + '</div>'

    infowindow.setContent(content)
    infowindow.open(map, marker)
  }

  // 검색결과 목록의 자식 Element를 제거하는 함수입니다
  function removeAllChildNods(el: any) {
    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild)
    }
  }

  function keywordChange(){
    setKeyword(
      (document.getElementById('keyword') as HTMLInputElement).value
    )
  }

  async function handleSubmit(gender : number, age : number, like : string){
    console.log('handlesubmit  ', gender, age, like, latitude, longitude)
    setAge(age)
    setGender(gender)
    setLike(like)
    // const response = await apis.post(`/user`,{
    //   latitude : latitude,
    //   longitude : longitude,
    //   age : age,
    //   likeFood : like,
    //   gender : gender
    // })
  }
  return (
    <div id="map_wraper">
      <div className="map_wrap">
        <Nav/>
        <div id="map" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
          <button id="location" onClick={getCurrentPosition}>
            내 주소로 찾기
          </button>
        </div>
        <FormDialog submit={handleSubmit}/>
        {version ?
          <div id="menu_wrap" className="bg_white">
            <div className="option">
              <b>찾고자 하는 주소를 입력해주세요</b>
              <div className="m-key-div">
                <form onSubmit={searchPlaces}>
                  <input className="gsc-input" 
                         type="text" 
                         id="keyword" 
                         size={15} 
                         onChange={keywordChange}
                         placeholder="검색할 단어"/>
                  <button className="gsc-search-button" type="submit">검색</button>
                </form>
              </div>
            </div>
            <div className="m-hr"/>
            <ul id="placesList"></ul>
            <div id="pagination"></div>
          </div>
          :
          <div id="menu_wrap" className="bg_white">
            <ul id="placesList"></ul>
            <div id="pagination"></div>
          </div>
        }
        {detail && store ? 
          <StoreDetailDialog open={detail} setOpen={setDetail} store={store}/> 
          :
          null
        }
      </div>
    </div>
  )
}
