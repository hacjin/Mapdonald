import json
import numpy as np
import pandas as pd
import os
import shutil
import datetime

DATA_DIR = "../data"
DATA_FILE = os.path.join(DATA_DIR, "data.json")
DUMP_FILE = os.path.join(DATA_DIR, "dump.pkl")

store_columns = (
    "id",  # 음식점 고유번호
    "store_name",  # 음식점 이름
    "branch",  # 음식점 지점 여부
    "area",  # 음식점 위치
    "tel",  # 음식점 번호
    "address",  # 음식점 주소
    "latitude",  # 음식점 위도
    "longitude",  # 음식점 경도
    "category",  # 음식점 카테고리
)
bhour_columns = (
    "store",  # 음식점 고유번호
    "type",  # 영업시간 종류 1- 영업시간, 2- 쉬는시간, 3- 휴무일
    "week_type",  # 주단위 종류 1-매주, 2-첫째주, 3-둘째주,4-셋째주,5-넷째주,6-공휴일
    "mon",  # 월 포함유무
    "tue",  # 화 포함유무
    "wed",  # 수 포함유무
    "thu",  # 목 포함유무
    "fri",  # 금 포함유무
    "sat",  # 토 포함유무
    "sun",  # 일 포함유무
    "start_time",  # 시작시간
    "end_time",  # 종료시간
)

review_columns = (
    "id",  # 리뷰 고유번호
    "store",  # 음식점 고유번호
    "user",  # 유저 고유번호
    "score",  # 평점
    "content",  # 리뷰 내용
    "reg_time",  # 리뷰 등록 시간
)

menu_columns = (
    "id",   # 메뉴 고유번호
    "store",  # 음식점 고유번호
    "menu_name",  # 메뉴 이름
    "price",  # 메뉴 가격
)

user_columns = (
    "id",  # 유저 고유번호
    "gender",  # 유저 성별
    "age",  # 유저 나이
)

cate_columns = (
    "store",
    "category",
    "number"
)


def import_data(data_path=DATA_FILE):
    """
    Req. 1-1-1 음식점 데이터 파일을 읽어서 Pandas DataFrame 형태로 저장합니다
    """

    try:
        with open(data_path, encoding="utf-8") as f:
            data = json.loads(f.read())
    except FileNotFoundError as e:
        print(f"`{data_path}` 가 존재하지 않습니다.")
        exit(1)

    stores = []  # 음식점 테이블
    reviews = []  # 리뷰 테이블
    menus = []  # 메뉴 테이블
    users = []  # 유저 테이블
    bhours = []  # 영업시간 테이블
    cates = []
    dt = datetime.datetime.now().year

    category = {}
    cateset = []
    menuset = []
    num = 1
    for d in data:

        # if d['address'].str.contains('서울')==True:
        if(d["review_cnt"] > 0 and len(d["category_list"])>0):
            categories = [c["category"] for c in d["category_list"]]
            for cate in categories:
                if cate in category:
                    category[cate] = category[cate]
                    cateset.append(cate)
                else:
                    cateset.append(cate)
                    category[cate] = num
                    num += 1
                cates.append([
                    d['id'],
                    cate,
                    category[cate]
                ])
            stores.append(
                [
                    d["id"],
                    d["name"],
                    d["branch"],
                    d["area"],
                    d["tel"],
                    d["address"],
                    d["latitude"],
                    d["longitude"],
                    "|".join(categories),
                ]
            )
            for review in d["review_list"]:
                r = review["review_info"]
                u = review["writer_info"]

                reviews.append(
                    [r["id"], d["id"], u["id"], r["score"],
                        r["content"], r["reg_time"]]
                )
                users.append(
                    [u["id"], u["gender"], dt - int(u["born_year"])+1]
                )

            index = 0
            for m in d["menu_list"]:
                menuset.append(m["menu"])
                index += 1
                menus.append(
                    [index, d["id"], m["menu"], m["price"]]
                )

            for b in d["bhour_list"]:
                bhours.append(
                    [d["id"], b["type"], b["week_type"], b["mon"], b["tue"], b["wed"],
                        b["thu"], b["fri"], b["sat"], b["sun"], b["start_time"], b["end_time"]]
                )
    print(set(cateset), len(set(cateset)))
    # print(len(set(menuset)))
    print(len(stores))
    print(len(reviews))
    cate_frame = pd.DataFrame(data=cates,
                              columns=cate_columns)
    store_frame = pd.DataFrame(data=stores, columns=store_columns)
    review_frame = pd.DataFrame(data=reviews, columns=review_columns)
    menu_frame = pd.DataFrame(data=menus, columns=menu_columns)
    user_frame = pd.DataFrame(data=users, columns=user_columns)
    bhour_frame = pd.DataFrame(data=bhours, columns=bhour_columns)
    return {"stores": store_frame, "reviews": review_frame, "menus": menu_frame, "users": user_frame, "bhours": bhour_frame, "categories": cate_frame}


def dump_dataframes(dataframes):
    pd.to_pickle(dataframes, DUMP_FILE)


def load_dataframes():
    return pd.read_pickle(DUMP_FILE)


def main():

    print("[*] Parsing data...")
    data = import_data()
    print("[+] Done")

    print("[*] Dumping data...")
    dump_dataframes(data)
    print("[+] Done\n")

    data = load_dataframes()

    term_w = shutil.get_terminal_size()[0] - 1
    separater = "-" * term_w

    print("[음식점]")
    print(f"{separater}\n")
    print(data["stores"].head())
    print(f"\n{separater}\n\n")

    print("[리뷰]")
    print(f"{separater}\n")
    print(data["reviews"])
    print(data["reviews"].index.tolist)
    print(f"\n{separater}\n\n")

    print("[메뉴]")
    print(f"{separater}\n")
    print(data["menus"].head())
    print(f"\n{separater}\n\n")

    print("[유저]")
    print(f"{separater}\n")
    print(data["users"].head())
    print(f"\n{separater}\n\n")

    print("[영업시간]")
    print(f"{separater}\n")
    print(data["bhours"].head())
    print(f"\n{separater}\n\n")


if __name__ == "__main__":
    main()
