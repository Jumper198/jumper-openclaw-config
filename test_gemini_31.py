#!/usr/bin/env python3
"""
测试 Gemini 3.1 Pro Preview 模型（使用 Vertex AI）
"""

import requests
import json

# 配置
API_KEY = "AQ.Ab8RN6LfqgqmwONjCJ90ZTMhHNbE-aguqP9BeV2AifoGe4BFIA"
PROJECT = "gen-lang-client-0207216513"
LOCATION = "global"
MODEL = "gemini-3.1-pro-preview"

def test_vertex_ai(prompt="用一句话解释为什么天空是蓝色的"):
    """测试 Vertex AI Gemini 模型"""
    print("="*60)
    print(f"🧪 测试 Vertex AI: {MODEL}")
    print("="*60)
    
    # 使用 Vertex AI generateContent endpoint
    url = f'https://aiplatform.googleapis.com/v1/projects/{PROJECT}/locations/{LOCATION}/publishers/google/models/{MODEL}:generateContent?key={API_KEY}'
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    body = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }
    
    print(f"\n📝 提示词: {prompt}\n")
    
    response = requests.post(url, headers=headers, json=body)
    
    if response.status_code == 200:
        result = response.json()
        text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
        
        # 显示使用信息
        usage = result.get('usageMetadata', {})
        print(f"✅ 模型响应成功！\n")
        print(f"🤖 回复: {text}")
        print(f"\n📊 使用信息:")
        print(f"  • Prompt Tokens: {usage.get('promptTokenCount', 0)}")
        print(f"  • Candidates Tokens: {usage.get('candidatesTokenCount', 0)}")
        print(f"  • Total Tokens: {usage.get('totalTokenCount', 0)}")
        print(f"  • Model Version: {result.get('modelVersion', 'Unknown')}")
        return True
    else:
        print(f"❌ 错误: {response.status_code}")
        print(response.text)
        return False

def test_available_models():
    """测试可用的模型"""
    print("="*60)
    print("📋 测试可用的模型")
    print("="*60)
    
    models_to_test = [
        "gemini-3.1-pro-preview",
        "gemini-3.1-flash-preview",
        "gemini-2.5-pro",
        "gemini-2.5-flash",
    ]
    
    for model in models_to_test:
        url = f'https://aiplatform.googleapis.com/v1/projects/{PROJECT}/locations/{LOCATION}/publishers/google/models/{model}:generateContent?key={API_KEY}'
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        body = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": "你好"
                        }
                    ]
                }
            ]
        }
        
        response = requests.post(url, headers=headers, json=body)
        
        if response.status_code == 200:
            print(f"  ✅ {model}")
        elif response.status_code == 404:
            print(f"  ❌ {model} (未找到)")
        else:
            print(f"  ⚠️  {model} (错误: {response.status_code})")

def main():
    """主函数"""
    print("🔍 测试 Vertex AI Gemini 3.1 Pro Preview")
    print("="*60)
    print(f"🔑 API Key: {API_KEY[:20]}...{API_KEY[-10:]}")
    print(f"📊 Project: {PROJECT}")
    print(f"📍 Location: {LOCATION}")
    print(f"🤖 Model: {MODEL}")
    print()
    
    # 测试可用的模型
    test_available_models()
    
    print()
    
    # 测试 3.1 Pro Preview
    if test_vertex_ai():
        print("\n🎉 Vertex AI + Gemini 3.1 Pro Preview 配置成功！")
        print("\n📋 OpenClaw 配置示例:")
        print("="*60)
        print("""
在 OpenClaw 配置文件中添加以下模型配置：

```yaml
models:
  - id: vertex-gemini-3.1-pro-preview
    name: Vertex AI Gemini 3.1 Pro Preview
    provider: vertex
    apiKey: AQ.Ab8RN6LfqgqmwONjCJ90ZTMhHNbE-aguqP9BeV2AifoGe4BFIA
    project: gen-lang-client-0207216513
    location: global
    model: gemini-3.1-pro-preview

  - id: vertex-gemini-2.5-pro
    name: Vertex AI Gemini 2.5 Pro
    provider: vertex
    apiKey: AQ.Ab8RN6LfqgqmwONjCJ90ZTMhHNbE-aguqP9BeV2AifoGe4BFIA
    project: gen-lang-client-0207216513
    location: global
    model: gemini-2.5-pro
```

或者使用环境变量：

```bash
export GOOGLE_API_KEY="AQ.Ab8RN6LfqgqmwONjCJ90ZTMhHNbE-aguqP9BeV2AifoGe4BFIA"
export GOOGLE_PROJECT="gen-lang-client-0207216513"
export GOOGLE_LOCATION="global"
```
        """)

if __name__ == "__main__":
    main()
