**[中文](README_ZH.md) | English**

# Introduction
My personal `API` repository

## Usage
### Configure Environment Variables
Please `Fork` this repository, manually create the `wrangler.toml` file, and add the following content:

```toml
name = "api"
main = "src/index.js"
compatibility_date = "2024-04-05"

[vars]
KEY = "VALUE"
# See Environment Variables
```

### Environment Variables
- `CF_USER`: `Cloudflare` user `ID`, for `PainterLeaf`
- `CF_AI_API_KEY`: `Cloudflare AI` `API` key, for `PainterLeaf`
- `HF_API_KEY`: `Hugging Face` `API` key, for `PainterLeaf`
- `WEATHER_API_KEY`: [`qWeather`](https://dev.qweather.com/docs/api) `API` key, for `MyHomepage`

> If you don't need to use a certain feature, it's okay not to set the corresponding environment variable.

### Deployment
```bash
# Install dependencies
npm i -g pnpm
pnpm i
# Login to Cloudflare
pnpm loi
# Deploy
pnpm dep
```

## API Reference
| Category | Function | Path | Method | Query Parameters | Request Body | Response |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `PainterLeaf` | Get model list | `/painter/models` | `GET` | - | - | `application/json` |
| `PainterLeaf` | Generate image | `/painter/generate` | `GET` | `prompt`: prompt words<br>`model`: model name | - | `image/png` |
| `PainterLeaf` | Translate prompt words | `/painter/translate` | `POST` | - | `text`: text<br>`source_lang`: source language<br>`target_lang`: target language | `application/json` |
| `MyHomepage` | qWeather (Beijing) | `/weather` | `GET` | - | - | `application/json` |
