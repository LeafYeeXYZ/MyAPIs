**[中文](README_ZH.md) | English**

# Introduction
My personal `Cloudflare Workers` `API` repository

## Usage
### Configure Environment Variables
Please `Fork` this repository, manually create the `wrangler.toml` file, and add the following content:

```toml
name = "api"
main = "dist/index.js"
compatibility_date = "2024-04-05"

[vars]
KEY = "VALUE"
# See Environment Variables

# Only used for counting visits, can be omitted
[[d1_databases]]
binding = "count"
database_name = "YOUR_D1_DATABASE_NAME"
database_id = "YOUR_D1_DATABASE_ID"

# Only used for FileBox, can be omitted
[[r2_buckets]]
binding = "filebox"
bucket_name = "YOUR_BUCKET_NAME"

[observability]
enabled = true
```

### Environment Variables
- `CF_USER`: `Cloudflare` user `ID`, for `PainterLeaf` and `CounselorLeaf`
- `CF_AI_API_KEY`: `Cloudflare AI` `API` key, for `PainterLeaf` and `CounselorLeaf`
- `HF_API_KEY`: `Hugging Face` `API` key, for `PainterLeaf`
- `WEATHER_API_KEY`: [`qWeather`](https://dev.qweather.com/docs/api) `API` key, for `MyHomepage`
- `FILEBOX_UPLOAD_PW`: FileBox upload password, for `FileBox`
- `FILEBOX_DOWNLOAD_PW`: FileBox download password, for `FileBox`

> If you don't need to use a certain feature, it's okay not to set the corresponding environment variable.

### Deployment
```bash
# Install dependencies
npm i -g bun
bun i
# Login to Cloudflare
bunx wrangler login
# Deploy
bun dep
```

## API Reference
| Category | Function | Path | Method | Query Parameters | Request Body | Response |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `PainterLeaf` | Get model list | `/painter/models` | `GET` | - | - | `application/json` |
| `PainterLeaf` | Generate image | `/painter/generate` | `POST` | - | `prompt`: prompt words<br>`model`: model name<br>If img2img: `image: Array.from(uint8Array)` | `image/png` |
| `PainterLeaf` | Translate prompt words | `/painter/translate` | `POST` | - | `text`: text<br>`source_lang`: source language<br>`target_lang`: target language | `application/json` |
| `MyHomepage` | qWeather | `/weather` | `GET` | `location`: `longitude,latitude` | - | `application/json` |
| `CounselorLeaf` | Chat | `/counselor/chat` | `POST` | - | `messages`: message list, excluding system messages | `application/json` |
| `PainterLeaf` | Generate text from image | `/painter/genprompt` | `POST` | - | `image: Array.from(uint8Array)` | `application/json` |
| `Others` | Count visits | `/count` | `GET` | - | - | `text/javascript` |
| `Others` | Count visits | `/count` | `POST` | - | `hostname`: domain name<br>`unique`: whether to count as unique visitors | `application/json` |
| `Others` | Show README | `/` | `GET` | - | - | `text/html` |
| `FileBox` | Upload file | `/filebox/upload` | `POST` | - | `key`: pickup code<br>`filename`: file name<br>`password`: upload password<br>`file`: base64 encoded file | `application/json` |
| `FileBox` | Download file | `/filebox/download` | `POST` | - | `key`: pickup code<br>`password`: download password<br>`shouldDelete`: whether to delete the file<br>`filetype`: `file` or `text` | `application/json` |