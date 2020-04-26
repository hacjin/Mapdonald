from parse import load_dataframes
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import shutil
from sklearn.decomposition import TruncatedSVD
from scipy.sparse.linalg import svds
from math import log
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from numpy import dot
from numpy.linalg import norm
import warnings
warnings.filterwarnings("ignore")
from haversine import haversine, Unit
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer
import time


docs = []
N = 0

def practice(dataframes, gender, age, x, y, like):
    print('pratice 시작 ' , time.time())
    data_merge = pd.merge(
        dataframes["users"], dataframes["reviews"], left_on="id", right_on="user"
    )
    # 성별 전처리
    gender_filtering = data_merge[data_merge["gender"]==gender] 
    # 나이 전처리 (나이대)
    # print(time.time())
    # print('pratice 111111 ' , time.time())
    
    age_val = int(age/10)*10
    # print(gender_filtering)
    age_filtering = gender_filtering[(gender_filtering["age"]>=age_val)  ]
    age_filtering = age_filtering[gender_filtering["age"]<age_val+10]
    # 전처리한 상점들 넣어놓은 list
    store_list = []
    store_id_list = []

    # 사용자 위도 경도
    user_dis = (x , y)  
    dt = dataframes["stores"]
    #print(age_filtering)
    # print('pratice 2222222 ' , time.time())
    for i in dt.index:   # 오래걸림
        row  = dt.loc[i]
        lat, lon = row.latitude, row.longitude
        if lat and lon:
            store_dis = (float(lat), float(lon))
            
            # 사용자와 store 거리 1km 이하만 넣어주기
            if(haversine(user_dis, store_dis)<=1):
                #print(dt.loc[i])
                store_list.append(row)
                store_id_list.append(row.id)
    # print('pratice 333333 ' , time.time())
    
    # print(store_list[0].id)

    # 최종 data
    data_final = pd.DataFrame(columns=['id','store_name','branch','area','tel','address','latitude','longitude','category'])
    for i in store_list:
        append_data = pd.DataFrame(data=[[i.id, i.store_name, i.branch, i.area, i.tel, i.address, i.latitude, i.longitude, i.category]],columns=['id','store_name','branch','area','tel','address','latitude','longitude','category'])
        data_final = data_final.append(append_data)
        data_final = data_final.reset_index(drop=True)
    
    # print('pratice 4444444 ' , time.time())

    #front에서 받아온 category => catego
    user_append_data = pd.DataFrame(data=[[None, "제발", None, None, None, None, None, None, like]],columns=['id','store_name','branch','area','tel','address','latitude','longitude','category'])
    data_final = data_final.append(user_append_data)
    data_final = data_final.reset_index(drop=True)
    print(data_final)

    print('pratice 5555555 ' , time.time())

    #################tf-idf 구현부분###
    global docs
    docs = []
    for i in data_final.index:
        # print(df.loc[i, "category"])
        cate = data_final.loc[i, "category"]
        if(cate is not None):
            docs.append(data_final.loc[i, "category"])
    
    vocab = list(set(w for doc in docs for w in doc.split('|')))
    vocab.sort()
    #print(docs)
    print('============docs===============')
    for i in range(len(docs)):
        print(i," : ",docs[i])
    print('============vocab===============')
    for i in range(len(vocab)):
        print(i," : ",vocab[i])
    print('pratice 66666 ' , time.time())
    
    
    global N 
    N = len(docs)
    # print(N)
    result = []
    for i in range(N): # 각 문서에 대해서 아래 명령을 수행
        result.append([])
        d = docs[i]
        for j in range(len(vocab)):
            t = vocab[j]        
            result[-1].append(tf(t, d))

    tf_ = pd.DataFrame(result, columns = vocab)
    # print(tf_)
    print('pratice 7777777 ' , time.time())

    result = []
    for j in range(len(vocab)):
        t = vocab[j]
        result.append(idf(t))
    idf_ = pd.DataFrame(result, index = vocab, columns = ["IDF"])
    #print(idf_)

    result = []
    for i in range(N):
        result.append([])
        d = docs[i]
        for j in range(len(vocab)):
            t = vocab[j]
            result[-1].append(tfidf(t,d))
    # print('pratice 88888888 ' , time.time())

    #tfidf_ = pd.DataFrame(result, columns = vocab)
    #print(tfidf_)
    # https://wikidocs.net/24603
    tfidf_ = TfidfVectorizer().fit(data_final["category"])
    tfidf_matrix = tfidf_.transform(data_final["category"])
    # print('============tfidf==============')
    # print(tfidf_matrix)
    # print(tfidf_matrix.shape)

    # 코사인유사도
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    indices = pd.Series(data_final.index, index=data_final['store_name']).drop_duplicates()
    #print(indices)
    # print(indices.head())
    #########################################################

    # 사용자가 넣은 index = idx
    idx = indices['제발']
    #print(idx)
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11]
    #print(sim_scores)
    # print('pratice 99999999 ' , time.time())
    
    #data_final의 id 값들 
    stores_indices = [i[0] for i in sim_scores]
    # print(data_final['store_name'].iloc[stores_indices])
    # print(data_final['category'].iloc[stores_indices])
    #print(stores_indices)

    


    ############### 의미있는 데이터가 몇개인지, result1에 쑤셔넣기##
    cnt = 0 #의미있는 데이터 개수
    sim_scores_len = len(sim_scores)
    result1 = pd.DataFrame(columns=['id','store_name','branch','area','tel','address','latitude','longitude','category'])
    data1 = []
    for i in range(sim_scores_len):
        if(sim_scores[i][1]>0.6):
            result1_id = data_final.loc[sim_scores[i][0], "id"]
            result1_store_name = data_final.loc[sim_scores[i][0], "store_name"]
            result1_branch = data_final.loc[sim_scores[i][0], "branch"]
            result1_area = data_final.loc[sim_scores[i][0], "area"]
            result1_tel = data_final.loc[sim_scores[i][0], "tel"]
            result1_address = data_final.loc[sim_scores[i][0], "address"]
            result1_latitude = data_final.loc[sim_scores[i][0], "latitude"]
            result1_longitude = data_final.loc[sim_scores[i][0], "longitude"]
            result1_category = data_final.loc[sim_scores[i][0], "category"]
            if (result1_store_name!='제발'):
                cnt = cnt+1
                aa = pd.DataFrame(data=[[result1_id, result1_store_name, result1_branch, result1_area, result1_tel, result1_address, result1_latitude, result1_longitude, result1_category]],columns=['id','store_name','branch','area','tel','address','latitude','longitude','category'])
                result1 = result1.append(aa)
                result1 = result1.reset_index(drop=True)
                data1.append(result1_id)
    # print(result1)        
    # print(data1)
    # print(data_final)
    # print('pratice 000000000000000 ' , time.time())
    
    data2_merge = pd.merge(
        data_final, dataframes["reviews"], left_on="id", right_on="store"
    )
    # print(data2_merge)
    scores_group = data2_merge.groupby(
        ["store", "store_name"])
    # print(scores_group)
    scores = scores_group.agg({'score': 'mean'})
    sort_scores = scores.sort_values(by=['score'], axis=0, ascending=False)
    reviews_count = scores_group.agg({'score': ['mean', 'size']})
    reviews_count.columns = ['score', 'cnt']
    reviews_count.reset_index()
    # print('pratice 111111111111111111111 ' , time.time())
    
    ge_min_idx = 0
    for i in range(30, 0, -1):
        # print(i)
        gt_min_reviews_count = reviews_count[reviews_count['cnt']
                                         >= i].sort_values(by=['score'], axis=0, ascending=False)
        ttt = len(gt_min_reviews_count)
        if(ttt>=20):
            ge_min_idx = i
            break
    
    gt_min_reviews_count = reviews_count[reviews_count['cnt']
                                         >= ge_min_idx].sort_values(by=['score'], axis=0, ascending=False)                    
    # print(gt_min_reviews_count.head(n=20).reset_index())
    gt_min_reviews_count = gt_min_reviews_count.head(n=20).reset_index()                                      
    # print(type(gt_min_reviews_count))
    data2 = []
    for i in range(0, 20):
        data2.append(gt_min_reviews_count.loc[i].store)
    # print(data2)
    # print('pratice 2222222222222222끗 ' , time.time())
    
    #  ##result1 => data1
    #  ##result4 => data2
    #  ## data1에 없는 것들 중 data2  
    print([data1, data2])   
    return [data1, data2]
  
        


def tf(t, d):
    return d.count(t)

def idf(t):
    df = 0
    for doc in docs:
        df += t in doc
    return log(N/(df + 1))

def tfidf(t, d):
    return tf(t,d)* idf(t)


def main(like,age,gender,latitude,longitude):
    print('practice - main') 
    data = load_dataframes()
    term_w = shutil.get_terminal_size()[0] - 1
    separater = "-" * term_w
    if gender ==1:
        gender = "남"
    else:
        gender ="여"
    age = age
    x = latitude
    y = longitude
    like = "카페"
    print('main return 전')
    return practice(data, gender, age, x, y, like)
    