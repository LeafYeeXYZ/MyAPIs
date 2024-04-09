// 引入 Hono
import { Hono } from 'hono'
const app = new Hono()

// 赛博画师小叶子: 获取模型列表
import { painter_models } from './routes/painter_models'
app.get('/painter/models', painter_models)
// 赛博画师小叶子: 生成图片
import { painter_generate } from './routes/painter_generate'
app.get('/painter/generate', painter_generate)

// 404
app.all('*', () => new Response('请求路径错误 / Not Found', { status: 404 }))

// 导出应用
export default app