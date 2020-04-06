from parse import load_dataframes
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import shutil


def sort_stores_by_score(dataframes, n=20, min_reviews=30):

    pd.options.display.float_format = '{:.1f}'.format
    stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    scores_group = stores_reviews.groupby(
        ["store", "store_name"])
    scores = scores_group[['store', 'store_name', 'score', 'user']].head(
        n=n).set_index(['store', 'store_name'])
    # scores = scores_group.mean()
    # print(list(scores.columns))
    # print(scores.sort_values(by='user', axis=0, ascending=True))
    user_store_score = scores.pivot_table(
        index='store_name', columns='user', values='score')
    user_store_score.fillna(0, inplace=True)
    # print(user_store_score.loc['만수국', :])
    # simil = cosine_similarity(user_store_score)
    # print(list(simil))
    print(user_store_score)
    result = scores.head(n=n).reset_index()
    return result


def main():
    data = load_dataframes()

    term_w = shutil.get_terminal_size()[0] - 1
    separater = "-" * term_w

    stores_most_scored = sort_stores_by_score(data)

    print("[최고 평점 음식점]")
    print(f"{separater}\n")
    for i, store in stores_most_scored.iterrows():
        print(
            "{rank}위: {store}({score}점)".format(
                rank=i + 1, store=store.store_name, score=store.score
            )
        )
    print(f"\n{separater}\n\n")


if __name__ == "__main__":
    main()
