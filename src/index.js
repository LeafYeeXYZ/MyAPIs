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
app.post('/painter/generate', painter_generate)
// 浏览器新标签页: 和风天气
import { weather } from './routes/weather.js'
app.get('/weather', weather)
// 赛博画师小叶子: 中译英
import { painter_translate } from './routes/painter_translate.js'
app.post('/painter/translate', painter_translate)
// 咨询师小叶子: 生成对话消息
import { counselor_chat } from './routes/counselor_chat.js'
app.post('/counselor/chat', counselor_chat)
// 赛博画师小叶子: 图片生成提示词
import { painter_genprompt } from './routes/painter_genprompt.js'
app.post('/painter/genprompt', painter_genprompt)

// 404
app.all('*', () => new Response('请求路径错误 / Not Found', { status: 404 }))

// 导出应用
export default app