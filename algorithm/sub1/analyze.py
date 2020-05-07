from parse import load_dataframes
import pandas as pd
import shutil


def get_bhour_store(dataframes, n=20):
    """
        Req. 심화, 매주 매일 영업하는 음식점을 나타내라
        """
    stores_bhours = pd.merge(
        dataframes["stores"], dataframes["bhours"], left_on="id", right_on="store"
    )
    open_stores = stores_bhours[stores_bhours["type"] == 1]
    open_stores = open_stores[(open_stores.mon > 0) & (open_stores.tue > 0) & (open_stores.wed > 0) &
                              (open_stores.thu > 0) & (open_stores.fri > 0) & (open_stores.sat > 0) & (open_stores.sun > 0)]
    return open_stores.head(n=n)


def sort_stores_by_score(dataframes, n=20, min_reviews=30):
    """
    Req. 1-2-1 각 음식점의 평균 평점을 계산하여 높은 평점의 음식점 순으로 `n`개의 음식점을 정렬하여 리턴합니다
    Req. 1-2-2 리뷰 개수가 `min_reviews` 미만인 음식점은 제외합니다.
    """
    pd.options.display.float_format = '{:.1f}'.format
    stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    scores_group = stores_reviews.groupby(
        ["store", "store_name"])
    scores = scores_group.agg({'score': 'mean'})
    # scores = scores_group.mean()
    print(list(scores.columns))

    # scores.drop('branch', axis=1, inplace=True)
    # scores.drop('area', axis=1, inplace=True)
    # scores.drop('tel', axis=1, inplace=True)
    # scores.drop('reg_time', axis=1, inplace=True)
    # print(scores.head(n=n))
    # 2-1 높은 평점의 음식점 순으로 `n`개의 음식점 출력
    sort_scores = scores.sort_values(by=['score'], axis=0, ascending=False)
    # print("2-1 높은 평점의 음식점 순", sort_scores.iloc[:, [3]])

    # 2-2 리뷰 개수가 `min_reviews`이상 출력하기
    reviews_count = scores_group.agg({'score': ['mean', 'size']})
    reviews_count.columns = ['score', 'cnt']
    reviews_count.reset_index()
    gt_min_reviews_count = reviews_count[reviews_count['cnt']
                                         >= min_reviews].sort_values(by=['score'], axis=0, ascending=False)
    # print("2-2 리뷰 개수가 `min_reviews`이상 출력", gt_min_reviews_count)
    result = [scores.head(n=n).reset_index(), sort_scores.head(
        n=n).reset_index(), gt_min_reviews_count.head(n=n).reset_index()]
    return result


def get_most_reviewed_stores(dataframes, n=20):
    """
    Req. 1-2-3 가장 많은 리뷰를 받은 `n`개의 음식점을 정렬하여 리턴합니다
    """
    stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    scores_group = stores_reviews.groupby(["store", "store_name"])
    review_counts = scores_group.size().reset_index(name='cnt')
    result = review_counts.sort_values(by=['cnt'], axis=0, ascending=False)

    return result.head(n=n).reset_index()


def get_most_active_users(dataframes, n=20):
    """
    Req. 1-2-4 가장 많은 리뷰를 작성한 `n`명의 유저를 정렬하여 리턴합니다.
    """
    users_reviews = dataframes["users"]
    users_group = users_reviews.groupby(["id"])
    users_review_cnt = users_group.size().reset_index(name='cnt')
    result = users_review_cnt.sort_values(
        by='cnt', axis=0, ascending=False)

    return result.head(n=n).reset_index()


def main():
    data = load_dataframes()

    term_w = shutil.get_terminal_size()[0] - 1
    separater = "-" * term_w

    stores_most_scored = sort_stores_by_score(data)

    print("[최고 평점 음식점]")
    print(f"{separater}\n")
    for i, store in stores_most_scored[0].iterrows():
        print(
            "{rank}위: {store}({score}점)".format(
                rank=i + 1, store=store.store_name, score=store.score
            )
        )
    print(f"\n{separater}\n\n")

    # print("[2-1. 높은 평점 순 음식점]")
    # print(f"{separater}\n")
    # for i, store in stores_most_scored[1].iterrows():
    #     print(
    #         "{rank}위: {store}({score}점)".format(
    #             rank=i + 1, store=store.store_name, score=store.score
    #         )
    #     )
    # print(f"\n{separater}\n\n")

    # print("[2-2. 리뷰 개수 30개 이상의 높은 평점 순 음식점]")
    # print(f"{separater}\n")
    # for i, store in stores_most_scored[2].iterrows():
    #     print(
    #         "{rank}위: {store}({score}점), {count}개".format(
    #             rank=i + 1, store=store.store_name, score=store.score, count=store.cnt
    #         )
    #     )
    # print(f"\n{separater}\n\n")

    # stores_most_review = get_most_reviewed_stores(data)
    # # 함수의 이름과 겹치지 않게 index이름을 정할 것
    # print("[2-3. 가장 많은 리뷰 받은 음식점]")
    # print(f"{separater}\n")
    # for i, store in stores_most_review.iterrows():
    #     print(
    #         "{rank}위: {store}({count}개)".format(
    #             rank=i + 1, store=store.store_name, count=store.cnt
    #         )
    #     )
    # print(f"\n{separater}\n\n")

    # users_most_review = get_most_active_users(data)
    # print("[2-4. 가장 많은 리뷰 작성한 유저]")
    # print(f"{separater}\n")
    # for i, user in users_most_review.iterrows():
    #     print(
    #         "{rank}위: ID = {user}({count}개)".format(
    #             rank=i + 1, user=user.id, count=user.cnt
    #         )
    #     )
    # print(f"\n{separater}\n\n")

    # daily_open_store = get_bhour_store(data)
    # print("[심화. 매주 매일 영업하는 음식점]")
    # print(f"{separater}\n")
    # for i, store in daily_open_store.iterrows():
    #     print(
    #         "{area} : {store} ({start}~{end}까지)".format(
    #             area=store.area, store=store.store_name, start=store.start_time, end=store.end_time
    #         )
    #     )
    # print(f"\n{separater}\n\n")


if __name__ == "__main__":
    main()
