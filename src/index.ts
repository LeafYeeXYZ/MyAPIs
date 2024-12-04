// 引入 Hono
import { Hono } from 'hono'
import { cors } from 'hono/cors'
const app = new Hono()

// CORS
app.use('*', cors())

// 赛博画师小叶子: 获取模型列表
import { painter_models } from './routes/painter_models'
app.get('/painter/models', painter_models)
// 赛博画师小叶子: 生成图片
import { painter_generate } from './routes/painter_generate'
app.post('/painter/generate', painter_generate)
// 浏览器新标签页: 和风天气
import { weather } from './routes/weather'
app.get('/weather', weather)
// 赛博画师小叶子: 中译英
import { painter_translate } from './routes/painter_translate'
app.post('/painter/translate', painter_translate)
// 咨询师小叶子: 生成对话消息
import { counselor_chat } from './routes/counselor_chat'
app.post('/counselor/chat', counselor_chat)
// 赛博画师小叶子: 图片生成提示词
import { painter_genprompt } from './routes/painter_genprompt'
app.post('/painter/genprompt', painter_genprompt)
import { painter_genprompt_v4 } from './routes/painter_genprompt_v4'
app.post('/painter/genprompt/v4', painter_genprompt_v4)
// 访问量统计
import { count_get, count_post } from './routes/count'
app.get('/count', count_get)
app.post('/count', count_post)
// FileBox: 上传
import { filebox_upload } from './routes/filebox_upload'
app.post('/filebox/upload', filebox_upload)
// FileBox: 下载
import { filebox_download } from './routes/filebox_download'
app.post('/filebox/download', filebox_download)

// 404
app.all('*', () => new Response('请求路径错误 / Not Found', { status: 404 }))

// 导出应用
export default app