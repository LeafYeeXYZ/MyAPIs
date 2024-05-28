import { Hono } from 'hono'
import { MongoClient } from 'npm:mongodb'
import { cors } from 'hono/cors'


const client = new MongoClient(Deno.env.get('SERVER')!)
const db = client.db(Deno.env.get('DB')!)
const coll = db.collection(Deno.env.get('COLLECTION')!)

const app = new Hono()

app.use('*', cors())

app.get('/submit', async (c) => {
  try {
    // 获取查询字符串中的 data 中的 json 字符串
    const json = c.req.query('data')
    if (!json) throw new Error('Missing data')
    const data = JSON.parse(json)
    // 插入数据
    const result = await coll.insertOne(data)
    // 返回数据
    return c.json(result)
  } catch (error) {
    return c.json({ 
      massage: '数据上传失败',
      error, 
    }, 500)
  }
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
