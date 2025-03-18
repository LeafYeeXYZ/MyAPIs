// 引入 Hono
import { Hono } from 'hono'
import { cors } from 'hono/cors'
const app = new Hono()

// CORS
app.use('*', cors())

// 赛博画师小叶子: 生成图片
import { painter_generate } from './routes/painter_generate'
app.post('/painter/generate', painter_generate)
// 浏览器新标签页: 和风天气
import { weather } from './routes/weather'
app.get('/weather', weather)
// 赛博画师小叶子: 中译英
import { painter_translate } from './routes/painter_translate'
app.post('/painter/translate', painter_translate)
// 赛博画师小叶子: 图片生成提示词
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
// 赛博小叶子: 聊天
import { being_chat } from './routes/being_chat'
app.post('/being/chat', being_chat)
// 赛博小叶子: 测试
import { being_test } from './routes/being_test'
app.post('/being/test', being_test)

// 404
app.all('*', () => new Response('请求路径错误 / Not Found', { status: 404 }))

// 导出应用
export default app