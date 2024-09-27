import { Context } from 'hono'
import { R2Bucket } from '@cloudflare/workers-types'
import { ConsoleMessage } from '../console'

export async function filebox_upload(c: Context): Promise<Response> {

  const SUCCESS_MESSAGE: ConsoleMessage = {
    type: 'log',
    route: 'filebox/upload',
    message: 'Filebox Upload Requested Successfully',
    time: new Date().toUTCString(),
    data: {}
  }

  const ERROR_MESSAGE: ConsoleMessage = {
    type: 'error',
    route: 'filebox/upload',
    message: 'Filebox Upload Requested Failed',
    time: new Date().toUTCString(),
    data: {}
  }

  const r2 = c.env.filebox as R2Bucket
  try {
    const key = decodeURI(c.req.header('X-FILEBOX-KEY') ?? '')
    const password = decodeURI(c.req.header('X-FILEBOX-PASSWORD') ?? '')
    const filename = decodeURI(c.req.header('X-FILEBOX-FILENAME') ?? '')
    const filetype = decodeURI(c.req.header('X-FILEBOX-FILETYPE') ?? 'file')
    const file = filetype === 'text' ? await c.req.text() : await c.req.arrayBuffer()
    if (!key || !password || !file || !filetype || (filetype === 'file' && !filename)) {
      return c.text('请求参数错误', 400)
    }
    if (password !== c.env.FILEBOX_UPLOAD_PW) {
      return c.text('上传密码错误', 403)
    }
    await r2.put(key, JSON.stringify({ 
      filename,
      filesize: typeof file === 'string' ? file.length : file.byteLength,
      filetype
    }))
    await r2.put(`${key}.file`, file)
  } catch (e) {
    if (e instanceof Error) {
      ERROR_MESSAGE.data!.error = e.message
      console.error(ERROR_MESSAGE)
      return c.text(`下载失败: ${e.message}`, 500)
    } else {
      ERROR_MESSAGE.data!.error = JSON.stringify(e)
      console.error(ERROR_MESSAGE)
      return c.text(`下载失败: ${JSON.stringify(e)}`, 500)
    }
  }
  console.log(SUCCESS_MESSAGE)
  return c.text('上传成功')
}