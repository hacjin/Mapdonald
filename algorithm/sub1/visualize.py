import itertools
from collections import Counter
from parse import load_dataframes
import folium
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm


def set_config():
    # 폰트, 그래프 색상 설정
    font_list = fm.findSystemFonts(fontpaths=None, fontext="ttf")
    if any(["notosanscjk" in font.lower() for font in font_list]):
        plt.rcParams["font.family"] = "Noto Sans CJK JP"
    else:
        if not any(["malgun" in font.lower() for font in font_list]):
            raise Exception(
                "Font missing, please install Noto Sans CJK or Malgun Gothic. If you're using ubuntu, try `sudo apt install fonts-noto-cjk`"
            )

        plt.rcParams["font.family"] = "Malgun Gothic"

    sns.set_palette(sns.color_palette("Spectral"))
    plt.rc("xtick", labelsize=6)


def show_store_categories_graph(dataframes, n=100):
    """
    Tutorial: 전체 음식점의 상위 `n`개 카테고리 분포를 그래프로 나타냅니다.
    """

    stores = dataframes["stores"]

    # 모든 카테고리를 1차원 리스트에 저장합니다
    categories = stores.category.apply(lambda c: c.split("|"))
    categories = itertools.chain.from_iterable(categories)

    # 카테고리가 없는 경우 / 상위 카테고리를 추출합니다
    categories = filter(lambda c: c != "", categories)
    categories_count = Counter(list(categories))
    best_categories = categories_count.most_common(n=n)
    df = pd.DataFrame(best_categories, columns=["category", "count"]).sort_values(
        by=["count"], ascending=False
    )

    # 그래프로 나타냅니다
    chart = sns.barplot(x="category", y="count", data=df)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("음식점 카테고리 분포")
    plt.show()


def show_store_review_distribution_graph(dataframes, n=100):
    """
    Req. 1-3-1 전체 음식점의 리뷰 개수 분포를 그래프로 나타냅니다.
    """
    stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    scores_group = stores_reviews.groupby(["store", "store_name"])
    df = pd.DataFrame(scores_group.size().reset_index(name='count')).sort_values(
        by='count', axis=0, ascending=False).head(100)
    # 그래프로 나타냅니다
    chart = sns.barplot(x="store_name", y="count", data=df)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("음식점 리뷰 개수 분포")
    plt.show()


def show_store_average_ratings_graph(dataframes, n=100):
    """
    Req. 1-3-2 각 음식점의 평균 평점을 그래프로 나타냅니다.
    """
    stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    scores_group = stores_reviews.groupby(["store", "store_name"])
    scores = scores_group.mean().reset_index().head(100)
    # 그래프로 나타냅니다
    chart = sns.barplot(x="store_name", y="score", data=scores)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("음식점 평균 평점 분포")
    plt.show()


def show_user_review_distribution_graph(dataframes, n=100):
    """
    Req. 1-3-3 전체 유저의 리뷰 개수 분포를 그래프로 나타냅니다.
    """
    user = dataframes['users']
    user = user.groupby(['id']).size().reset_index(name='count').head(n)
    # 그래프로 나타냅니다
    chart = sns.barplot(x="id", y="count", data=user)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("유저의 리뷰 개수 분포")
    plt.show()


def show_user_age_gender_distribution_graph(dataframes, n=100):
    """
    Req. 1-3-4 전체 유저의 성별/나이대 분포를 그래프로 나타냅니다.
    """
    user = dataframes['users'].head(n)
    # 그래프로 나타냅니다
    chart = sns.lineplot(x="id", y="age", hue="gender", data=user)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("유저의 성별/나이대 분포")
    plt.show()


def show_stores_distribution_graph(dataframes, n=10):
    """
    Req. 1-3-5 각 음식점의 위치 분포를 지도에 나타냅니다.
    """
    stores = dataframes['stores']
    address = stores[stores['address'].str.contains(
        "제주도") == True].head(n).reset_index()
    map_stores = folium.Map(
        location=[33.424908, 126.409386], zoom_start=10)

    for i, store in address.iterrows():
        folium.Circle(location=[store.latitude, store.longitude],
                      radius=50, color='#000000', fill='crimson').add_to(map_stores)

    map_stores.save('map.html')


def main():
    set_config()
    data = load_dataframes()
    # show_store_categories_graph(data)
    # 3-1. 음식점 리뷰 개수 분포
    # show_store_review_distribution_graph(data)
    # 3-2. 음식점 평균 점수 분포
    # show_store_average_ratings_graph(data)
    # 3-3. 유저 리뷰 개수 분포
    # show_user_review_distribution_graph(data)
    # 3-4. 유저 성별/나이대별 분포
    show_user_age_gender_distribution_graph(data)
    # 3-5. 각 음식점의 위치 분포를 지도에 나타냅니다.
    # show_stores_distribution_graph(data)


if __name__ == "__main__":
    main()
