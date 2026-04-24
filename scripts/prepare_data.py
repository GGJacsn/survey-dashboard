import json
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
INPUT_FILE = BASE_DIR / "data" / "raw" / "raw.csv"
OUTPUT_FILE = BASE_DIR / "data" / "processed" / "processed_data.json"
CITIES_FILE = BASE_DIR / "data" / "processed" / "unique_cities.json"
PROVINCE_REGION_FILE = BASE_DIR / "data" / "processed" / "province_region_map.json"

ALIAS_MAP = {
    "序号": "record_id",
    "提交答卷时间": "submitted_at",
    "所用时间": "duration_seconds",
    "来源": "source",
    "来源详情": "source_detail",
    "来自IP": "ip",
    "备注": "note",
    "1. 过去3个月里，是否买过水产品或水产品类加工品，用于家里做饭?": "q1_bought_recently",
    "2. 在家里买水产品这件事上，通常属于哪种情况?": "q2_purchase_role",
    "3. 您的年龄是?": "age",
    "请问您所在的城市是：": "city",
    "4. 目前的职业状态是?": "occupation",
    "6. 家庭年收入大致属于以下哪一档?": "income",
    "8. 如果按您平时买菜做饭的习惯，您家里一顿晚饭一般会花多少钱?": "dinner_budget",
    "9. 家庭结构更接近哪种情况?": "family_structure",
    "10. 家里吃水产品的大致频率是?": "seafood_frequency",
    "11. 买水产品主要通过哪些渠道?": "purchase_channel",
    "12. 平时更常买哪类水产品?": "buy_category",
    "13. 以下四类水产品里，平时在家吃得最多的是哪一类?": "eat_most_category",
    "14. 假设你平时购买水产品的情况。下面这些特点里，你买的时候最看重哪2项?[多选题，]": "q14_key_factors",
    "15. 其中，您认为最不重要的是?": "q15_least_important",
    "16. 买一个以前没买过的水产品时，你最容易因为什么犹豫?": "q16_hesitation",
    "17. 下面四款水产品产品价格接近、品牌你都不熟悉。你会更倾向于选择哪一款?": "q17_preference",
    "18. 哪一种会让你觉得“贵一点也能接受”?": "q18_accept_higher_price",
    "19. 下面四款水产品你都没买过。它们都说自己品质不错，但各自给出的“证明方式”不同。你更愿意先买哪一款试试?": "q19_proof_preference",
    "20. 如果在线下冷柜前看到下面四款水产品包装，你会觉得哪一款看起来更放心?": "q20_packaging_trust",
    "21. 平时你会在哪些平台刷到和“买菜、做饭、吃什么”有关的内容?": "q21_content_platform",
    "22. 平时如果你刷到和水产品、做饭、食材有关的内容，你更愿意看哪几类?[多选题，]": "q22_content_type",
    "23. 如果是推荐水产品、食材这类内容，你会觉得哪种来源更可信?": "q23_trusted_source",
    "24. 你有没有跟着主播、达人或内容推荐买过水产品/生鲜/食材?": "q24_bought_from_content",
    "25. 哪种情况最容易让你从“看一看”变成“下单试试”?": "q25_trigger_to_buy",
    "26. 过去3个月里，您购买过鱼排、煎饺、馄饨这类水产品加工品的频次是?": "q26_processed_frequency",
    "27. 如果买这类水产品加工品，下面哪些情况最会让你觉得它“值得买”?[多选题，]": "q27_processed_value",
    "28. 对这类水产品加工品来说，下面哪些情况最容易让你犹豫，甚至不想买?[多选题，]": "q28_processed_hesitation",
}

MULTI_SELECT_COLUMNS = [
    "14. 假设你平时购买水产品的情况。下面这些特点里，你买的时候最看重哪2项?[多选题，]",
    "22. 平时如果你刷到和水产品、做饭、食材有关的内容，你更愿意看哪几类?[多选题，]",
    "27. 如果买这类水产品加工品，下面哪些情况最会让你觉得它“值得买”?[多选题，]",
    "28. 对这类水产品加工品来说，下面哪些情况最容易让你犹豫，甚至不想买?[多选题，]",
]

CITY_COLUMN = "请问您所在的城市是："


def clean_value(value):
    if pd.isna(value):
        return None
    text = str(value).strip()
    return text if text != "" else None


def split_multi_select(value):
    if value is None:
        return []
    return [item.strip() for item in str(value).split("┋") if item.strip()]


def normalize_city(value):
    if value is None:
        return None
    city = str(value).strip()
    city = city.replace("市", "")
    return city if city else None

def extract_province(location):
    if location is None:
        return None
    text = str(location).strip()
    if text == "":
        return None
    if "-" in text:
        return text.split("-")[0].strip()
    return text


def load_province_region_map():
    if not PROVINCE_REGION_FILE.exists():
        return {}
    with open(PROVINCE_REGION_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def map_region_by_province(location, province_region_map):
    province = extract_province(location)
    if province is None:
        return "其他"
    return province_region_map.get(province, "其他")


def build_unique_cities(df):
    if CITY_COLUMN not in df.columns:
        return []

    cities = (
        df[CITY_COLUMN]
        .dropna()
        .map(normalize_city)
        .dropna()
        .drop_duplicates()
        .sort_values()
        .tolist()
    )
    return cities


def main():
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    try:
        df = pd.read_csv(INPUT_FILE)
    except UnicodeDecodeError:
        try:
            df = pd.read_csv(INPUT_FILE, encoding="utf-8-sig")
        except UnicodeDecodeError:
            df = pd.read_csv(INPUT_FILE, encoding="gb18030")

    province_region_map = load_province_region_map()

    original_columns = df.columns.tolist()

    for col in df.columns:
        df[col] = df[col].apply(clean_value)

    for col in MULTI_SELECT_COLUMNS:
        if col in df.columns:
            df[col] = df[col].apply(split_multi_select)

    if CITY_COLUMN in df.columns:
        df["city_normalized"] = df[CITY_COLUMN].apply(normalize_city)
        df["province"] = df[CITY_COLUMN].apply(extract_province)
        df["region"] = df[CITY_COLUMN].apply(
        lambda x: map_region_by_province(x, province_region_map)
    )

    records = []
    for _, row in df.iterrows():
        record = row.to_dict()

        for cn_name, alias in ALIAS_MAP.items():
            if cn_name in record:
                record[alias] = record[cn_name]

        records.append(record)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    unique_cities = build_unique_cities(df)
    with open(CITIES_FILE, "w", encoding="utf-8") as f:
        json.dump(unique_cities, f, ensure_ascii=False, indent=2)

    print("转换完成")
    print(f"记录数: {len(records)}")
    print(f"原始字段数: {len(original_columns)}")
    print(f"唯一城市数: {len(unique_cities)}")
    print(f"输出文件: {OUTPUT_FILE.name}")
    print(f"城市文件: {CITIES_FILE.name}")
    if records:
        print(f"新增字段检查: province={ 'province' in records[0] }, region={ 'region' in records[0] }")


if __name__ == "__main__":
    main()