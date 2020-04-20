### URI구조

#### request

```json
{
    header : {},
    params : {}, //URL의 인자로 보내짐 ex) URI?[key]=[value]
    body : {},
    Authorization : {},
}
```

#### response

```json
{
    header : {},
    body : {}, //data or payload
}
```



## USER

```
GET
POST
PUT
DELETE
```



## LOCATION : 위치정보

```
GET -> location/
```

#### GET : /location/

- request

  ```json
  {
      header : {},
      body : {
          latitude : [required],
          longitude : [required],
          gender : '',
    		age : '',
          address : '',
          likes : '',
          dislikes : '',
      },
  }
  ```

  

- response

  ```json
  {
      spots : [
          {
            no : '',//jpk
            name: '',//가게명
            latitude : '',//위도
            longitude : '',//경도
            value : '',//지도에 표시될 추천도(유사도),
    		  distance : '',//나와의거리
          },
          ...
      ]
  }
  ```

  

