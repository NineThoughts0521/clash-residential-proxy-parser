import os
import re

# 1. 设定新版本号
NEW_VERSION = "v1.0.0"  # 每次发布前改这里
OLD_VERSION_REGEX = r"v\d+\.\d+\.\d+"  # 匹配 v1.0.0, v1.0.0 等格式

# 2. 定义需要修改的文件及其匹配规则
# key: 文件路径
# value: 这是一个简单的字符串替换，或者更复杂的逻辑
FILES_TO_UPDATE = [
    "scripts/residential_proxy_prepend.js",
    "tools/config-generator-cli.js",
    "tools/config-generator.html",
    "tools/config-template.json",
    "examples/basic-example.yaml",
]


def update_file(file_path):
    if not os.path.exists(file_path):
        print(f"❌ 找不到文件: {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 核心替换逻辑：查找 "版本: vX.X.X" 或类似字眼
    # 这里我们简单粗暴地把所有 vX.X.X 格式的版本号替换掉
    # 注意：这可能会误伤，所以最好限定一下上下文，或者人工确认

    # 针对你的项目，版本号通常出现在注释里，比如 "版本: v1.0.0"
    # 我们用正则替换所有匹配到的旧版本号
    new_content, count = re.subn(OLD_VERSION_REGEX, NEW_VERSION, content)

    if count > 0:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"✅ 已更新 {file_path} (修改了 {count} 处)")
    else:
        print(f"⚠️  {file_path} 中未发现旧版本号，跳过")


# 特殊处理 JSON 文件 (因为 JSON 里的 "version": "1.0.0" 没有 v 前缀)
def update_json_template():
    json_path = "tools/config-template.json"
    if not os.path.exists(json_path):
        return

    with open(json_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 替换 "version": "x.x.x"
    # 去掉 NEW_VERSION 里的 'v'
    clean_version = NEW_VERSION.replace("v", "")
    new_content = re.sub(
        r'"version": "\d+\.\d+(\.\d+)?"', f'"version": "{clean_version}"', content
    )

    with open(json_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"✅ 已更新 {json_path} (JSON 字段)")


if __name__ == "__main__":
    print(f"🚀 开始将项目更新至 {NEW_VERSION} ...")

    # 更新普通文本文件
    for file in FILES_TO_UPDATE:
        # 跳过 JSON，单独处理
        if file.endswith(".json"):
            continue
        update_file(file)

    # 单独处理 JSON
    update_json_template()

    print("\n🎉 更新完成！请检查文件内容，然后提交 Git。")
