import { Context } from 'hono'
import { D1Database } from '@cloudflare/workers-types'

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
  const { hostname, unique } = await c.req.json()
  const d1: D1Database = c.env.count
  // 如果不存在则创建表
  await d1.exec(`
    CREATE TABLE IF NOT EXISTS count (
      hostname TEXT PRIMARY KEY,
      sitePV INT,
      siteUV INT
    )
  `)
  // 如果不存在则插入数据
  await d1.exec(`
    INSERT OR IGNORE INTO count (hostname, sitePV, siteUV) VALUES ('${hostname}', 0, 0)
  `)
  // 更新数据
  await d1.exec(`
    UPDATE count SET sitePV = sitePV + 1 WHERE hostname = '${hostname}'
  `)
  unique && await d1.exec(`
    UPDATE count SET siteUV = siteUV + 1 WHERE hostname = '${hostname}'
  `)
  // 查询数据
  const { sitePV, siteUV } = await d1.prepare(`
    SELECT sitePV, siteUV FROM count WHERE hostname = '${hostname}'
  `).first() as { sitePV: number, siteUV: number }
  // 返回数据
  return c.json({
    sitePV: sitePV + (hostname === 'blog.leafyee.xyz' ? 10962 : 0),
    siteUV: siteUV + (hostname === 'blog.leafyee.xyz' ? 4032 : 0),
  })
}