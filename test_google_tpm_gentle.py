#!/usr/bin/env python3
import urllib.request
import urllib.error
import json
import time

API_KEY = "AIzaSyCzlLgfsogxw6ZeGSERVFqc78qEIlR2phw"
API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent"

TEST_COUNT = 10
REQUEST_INTERVAL = 2.0  # 增加到2秒间隔

results = []

def make_request(request_id):
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY
    }

    payload = {
        "contents": [{
            "parts": [{
                "text": f"Test {request_id}. Reply 'OK {request_id}'."
            }]
        }]
    }

    start_time = time.time()
    status_code = None
    error_message = None
    response_time = 0

    try:
        req = urllib.request.Request(
            API_URL,
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method='POST'
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            status_code = response.status
            response_time = time.time() - start_time

            if status_code == 200:
                result = json.loads(response.read().decode('utf-8'))
                if "candidates" in result:
                    error_message = None
                else:
                    error_message = "Response format error"
            elif status_code == 429:
                error_info = json.loads(response.read().decode('utf-8'))
                error_message = error_info.get('error', {}).get('message', 'Rate Limited')
            elif status_code == 403:
                error_info = json.loads(response.read().decode('utf-8'))
                error_message = error_info.get('error', {}).get('message', 'Quota Exceeded')
            else:
                error_message = f"HTTP {status_code}"

    except urllib.error.HTTPError as e:
        status_code = e.code
        response_time = time.time() - start_time
        try:
            error_info = json.loads(e.read().decode('utf-8'))
            error_message = error_info.get('error', {}).get('message', str(e.reason))
        except:
            error_message = str(e.reason)

    except urllib.error.URLError as e:
        response_time = time.time() - start_time
        status_code = 0
        error_message = f"URL Error: {e.reason}"

    except Exception as e:
        response_time = time.time() - start_time
        status_code = 0
        error_message = f"Exception: {e}"

    results.append({
        'id': request_id,
        'status': status_code,
        'time': response_time,
        'error': error_message,
        'timestamp': time.time()
    })

def run_test():
    print(f"🚀 温和并发测试")
    print(f"📊 配置: {TEST_COUNT} 次请求, {REQUEST_INTERVAL}s 间隔")
    print(f"🔑 Key: {API_KEY[:10]}...{API_KEY[-4:]}")
    print()

    start_time = time.time()

    for i in range(TEST_COUNT):
        print(f"📤 发送请求 #{i + 1}/{TEST_COUNT}...")
        make_request(i + 1)
        if i < TEST_COUNT - 1:
            time.sleep(REQUEST_INTERVAL)

    total_time = time.time() - start_time

    print("\n" + "="*60)
    print("📈 测试结果统计")
    print("="*60)

    success = [r for r in results if r['status'] == 200]
    rate_limited = [r for r in results if r['status'] == 429]
    quota_exceeded = [r for r in results if r['status'] == 403]
    errors = [r for r in results if r['status'] not in [200, 429, 403]]

    print(f"✅ 成功: {len(success)}/{TEST_COUNT}")
    print(f"⏱️  限流 (429): {len(rate_limited)}/{TEST_COUNT}")
    print(f"💥 配额超限 (403): {len(quota_exceeded)}/{TEST_COUNT}")
    print(f"❌ 其他错误: {len(errors)}/{TEST_COUNT}")
    print(f"⏱️  总耗时: {total_time:.2f}s")
    print()

    if success:
        avg_time = sum(r['time'] for r in success) / len(success)
        print(f"⏱️  平均响应时间: {avg_time:.2f}s")

    print("\n" + "="*60)
    print("📋 详细结果")
    print("="*60)

    for r in results:
        if r['status'] == 200:
            icon = "✅"
            text = "OK"
        elif r['status'] == 429:
            icon = "⏱️"
            text = "Rate Limited"
        elif r['status'] == 403:
            icon = "💥"
            text = "Quota Exceeded"
        else:
            icon = "❌"
            text = f"{r['status']}"
        print(f"{icon} 请求 #{r['id']:2d}: {text} | {r['time']:.2f}s")

if __name__ == "__main__":
    run_test()
