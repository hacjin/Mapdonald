from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from parse import load_dataframes
import pandas as pd
from math import log
from haversine import haversine, Unit

data = load_dataframes()
docs = data['stores']['category']
vocab = list(set(w for doc in docs for w in doc.split()))
vocab.sort()
N = len(docs)  # 총 문서의 수

# print(data['stores']['menu'])
# print(docs)


def tf(t, d):
    return d.count(t)


def idf(t):
    df = 0
    for doc in docs:
        df += t in doc
    return log(N/(df + 1))


def tfidf(t, d):
    return tf(t, d) * idf(t)

# tf 테이블 확인하는 코드


def tf_dtm():
    result = []
    for i in range(N):
        result.append([])
        d = docs[i]
        for j in range(len(vocab)):
            t = vocab[j]
            result[-1].append(tf(t, d))

    tf_ = pd.DataFrame(result, columns=vocab)
    print(tf_)


def idf_dtm():
    result = []
    for j in range(len(vocab)):
        t = vocab[j]
        result.append(idf(t))

    idf_ = pd.DataFrame(result, index=vocab, columns=["IDF"])
    print(idf_)


def tfidf_dtm():
    result = []

    for i in range(N):
        result.append([])
        d = docs[i]
        for j in range(len(vocab)):
            t = vocab[j]

            result[-1].append(tfidf(t, d))

    tfidf_ = pd.DataFrame(result, columns=vocab)
    print('tfdif_체크')
    print(tfidf_)


def filtering(gender, age, x, y, like):
    user_df = data["users"]
    # 성별 기반 필터링
    gender_filtering = user_df[user_df["gender"] == gender]

    # 나이 기반 필터링
    age_val = int(age/10)*10
    age_filtering = gender_filtering[(gender_filtering["age"] >= age_val)]
    age_filtering = age_filtering[age_filtering["age"] < age_val+10]

    # 위치 기반 필터링을 위한 데이터프레임 정제
    filtering_df = pd.merge(
        data["stores"], age_filtering, how='inner', left_on='id', right_on='store')
    filtering_df = filtering_df.rename(columns={"id_x": "id", "id_y": "user"})
    filtering_df = filtering_df.drop('store', axis=1)

    store_list = []
    store_id_list = []
    user_dis = (x, y)

    # 정제한 데이터프레임으로 위치기반 필터링
    for i in filtering_df.index:
        row = filtering_df.loc[i]
        lat, lon = row.latitude, row.longitude
        if lat and lon:
            store_dis = (float(lat), float(lon))
            if(haversine(user_dis, store_dis) <= 1):
                store_list.append(row)
                store_id_list.append(row.id)
    data_final = pd.DataFrame(columns=["id", "store_name", "branch", "area",
                                       "tel", "address", "latitude", "longitude", "category", "menu"])
    for i in store_list:
        append_data = pd.DataFrame(data=[[i.id, i.store_name, i.branch, i.area, i.tel, i.address, i.latitude, i.longitude, i.category, i.menu]], columns=["id", "store_name", "branch", "area",
                                                                                                                                                          "tel", "address", "latitude", "longitude", "category", "menu"])
        data_final = data_final.append(append_data)
        data_final = data_final.reset_index(drop=True)

    # 유사도 함수 호출
    d = sklearn_tfidf(data_final, like)
    return d


def sklearn_tfidf(dataframe, menu):
    tfidfv = TfidfVectorizer()
    tfidf_matrix = tfidfv.fit_transform(docs)
    # print(tfidf_matrix.shape)
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    print(cosine_sim.shape)
    # indices = pd.Series(data['stores'].index,
    #                     index=data['stores']['menu']).drop_duplicates()
    indices = pd.Series(dataframe.id,
                        index=dataframe['menu']).drop_duplicates()
    # print(indices.head())
    idx = -1
    while True:
        for m in indices.iteritems():
            if menu in m[0]:
                if menu in docs[m[1]]:
                    idx = m[1]
                    print('메뉴와 포함된 store_index')
                    print(m[0], m[1])
                    break
        if idx == -1:
            indices = pd.Series(data['stores'].index,
                                index=data['stores']['menu']).drop_duplicates()
        else:
            break

    # idx = indices

    sim_scores = list(enumerate(cosine_sim[idx]))

    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    sim_scores = sim_scores[1:11]

    store_indices = [i[0] for i in sim_scores]

    df=data['stores'].iloc[store_indices]
    store_list=df.values.tolist()
  
    return store_list


# d = sklearn_tfidf('카페')
# print(d)
# filtering('남', 21, 37.501392, 127.039648, '아구찜')
