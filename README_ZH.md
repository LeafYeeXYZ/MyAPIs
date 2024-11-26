**中文 | [English](README.md)**

# 介绍
我的自用 `Cloudflare Workers` `API` 仓库

## 使用方法
### 配置环境变量
请 `Fork` 本仓库后, 手动创建 `wrangler.toml` 文件, 并添加以下内容:

```toml
name = "api"
main = "dist/index.js"
compatibility_date = "2024-04-05"
assets = { directory = "public" }

[vars]
KEY = "VALUE"
# 见环境变量

# 仅用于统计访问量, 可不设置
[[d1_databases]]
binding = "count"
database_name = "YOUR_D1_DATABASE_NAME"
database_id = "YOUR_D1_DATABASE_ID"

# 仅用于文件快递柜, 可不设置
[[r2_buckets]]
binding = "filebox"
bucket_name = "YOUR_BUCKET_NAME"

[observability]
enabled = true
```

### 环境变量
- `CF_USER`: `Cloudflare` 用户 `ID`, 用于 `PainterLeaf` 和 `CounselorLeaf`
- `CF_AI_API_KEY`: `Cloudflare AI` 的 `API` 密钥, 用于 `PainterLeaf` 和 `CounselorLeaf`
- `HF_API_KEY`: `Hugging Face` 的 `API` 密钥, 用于 `PainterLeaf`
- `WEATHER_API_KEY`: 和风天气的 `API` 密钥, 用于 `MyHomepage`
- `FILEBOX_UPLOAD_PW`: 文件快递柜上传密码, 用于 `FileBox`
- `FILEBOX_DOWNLOAD_PW`: 文件快递柜下载密码, 用于 `FileBox`

> 如果您不需要使用某个功能, 可以不设置对应的环墇变量

### 部署
```bash
# 安装依赖
npm i -g bun
bun i
# 登录 Cloudflare
bunx wrangler login
# 部署
bun dep
```

## API 文档
| 分类 | 功能 | 路径 | 方法 | 查询参数 | 请求体 | 返回值 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `PainterLeaf` | 获取模型列表 | `/painter/models` | `GET` | - | - | `application/json` |
| `PainterLeaf` | 生成图片 | `/painter/generate` | `POST` | - | `prompt`: 提示词<br>`model`: 模型名称<br>如果图生图: `image: Array.from(uint8Array)` | `image/png` |
| `PainterLeaf` | 提示词翻译 | `/painter/translate` | `POST` | - | `text`: 文本<br>`source_lang`: 源语言<br>`target_lang`: 目标语言 | `application/json` |
| `MyHomepage` | 和风天气 | `/weather` | `GET` | `location`: `经度,纬度` | - | `application/json` |
| `CounselorLeaf` | 聊天 | `/counselor/chat` | `POST` | - | `messages`: 消息列表, 不含系统消息 | `application/json` |
| `PainterLeaf` | 图片生成文字 | `/painter/genprompt` | `POST` | - | `image: Array.from(uint8Array)` | `application/json` |
| `Others` | 访问量统计 | `/count` | `GET` | - | - | `text/javascript` |
| `Others` | 访问量统计 | `/count` | `POST` | - | `hostname`: 域名<br>`unique`: 是否统计为独立访客 | `application/json` |
| `FileBox` | 上传文件 | `/filebox/upload` | `POST` | - | `key`: 取件码<br>`filename`: 文件名<br>`password`: 上传密码<br>`file`: base64 编码的文件 | `application/json` |
| `FileBox` | 下载文件 | `/filebox/download` | `POST` | - | `key`: 取件码<br>`password`: 下载密码<br>`shouldDelete`: 是否删除文件<br>`filetype`: `file` 或 `text` | `application/json` |
| `Others` | 返回我的头像 | `/avatar.jpg` | `GET` | - | - | `image/jpeg` |

