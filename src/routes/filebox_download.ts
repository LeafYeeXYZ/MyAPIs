import { Context } from 'hono'
import { R2Bucket } from '@cloudflare/workers-types'
import { ConsoleMessage } from '../console'

export async function filebox_download(c: Context): Promise<Response> {

  const SUCCESS_MESSAGE: ConsoleMessage = {
    type: 'log',
    route: 'filebox/download',
    message: 'Filebox Download Requested Successfully',
    time: new Date().toUTCString(),
    data: {}
  }

  const ERROR_MESSAGE: ConsoleMessage = {
    type: 'error',
    route: 'filebox/download',
    message: 'Filebox Download Requested Failed',
    time: new Date().toUTCString(),
    data: {}
  }

  const r2 = c.env.filebox as R2Bucket
  try {
    const { key, password, shouldDelete, type, filetype } = await c.req.json()
    if (password !== c.env.FILEBOX_DOWNLOAD_PW) {
      ERROR_MESSAGE.data!.error = 'Download Password Error'
      console.error(ERROR_MESSAGE)
      return c.text('下载密码错误', 403)
    }
    if (type === 'meta') {
      const meta = await r2.get(key)
      if (!meta) {
        ERROR_MESSAGE.data!.error = 'File Not Found'
        console.error(ERROR_MESSAGE)
        return c.text('文件不存在', 404)
      }
      console.log(SUCCESS_MESSAGE)
      return c.text(await meta.text())
    } else if (type === 'file') {
      const data = await r2.get(`${key}.file`)
      if (!data) {
        ERROR_MESSAGE.data!.error = 'File Not Found'
        console.error(ERROR_MESSAGE)
        return c.text('文件不存在', 404)
      }
      if (shouldDelete) {
        await r2.delete(key)
        await r2.delete(`${key}.file`)
      }
      console.log(SUCCESS_MESSAGE)
      return new Response(filetype === 'text' ? await data.text() : await data.arrayBuffer())
    }
    ERROR_MESSAGE.data!.error = 'Request Params Error'
    console.error(ERROR_MESSAGE)
    return c.text('请求参数错误', 400)

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
}