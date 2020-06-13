# Req 3를 해보자

#### 튜토리얼

``` python
stores = dataframes["stores"]

    # 모든 카테고리를 1차원 리스트에 저장합니다
    # category column값을 람다식을 통해 split함수 실행
    categories = stores.category.apply(lambda c: c.split("|"))
    # itertools의 chain함수 즉 apppend와 같은 기능 
    # => categories의 값들을 list형식으로       모두 연결 
    categories = itertools.chain.from_iterable(categories)

    # 카테고리가 없는 경우 / 상위 카테고리를 추출합니다
    # filter 함수는 built-in 함수로 list 나 dictionary 같은 
    # iterable 한 데이터를 특정 조건에 일치하는 값만 추출해 낼때 사용하는 함수
    categories = filter(lambda c: c != "", categories)
    # collection 모듈의 Counter함수 는 key:value형태의 dictionary를 이용한 카운팅함수
    categories_count = Counter(list(categories))
    print(categories_count)
    # most_common을 head와 같은기능
    best_categories = categories_count.most_common(n=n)
    df = pd.DataFrame(best_categories, columns=["category", "count"]).sort_values(
        by=["count"], ascending=False
    )

    # 그래프로 나타냅니다
    chart = sns.barplot(x="category", y="count", data=df)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("음식점 카테고리 분포")
    plt.show()
```



#### Req. 1-3-1 전체 음식점의 리뷰 개수 분포를 그래프로 나타냅니다.

``` python
stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
)
    scores_group = stores_reviews.groupby(["store", "store_name"])
    # GroupByDataFrame을 DataFrame으로 Converting하는 코드
    df = d.DataFrame(scores_group.size().reset_index(name='count')).sort_values(
        by='count', axis=0, ascending=False).head(100)
    # 막대 그래프로 나타냅니다 x는 가로축 y는 세로축에 사용될 컬럼값
    chart = sns.barplot(x="store_name", y="count", data=df)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("음식점 리뷰 개수 분포")
    plt.show()
```

#### Req. 1-3-2 각 음식점의 평균 평점을 그래프로 나타냅니다.

``` python
stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    scores_group = stores_reviews.groupby(["store", "store_name"])
    scores = scores_group.mean().reset_index().head(100)
    # 막대 그래프로 나타냅니다 x는 가로축 y는 세로축에 사용될 컬럼값
    chart = sns.barplot(x="store_name", y="score", data=scores)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("음식점 평균 평점 분포")
    plt.show()
```

#### Req. 1-3-3 전체 유저의 리뷰 개수 분포를 그래프로 나타냅니다.

``` python
user = dataframes['users']
	# groupbydataframe을 dataframe 으로 converting하는 코드
    user = user.groupby(['id']).size().reset_index(name='count').head(n)
    # 막대 그래프로 나타냅니다 x는 가로축 y는 세로축에 사용될 컬럼값
    chart = sns.barplot(x="id", y="count", data=user)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("유저의 리뷰 개수 분포")
    plt.show()
```

#### Req. 1-3-4 전체 유저의 성별/나이대 분포를 그래프로 나타냅니다.

``` python
user = dataframes['users'].head(n)
    # 라인 그래프로 나타냅니다 x축은 유저의 기준인 id y축은 나이 hue는 나누어줄 값 성별
    chart = sns.lineplot(x="id", y="age", hue="gender", data=user)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("유저의 성별/나이대 분포")
    plt.show()
```

#### Req. 1-3-5 각 음식점의 위치 분포를 지도에 나타냅니다.

- 발생한 오류 
  - `float64 of type <class 'pandas.core.series.Series'> is not convertible to float.`
  - Culumn값 latitude,longitude로 받은 Series 클래스를 location에 적용하려 할때
    Series값들이 여러개 여서 for으로 해결해야 했다.

``` python
stores = dataframes['stores']
	# 제주도지역의 음식점을 표기
    address = stores[stores['address'].str.contains(
        "제주도") == True].head(n).reset_index()
    map_stores = folium.Map(
        location=[33.424908, 126.409386], zoom_start=10)

    for i, store in address.iterrows():
        # 지도 위치에 원으로 표시하는 코드
        folium.Circle(location=[store.latitude, store.longitude],
                      radius=50, color='#000000', fill='crimson').add_to(map_stores)

    map_stores.save('map.html')
```

