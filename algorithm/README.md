## 협업 필터링 알고리즘

> 참고: [https://kutar37.tistory.com/entry/%ED%8C%8C%EC%9D%B4%EC%8D%AC-%ED%98%91%EC%97%85%ED%95%84%ED%84%B0%EB%A7%81Collaborative-Filtering-%EC%B6%94%EC%B2%9C-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-1](https://kutar37.tistory.com/entry/파이썬-협업필터링Collaborative-Filtering-추천-알고리즘-1)
>
> 참고 : https://lsjsj92.tistory.com/568

``` python
def sort_stores_by_score(dataframes, n=20, min_reviews=30):

    # 출력되는 float 포맷형식
    pd.options.display.float_format = '{:.1f}'.format
    
    # 음식점 data와 리뷰 data 머지
    stores_reviews = pd.merge(dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    
    # groupby를 하고 나면 dataframegroupby 타입이 된다.
    scores_group = stores_reviews.groupby(["store","store_name"])    
    
    # dataframegroupby => dataframe으로 타입 변환을 위해 필요한 
	# columns을 뽑아내는 부분
    scores = scores_group[['store', 'store_name','score','user']].head(
        n=n).set_index(['store', 'store_name'])
    
    # 필요한 columns이 제대로 뽑혔는지 확인하는 출력문
    # print(list(scores.columns))
    
    # 필요한 columns으로 만든 데이터로 유사도를 구하기 위한 pivot_table작성
    user_store_score = scores.pivot_table(index='store_name', columns='user', values='score')
    
    # 리뷰 점수가 해당되지 않는 부분은 nan => 0으로 대체
    user_store_score.fillna(0, inplace=True)
    
    # print(user_store_score.loc['만수국', :])
    
    # 코사인 유사도 구하는 메서드
    # simil = cosine_similarity(user_store_score)
    # print(list(simil))
    print(user_store_score)
    result = scores.head(n=n).reset_index()
    return result
```

