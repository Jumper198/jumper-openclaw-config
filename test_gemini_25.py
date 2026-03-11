#!/usr/bin/env python3
import urllib.request
import urllib.error
import json
import time

API_KEY = "AIzaSyCzlLgfsogxw6ZeGSERVFqc78qEIlR2phw"
API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent"

headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY
}

payload = {
    "contents": [{
        "parts": [{
            "text": "Hello, please reply with 'API works!'"
        }]
    }]
}

print("🔍 测试 Gemini 2.5 Pro...")
print(f"🔑 Key: {API_KEY[:10]}...{API_KEY[-4:]}")
print()

try:
    start_time = time.time()
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers=headers,
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=30) as response:
        elapsed_time = time.time() - start_time
        print(f"⏱️  响应时间: {elapsed_time:.2f}s")
        print(f"📊 状态码: {response.status}")
        print()

        if response.status == 200:
            print("✅ API 赃用成功！")
            result = json.loads(response.read().decode('utf-8'))
            if "candidates" in result:
                reply = result["candidates"][0]["content"]["parts"][0]["text"]
                print(f"💬 AI 回复: {reply}")
            else:
                print("⚠️  响应格式异常")
                print(json.dumps(result, indent=2, ensure_ascii=False))
        elif response.status == 429:
            print("❌ API 被限流 (Rate Limited)")
            error_info = json.loads(response.read().decode('utf-8'))
            print(json.dumps(error_info, indent=2, ensure_ascii=False))
        elif response.status == 403:
            print("❌ API 权限不足或配额超限")
            error_info = json.loads(response.read().decode('utf-8'))
            print(json.dumps(error_info, indent=2, ensure_ascii=False))
        else:
            print(f"❌ 未知错误: {response.status}")
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
