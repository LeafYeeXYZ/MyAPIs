// 引入 Hono
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { upgradeWebSocket } from 'hono/cloudflare-workers'
import { R2Bucket } from '@cloudflare/workers-types'
const app = new Hono()

// WebSocket
type FileBoxUploadData = {
  /** 当前块 */
  index: number
  /** 总块数 */
  max: number
  /** 文件数据 */
  data: number[]
  /** 取件码 */
  key: string
  /** 上传密码 */
  password: string
  /** 文件名 */
  filename: string
}
type FileBoxDownloadData = {
  /** 取件码 */
  key: string
  /** 下载密码 */
  password: string
  /** 是否下载后删除 */
  shouldDelete: boolean
}
// 文件快递柜：上传文件
app.get('/filebox/upload/ws', upgradeWebSocket((c) => {
  const r2 = c.env.filebox as R2Bucket
  let file: number[] = []
  return {
    async onMessage(event, ws) {
      try {
        const { index, max, data, key, password, filename }: FileBoxUploadData = JSON.parse(event.data as string)
        if (password !== c.env.FILEBOX_UPLOAD_PW) {
          throw new Error('上传密码错误')
        } else if (index < max && index >= 0) {
          file = [...file, ...data]
          ws.send('continue')
        } else if (index === max) {
          file = [...file, ...data]
          // 保存文件
          await r2.put(key, JSON.stringify({ file, filename }))
          ws.send('success')
          ws.close()
        } else {
          throw new Error('Invalid index')
        }
      } catch (e) {
        if (e instanceof Error) {
          ws.send(e.message)
        } else {
          ws.send(`服务端未知错误: ${JSON.stringify(e)}`)
        }
        ws.close()
      }
    },
  }
}))
// 文件快递柜：下载文件
app.get('/filebox/download/ws', upgradeWebSocket((c) => {
  const r2 = c.env.filebox as R2Bucket
  const chunkSize = 1024 * 256
  let data: number[] = []
  let filename = ''
  let i = 0
  let max = 0
  return {
    async onMessage(event, ws) {
      try {
        const { key, password, shouldDelete }: FileBoxDownloadData = JSON.parse(event.data as string)
        if (password !== c.env.FILEBOX_DOWNLOAD_PW) {
          throw new Error(JSON.stringify({ data: [], filename: '', index: -1, max: -1, error: '下载密码错误' }))
        }
        if (data.length < 1) {
          const file = await r2.get(key)
          if (!file) {
            throw new Error(JSON.stringify({ data: [], filename: '', index: -1, max: -1, error: '取件码不存在' }))
          } else {
            const temp = JSON.parse(await file.text())
            data = [...data, ...temp.file]
            filename = temp.filename
            max = Math.ceil(temp.file.length / chunkSize)
          }
        }
        if (i <= max) {
          ws.send(JSON.stringify({
            index: i,
            max: max - 1,
            data: data.slice(i * chunkSize, ((i + 1) * chunkSize) > data.length ? data.length : (i + 1) * chunkSize),
            filename
          }))
          i += 1
        }
        if (i === max) {
          if (shouldDelete) {
            await r2.delete(key)
          }
          ws.close()
        }

      } catch (e) {
        if (e instanceof Error) {
          ws.send(e.message)
        } else {
          ws.send(JSON.stringify({ data: [], filename: '', index: -1, max: -1, error: '服务端未知错误' }))
        }
        ws.close()
      }
    },
  }
}))

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
// 访问量统计
import { count_get, count_post } from './routes/count'
app.get('/count', count_get)
app.post('/count', count_post)

// 主页
import { index } from './components/Page'
app.get('/', index)

// 404
app.all('*', () => new Response('请求路径错误 / Not Found', { status: 404 }))

// 导出应用
export default app