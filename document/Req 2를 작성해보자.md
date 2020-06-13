# Req 2를 작성해보자
``` python
# 공통코드
stores_reviews = pd.merge(
    dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
)
scores_group = stores_reviews.groupby(["store", "store_name"])
scores = scores_group.mean()
# 데이터 포맷을 맞추기 위한 코드
pd.options.display.float_format = '{:.1f}'.format
```
#### Req. 1-2-1 각 음식점의 평균 평점을 계산하여 높은 평점의 음식점 순으로 `n`개의 음식점을 정렬하여 리턴합니다

``` python
# sort_values 함수를 통해 기준이 될 'score', ascending = False는 내림차순, axis 는 어떤 축을 기준으로 삼을지 정하는 default 0으로 세로, 주로 세로를 많이 삼는다

sort_scores = scores.sort_values(by=['score'], axis=0, ascending=False)
```

#### Req. 1-2-2 리뷰 개수가 `min_reviews` 미만인 음식점은 제외합니다. 

``` python
# agg 는 그룹함수 지정 함수
# score index 열을 mean함수와 size함수를 적용한 index를 일반 데이터로 만들어주고 score와 cnt로 rename
reviews_count = scores_group.agg({'score': ['mean', 'size']})
    reviews_count.columns = ['score', 'cnt']
    reviews_count.reset_index()
    gt_min_reviews_count = reviews_count[reviews_count['cnt']
                                         >= min_reviews].sort_values(by=['score'], axis=0, ascending=False)
```

#### Req. 1-2-3 가장 많은 리뷰를 받은 `n`개의 음식점을 정렬하여 리턴합니다

``` python
stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    scores_group = stores_reviews.groupby(["store", "store_name"])
    review_counts = scores_group.size().reset_index(name='cnt')
    result = review_counts.sort_values(by=['cnt'], axis=0, ascending=False)

    return result.head(n=n).reset_index()
```

#### Req. 1-2-4 가장 많은 리뷰를 작성한 `n`명의 유저를 정렬하여 리턴합니다.

``` python
users_reviews = dataframes["users"]
    users_group = users_reviews.groupby(["id"])
    users_review_cnt = users_group.size().reset_index(name='cnt')
    result = users_review_cnt.sort_values(
        by='cnt', axis=0, ascending=False)

    return result.head(n=n).reset_index()
```



``` python
# merge( left , right , how = 'inner' , on = None , left_on = None , right_on = None , left_index = False , right_index = False , sort = False , suffixes = ( '_ x' , '_y') , copy = True , indicator = False , validate = None )

# merge : join과 같은 기능의 함수
# left : 기준 DataFrame // right : 병합 할 DataFrame
# how : join의 방식 기존은 inner 조인, inner, outer, left, right 가능
# left_on , right_on : 키가 되는 기준 열이 이름이 같을 경우 on을 사용 양쪽의 데이터가 같으나 열의 이름이 다를 경우 left_on과 right_on으로 명시를 해준다.
# left_index, right_index : 일반 데이터 열이 아닌 인덱스를 기준열로 사용할 시 True
```

참고 : [merge](https://datascienceschool.net/view-notebook/7002e92653434bc88c8c026c3449d27b/) // [sort_values](https://twinstarinfo.blogspot.com/2018/10/python-pandasdataframesortvalues.html) // [agg, groupby](https://datascienceschool.net/view-notebook/76dcd63bba2c4959af15bec41b197e7c/) // [index조작 : set_index, reset_index](https://datascienceschool.net/view-notebook/a49bde24674a46699639c1fa9bb7e213/)