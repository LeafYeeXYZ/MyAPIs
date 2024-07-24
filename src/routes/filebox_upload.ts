import { Context } from 'hono'
import { R2Bucket } from '@cloudflare/workers-types'

export async function filebox_upload(c: Context): Promise<Response> {
  const r2 = c.env.filebox as R2Bucket
  try {
    const { key, password, filename, file } = await c.req.json()
    if (password !== c.env.FILEBOX_UPLOAD_PW) {
      return c.text('上传密码错误', 403)
    }
    await r2.put(key, JSON.stringify({ file, filename }))
  } catch (e) {
    if (e instanceof Error) {
      return c.text(`下载失败: ${e.message}`, 500)
    } else {
      return c.text(`下载失败: ${JSON.stringify(e)}`, 500)
    }
  }
  return c.text('上传成功')
}