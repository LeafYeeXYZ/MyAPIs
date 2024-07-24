import { Context } from 'hono'
import { R2Bucket } from '@cloudflare/workers-types'

export async function filebox_download(c: Context): Promise<Response> {
  const r2 = c.env.filebox as R2Bucket
  const key = c.req.query('key')!
  const password = c.req.query('password')
  const shouldDelete = c.req.query('delete') === 'true'
  if (password !== c.env.FILEBOX_DOWNLOAD_PW) {
    return c.text('下载密码错误', 403)
  }
  const data = await r2.get(key) as any
  if (!data) {
    return c.text('文件不存在', 404)
  }
  if (shouldDelete) {
    await r2.delete(key)
  }
  const { file, filename } = JSON.parse(data)
  return new Response(file, {
    headers: {
      'Content-Disposition': `attachment; filename="${encodeURI(filename)}"`,
      'Content-Length': file.length.toString(),
    },
  })
}