import { Context } from 'hono'
import { R2Bucket } from '@cloudflare/workers-types'

export async function filebox_download(c: Context): Promise<Response> {
  const r2 = c.env.filebox as R2Bucket
  try {
    const { key, password, shouldDelete } = await c.req.json()
    if (password !== c.env.FILEBOX_DOWNLOAD_PW) {
      return c.text('下载密码错误', 403)
    }
    const data = await r2.get(key)
    if (!data) {
      return c.text('文件不存在', 404)
    }
    if (shouldDelete) {
      await r2.delete(key)
    }
    const { file, filename } = await data.json() as { file: string, filename: string }
    return new Response(file, {
      headers: {
        'Content-Length': `${file.length}`,
        'Content-Disposition': `attachment; filename="${encodeURI(filename)}"`,
      },
    })
  } catch (e) {
    if (e instanceof Error) {
      return c.text(`下载失败: ${e.message}`, 500)
    } else {
      return c.text(`下载失败: ${JSON.stringify(e)}`, 500)
    }
  }
}