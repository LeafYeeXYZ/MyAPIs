// 引入 Hono
import { Hono } from 'hono'
import { cors } from 'hono/cors'
const app = new Hono()
// CORS
app.use('*', cors())

// 赛博画师小叶子: 获取模型列表
import { painter_models } from './routes/painter_models.js'
app.get('/painter/models', painter_models)
// 赛博画师小叶子: 生成图片
import { painter_generate } from './routes/painter_generate.js'
app.get('/painter/generate', painter_generate)
// 浏览器新标签页: 和风天气
import { weather } from './routes/weather.js'
app.get('/weather', weather)
// 赛博画师小叶子: 中译英
import { painter_translate } from './routes/painter_translate.js'
app.post('/painter/translate', painter_translate)

// 404
app.all('*', () => new Response('请求路径错误 / Not Found', { status: 404 }))

// 导出应用
export default app