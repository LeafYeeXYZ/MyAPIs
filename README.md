# 介绍
我的自用 `API` 仓库, 如您需要修改使用, 请手动创建 `wrangler.toml` 文件, 并添加以下内容:

```toml
name = "api"
main = "src/index.js"
compatibility_date = "2024-04-05"

[vars]
KEY = "VALUE"
# 见环境变量
```

## 环境变量
- `CF_USER`: `Cloudflare` 用户 `ID`
- `CF_API_KEY`: `Cloudflare AI` 的 `API` 密钥
- `HF_API_KEY`: `Hugging Face` 的 `API` 密钥
- `WEATHER_API_KEY`: 和风天气的 `API` 密钥

## API 文档
| 分类 | 功能 | 路径 | 方法 | 查询参数 | 请求体 | 返回值 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `PainterLeaf` | 获取模型列表 | `/painter/models` | `GET` | - | - | `application/json` |
| `PainterLeaf` | 生成图片 | `/painter/generate` | `GET` | `prompt`: 提示词<br>`model`: 模型名称 | - | `image/png` |
| `MyHomepage` | 代理和风天气 | `/weather` | `GET` | - | - | `application/json` |
| `PainterLeaf` | 提示词翻译 | `/painter/translate` | `POST` | `text`: 文本<br>`source_lang`: 源语言<br>`target_lang`: 目标语言 | - | `application/json` |

