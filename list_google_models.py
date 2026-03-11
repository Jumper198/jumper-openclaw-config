#!/usr/bin/env python3
"""
获取 Google AI 可用模型列表
"""

import urllib.request
import urllib.error
import json

API_KEY = "AIzaSyDb3Y4mGlEO9LOZLLQki_3fNDSKGqGolF0"
API_URL = "https://generativelanguage.googleapis.com/v1beta/models"

def list_models():
    """获取可用模型列表"""
    print("🔍 获取 Google AI 可用模型...")
    print(f"📡 API URL: {API_URL}")
    print(f"🔑 API Key: {API_KEY[:10]}...{API_KEY[-4:]}")
    print()

    headers = {
        "x-goog-api-key": API_KEY
    }

    try:
        print("📤 发送请求...")
        req = urllib.request.Request(
            API_URL,
            headers=headers,
            method='GET'
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            print(f"📊 状态码: {response.status}")
            print()

            if response.status == 200:
                print("✅ 成功获取模型列表！")
                result = json.loads(response.read().decode('utf-8'))

                if "models" in result:
                    models = result["models"]
                    print(f"📦 找到 {len(models)} 个模型：")
                    print()

                    for i, model in enumerate(models, 1):
                        name = model.get("name", "Unknown")
                        display_name = model.get("displayName", "")
                        description = model.get("description", "")

                        print(f"{i}. {name}")
                        if display_name:
                            print(f"   显示名称: {display_name}")
                        if description:
                            print(f"   描述: {description}")
                        print()
                else:
                    print("⚠️  响应格式异常")
                    print(json.dumps(result, indent=2, ensure_ascii=False))
            else:
                print(f"❌ 错误: {response.status}")
                print(response.read().decode('utf-8'))

    except urllib.error.HTTPError as e:
        print(f"❌ HTTP 错误: {e.code} - {e.reason}")
        try:
            error_info = json.loads(e.read().decode('utf-8'))
            print(json.dumps(error_info, indent=2, ensure_ascii=False))
        except:
            print(e.read().decode('utf-8'))
    except urllib.error.URLError as e:
        print(f"❌ URL 错误: {e.reason}")
    except Exception as e:
        print(f"❌ 未知异常: {e}")

if __name__ == "__main__":
    list_models()
