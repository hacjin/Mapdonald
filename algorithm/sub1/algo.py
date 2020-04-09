from parse import load_dataframes
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import shutil
from sklearn.decomposition import TruncatedSVD
from scipy.sparse.linalg import svds

import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import warnings
warnings.filterwarnings("ignore")


def sort_stores_by_score(dataframes, n=20, min_reviews=30):

    pd.options.display.float_format = '{:.1f}'.format
    stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    scores_group = stores_reviews.groupby(
        ["store", "store_name"])
    scores = scores_group[['store', 'store_name', 'score', 'user']].head(
        n=n).set_index(['store', 'store_name'])
    user_store_score = scores.pivot_table(
        index='store_name', columns='user', values='score')
    user_store_score.fillna(0, inplace=True)
    simil = cosine_similarity(user_store_score)
    simil = pd.DataFrame(
        data=simil, index=user_store_score.index, columns=user_store_score.index)

    print(simil['만수국'].sort_values(ascending=False)[:6])
    result = scores.head(n=n).reset_index()
    return result


def user_store_recommand(dataframes, user_id, n=20):
    pd.options.display.float_format = '{:.1f}'.format
    df_store = dataframes["stores"]
    df_review = dataframes["reviews"]
    df_user_store_score = df_review.pivot_table(
        index="user", columns="store", values='score').fillna(0)

    matrix = df_user_store_score.as_matrix()
    user_score_mean = np.mean(matrix, axis=1)
    matrix_user_mean = matrix - user_score_mean.reshape(-1, 1)
    print(pd.DataFrame(matrix_user_mean, columns=df_user_store_score.columns).head())
    U, sigma, Vt = svds(matrix_user_mean, k=12)
    sigma = np.diag(sigma)
    svd_user_predicted_score = np.dot(
        np.dot(U, sigma), Vt) + user_score_mean.reshape(-1, 1)
    df_svd_preds = pd.DataFrame(
        svd_user_predicted_score, columns=df_user_store_score.columns)
    # print(df_svd_preds.head())
    already_rated, predictions = recommend_store(
        df_svd_preds, user_id, df_store, df_review)

    return already_rated, predictions


def recommend_store(df_svd_preds, user_id, ori_store_df, ori_review_df, num_recommendations=5):
    user_row_number = user_id-1
    sorted_user_predictions = df_svd_preds.iloc[user_row_number].sort_values(
        ascending=False)
    # print(sorted_user_predictions.head(10))
    user_data = ori_review_df[ori_review_df.user == user_id]
    # print(user_data.head(10))

    user_history = user_data.merge(
        ori_store_df, left_on='store', right_on='id').sort_values(['score'], ascending=False)
    # print(user_history.head(10))
    recommendations = ori_store_df[~ori_store_df['id'].isin(
        user_history['store'])]

    recommendations = recommendations.merge(pd.DataFrame(
        sorted_user_predictions).reset_index(), left_on='id', right_on='store')

    recommendations = recommendations.rename(columns={user_row_number: 'Predictions'}).sort_values(
        'Predictions', ascending=False).iloc[:num_recommendations, :]

    return user_history, recommendations


def main():
    data = load_dataframes()

    term_w = shutil.get_terminal_size()[0] - 1
    separater = "-" * term_w

    # stores_most_scored = sort_stores_by_score(data)

    # print("[최고 평점 음식점]")
    # print(f"{separater}\n")
    # for i, store in stores_most_scored.iterrows():
    #     print(
    #         "{rank}위: {store}({score}점)".format(
    #             rank=i + 1, store=store.store_name, score=store.score
    #         )
    #     )
    # print(f"\n{separater}\n\n")

    already_rated, predictions = user_store_recommand(data, 7)
    print(already_rated.head(10))
    print(predictions.head(10))


if __name__ == "__main__":
    main()
