import { Context } from 'hono'
import { D1Database } from '@cloudflare/workers-types'
import { ConsoleMessage } from '../console'

export async function count_get(c: Context): Promise<Response> {
  return c.text(`
      void async function () {
        const script = document.currentScript
        const server = script.getAttribute('src')
        const hostname = window.location.hostname
        let expire = localStorage.getItem('expire') ? +localStorage.getItem('expire') : 0
        let unique = false
        if (!expire || (Date.now() > expire)) {
          expire = Date.now() + 1000 * 60 * 60 * 12
          localStorage.setItem('expire', expire)
          unique = true
        }
        const res = await fetch(server, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ hostname, unique })
        })
        const data = await res.json()
        document.querySelector('#busuanzi_value_site_pv').textContent = data.sitePV
        document.querySelector('#busuanzi_value_site_uv').textContent = data.siteUV
      }()
    `, 
    200,
    {
      'Content-Type': 'application/javascript',
    }
  )
}

export async function count_post(c: Context): Promise<Response> {

  const SUCCESS_MESSAGE: ConsoleMessage = {
    type: 'log',
    route: 'count',
    message: 'Count Requested Successfully',
    time: new Date().toUTCString(),
    data: {}
  }

  const ERROR_MESSAGE: ConsoleMessage = {
    type: 'error',
    route: 'count',
    message: 'Count Requested Failed',
    time: new Date().toUTCString(),
    data: {}
  }

  try {
    const { hostname, unique } = await c.req.json()
    const d1: D1Database = c.env.count // SQLite数据库
    // 如果不存在则创建表
    await d1.exec(`create table if not exists count (hostname text primary key, sitePV int, siteUV int)`)
    // 如果不存在则插入数据
    await d1.exec(`insert or ignore into count (hostname, sitePV, siteUV) values ('${hostname}', 0, 0)`)
    // 更新数据
    await d1.exec(`update count set sitePV = sitePV + 1 where hostname = '${hostname}'`)
    unique && await d1.exec(`update count set siteUV = siteUV + 1 where hostname = '${hostname}'`)
    // 查询数据
    const { sitePV, siteUV } = await d1.prepare(`select sitePV, siteUV from count where hostname = '${hostname}'`).first() as { sitePV: number, siteUV: number }
    // 返回数据
    SUCCESS_MESSAGE.data!.hostname = hostname
    console.log(SUCCESS_MESSAGE)
    return c.json({
      sitePV: sitePV + (hostname === 'blog.leafyee.xyz' ? 10962 : 0),
      siteUV: siteUV + (hostname === 'blog.leafyee.xyz' ? 4032 : 0),
    })
  } catch(e) {
    const message = e instanceof Error ? e.message : 'Unkown Server Error'
    ERROR_MESSAGE.data!.error = message
    console.error(ERROR_MESSAGE)
    return c.text(message, { status: 500 })
  }
}