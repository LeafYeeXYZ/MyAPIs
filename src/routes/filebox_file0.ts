import { Context } from 'hono'
import { f0 } from 'file0'

type FileBoxQuery = {
  type: 'upload' | 'download'
  key: string
  password: string
  filename?: string
}

export async function filebox_file0(c: Context): Promise<Response> {

  const data = await c.req.json()
  if (!data) {
    return new Response('Bad Request', { status: 400 })
  }

  const { type, key, password, filename }: FileBoxQuery = data

  if (type === 'upload') {
    if (password !== c.env.FILEBOX_UPLOAD_PW) {
      return new Response('上传密码错误', { status: 403 })
    }
    const fileToken = await f0.createToken(filename!, {
      expiresIn: '30min',
      maxUploadSize: '70mb'
    })
    const keyToken = await f0.createToken(key, {
      expiresIn: '30min',
      maxUploadSize: '5kb'
    })
    return new Response(JSON.stringify({ fileToken, keyToken }))

  } else if (type === 'download') {
    if (password !== c.env.FILEBOX_DOWNLOAD_PW) {
      return new Response('下载密码错误', { status: 403 })
    }
    const keyMeta = await f0.get(key)
    if (!keyMeta) {
      return new Response('文件不存在', { status: 404 })
    }
    const file = await f0.get(key, { as: 'text' })
    const fileMeta = await f0.get(file!)
    if (!fileMeta) {
      return new Response('文件不存在', { status: 404 })
    }
    const keyToken = await f0.createToken(key, {
      expiresIn: '30min',
      maxUploadSize: '5kb'
    })
    const fileToken = await f0.createToken(file!, {
      expiresIn: '30min',
      maxUploadSize: '5kb'
    })
    return new Response(JSON.stringify({ keyToken, fileToken }))
  }
  return new Response('Bad Request', { status: 400 })
}