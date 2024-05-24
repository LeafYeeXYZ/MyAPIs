import { Context } from 'hono'
import { KVNamespace } from '@cloudflare/workers-types'

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
  const kv: KVNamespace = c.env.count
  const current = JSON.parse(await kv.get(hostname) ?? '{"sitePV":0,"siteUV":0}')
  current.sitePV++
  unique && current.siteUV++
  await kv.put(hostname, JSON.stringify(current))
  return c.json({
    sitePV: +current.sitePV + (hostname === 'blog.leafyee.xyz' ? 8050 : 0),
    siteUV: +current.siteUV + (hostname === 'blog.leafyee.xyz' ? 3040 : 0),
  })
}