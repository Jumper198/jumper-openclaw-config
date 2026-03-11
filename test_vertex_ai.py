#!/usr/bin/env python3
"""
测试 Google Gemini 模型 (使用 API Key)
"""

import os
import requests

# Google AI API 配置
GOOGLE_API_KEY = "AQ.Ab8RN6LfqgqmwONjCJ90ZTMhHNbE-aguqP9BeV2AifoGe4BFIA"

# 可用模型
AVAILABLE_MODELS = [
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
]

def list_models():
    """列出所有可用的 Gemini 模型"""
    print("="*60)
    print("📋 可用的 Gemini 模型")
    print("="*60)
    
    url = f'https://generativelanguage.googleapis.com/v1/models?key={GOOGLE_API_KEY}'
    response = requests.get(url)
    
    if response.status_code == 200:
        models = response.json()
        model_list = models.get('models', [])
        
        # 过滤出 Gemini 模型
        gemini_models = [m for m in model_list if 'gemini' in m.get('name', '').lower()]
        
        print(f"\n找到 {len(gemini_models)} 个 Gemini 模型:\n")
        for model in gemini_models:
            name = model.get('name', 'Unknown')
            display_name = model.get('displayName', 'Unknown')
            print(f"  • {name} ({display_name})")
            
            # 显示支持的生成方法
            supported_methods = model.get('supportedGenerationMethods', [])
            if supported_methods:
                print(f"    支持的方法: {', '.join(supported_methods)}")
        return gemini_models
    else:
        print(f"❌ 错误: {response.status_code}")
        print(response.text)
        return []

def test_model(model_id, prompt="你好！请用一句话介绍你自己。"):
    """测试指定的模型"""
    print("="*60)
    print(f"🧪 测试模型: {model_id}")
    print("="*60)
    
    url = f'https://generativelanguage.googleapis.com/v1/models/{model_id}:generateContent?key={GOOGLE_API_KEY}'
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    body = {
        "contents": [
            {
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
        print(f"✅ 模型响应成功！\n")
        print(f"🤖 回复: {text}")
        return True
    else:
        print(f"❌ 错误: {response.status_code}")
        print(response.text)
        return False

def show_openclaw_config():
    """显示 OpenClaw 配置示例"""
    print("\n" + "="*60)
    print("📋 OpenClaw 配置示例")
    print("="*60)
    print("""
在 OpenClaw 配置文件中添加以下模型配置：

```yaml
models:
  - id: google-gemini-2.5-pro
    name: Google Gemini 2.5 Pro
    provider: google
    apiKey: AQ.Ab8RN6LfqgqmwONjCJ90ZTMhHNbE-aguqP9BeV2AifoGe4BFBFIA
    model: gemini-2.5-pro

  - id: google-gemini-2.5-flash
    name: Google Gemini 2.5 Flash
    provider: google
    apiKey: AQ.Ab8RN6LfqgqmwONjCJ90ZTMhHNbE-aguqP9QBeV2AifoGe4BFIA
    model: gemini-2.5-flash

  - id: google-gemini-2.5-flash-lite
    name: Google Gemini 2.5 Flash Lite
    provider: google
    apiKey: AQ.Ab8RN6LfqgqmwONjCJ90ZTMhHNbE-aguqP9QBeV2AifoGe4BFIA
    model: gemini-2.5-flash-lite
```

或者使用环境变量：

```bash
export GOOGLE_API_KEY="AQ.Ab8RN6LfqgqmwONjCJ90ZTMhHNbE-aguqP9BeV2AifoGe4BFIA"
```
    """)

def main():
    """主函数"""
    print("🔍 Google Gemini 模型测试")
    print("="*60)
    print(f"🔑 API Key: {GOOGLE_API_KEY[:20]}...{GOOGLE_API_KEY[-10:]}")
    print()
    
    # 列出所有模型
    models = list_models()
    
    if not models:
        print("\n❌ 没有找到可用的模型")
        return
    
    # 测试推荐的模型
    print("\n" + "="*60)
    print("🧪 测试推荐模型")
    print("="*60)
    
    test_model("gemini-2.5-pro")
    print()
    test_model("gemini-2.5-flash")
    
    # 显示配置示例
    show_openclaw_config()

if __name__ == "__main__":
    main()
