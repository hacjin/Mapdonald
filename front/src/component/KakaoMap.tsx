/*global kakao*/
import React, {useEffect} from 'react';
declare global {
    // kakao 변수가 스크립트 파일로 인하여 window 변수 안에 할당되는데, 타입스크립트 특성상 미리 타입에 대하여 선언을 해줘야 함
    interface Window {  
        kakao: any;
    }
}

// 디폴트 역삼역
const DEFAULT_LATITUDE =  37.501392
const DEFAULT_LONGITUDE =  127.039648

export default function KakaoMap(){

    let map : any;
    const kakao = window.kakao
    useEffect(() => { 
        makeMap()
        // 현재 위치정보 권한 요청
        getCurrentPosition()
    }, [getCurrentPosition])
    
    function getCurrentPosition(){
      navigator.geolocation.getCurrentPosition(geoSuccess)
    }

    // 현재 위치 정보 권한에 동의 받았을 때
    function geoSuccess (position : any){
        const latitude = position.coords.latitude 
        const longitude = position.coords.longitude 
        
        moveMap(latitude, longitude)
    }

    // 처음 카카오맵을 생성
    function makeMap(){ 
        const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
        const options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE), //지도의 중심좌표.
            level: 3 //지도의 레벨(확대, 축소 정도)
        };
        
        map = new kakao.maps.Map(container, options); //지도 객체 생성

        const mapTypeControl = new kakao.maps.MapTypeControl()   // 지도, 스카이뷰 컨트롤러
        const zoomControl = new kakao.maps.ZoomControl();    // 확대, 축소 컨트롤러
        
        const wardImage = '/ward.png'

        const imageSize = new kakao.maps.Size(64,69)
        const imageOption = {offset : new kakao.maps.Point(27,69)}

        const markerImage = new kakao.maps.MarkerImage(wardImage, imageSize, imageOption)
        
        const marker = new kakao.maps.Marker({
            position : new kakao.maps.LatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
            image : markerImage
        })

        // 컨트롤러 붙이기
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
        marker.setMap(map)
    }

    // 전달 받은 위도, 경도로 카카오맵을 이동시키는 함수
    function moveMap(latitude : number, longitude : number){  
        const moveLocation = new window.kakao.maps.LatLng(latitude, longitude)
        map.panTo(moveLocation)
    }



    return(
        <div>
            <div id="map" style={{width:"500px", height:"400px"}}/>
        </div>
    )
}