import React, { useEffect, FormEvent } from 'react'
import './map.css'

declare global {
  // kakao 변수가 스크립트 파일로 인하여 window 변수 안에 할당되는데, 타입스크립트 특성상 미리 타입에 대하여 선언을 해줘야 함
  interface Window {
    kakao: any
  }
}

var markers: any = []
let map: any
var ps: any
let infowindow: any
var keyword: any
function Address_List() {
  // 마커를 담을 배열입니다
  useEffect(() => {
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div
      mapOption = {
        center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      }

    // 지도를 생성합니다
    map = new window.kakao.maps.Map(mapContainer, mapOption)

    // 장소 검색 객체를 생성합니다
    ps = new window.kakao.maps.services.Places()

    // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
    infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 })
  }, [])

  // 키워드 검색을 요청하는 함수입니다
  function searchPlaces(e: FormEvent) {
    e.preventDefault()
    keyword = (document.getElementById('keyword') as HTMLInputElement).value

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
      alert('키워드를 입력해주세요!')
      return false
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword, placesSearchCB)
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
      var placePosition: HTMLElement = new window.kakao.maps.LatLng(places[i].y, places[i].x),
        marker: any = addMarker(placePosition, i),
        itemEl: HTMLElement | null = getListItem(i, places[i]) // 검색 결과 항목 Element를 생성합니다
      let title: string = places[i].place_name
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      bounds.extend(placePosition)
      // 마커와 검색결과 항목에 mouseover 했을때
      // 해당 장소에 인포윈도우에 장소명을 표시합니다
      // mouseout 했을 때는 인포윈도우를 닫습니다

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
      }

      fragment.appendChild(itemEl)
    }

    // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
    if (listEl !== null) listEl.appendChild(fragment)
    if (menuEl !== null) menuEl.scrollTop = 0

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds)
  }

  // 검색결과 항목을 Element로 반환하는 함수입니다
  function getListItem(index: number, places: any) {
    var el = document.createElement('li'),
      itemStr = '<span className="markerbg marker_' + (index + 1) + '"></span>' + '<div className="info">' + '   <h5>' + places.place_name + '</h5>'

    if (places.road_address_name) {
      itemStr += '    <span>' + places.road_address_name + '</span>' + '   <span className="jibun gray">' + places.address_name + '</span>'
    } else {
      itemStr += '    <span>' + places.address_name + '</span>'
    }

    itemStr += '  <span className="tel">' + places.phone + '</span>' + '</div>'

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
  return (
    <div className="map_wrap">
      <div id="map" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}></div>
      <div id="menu_wrap" className="bg_white">
        <div className="option">

          <div>
            <form onSubmit={searchPlaces}  className="m-key-div">
              키워드 : <input type="text" id="keyword" style={{ fontSize: 15 }} />
              <button type="submit">검색하기</button>
            </form>
          </div>
        </div>
        <hr />
        <ul id="placesList"></ul>
        <div id="pagination"></div>
      </div>
    </div>
  )
}

export default Address_List
