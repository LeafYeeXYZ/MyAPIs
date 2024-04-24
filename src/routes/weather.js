/** 
 * 和风天气的代理服务
 * @param {Context} c 上下文对象
 * @returns {application/json} 返回天气数据
 */
export async function weather(c) {
  try {
    const res = await fetch(`https://devapi.qweather.com/v7/weather/3d?location=101010100&key=${c.env.WEATHER_API_KEY}`)
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}