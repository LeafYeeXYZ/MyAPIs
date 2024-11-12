import type { FC } from 'hono/jsx'
import type { Context } from 'hono'

// start html
const html: string = `
<p><strong>中文 | <a href="README.md">English</a></strong></p>
<h1>介绍</h1>
<p>我的自用 <code>Cloudflare Workers</code> <code>API</code> 仓库</p>
<h2>使用方法</h2>
<h3>配置环境变量</h3>
<p>请 <code>Fork</code> 本仓库后, 手动创建 <code>wrangler.toml</code> 文件, 并添加以下内容:</p>
<pre><code class="language-toml">name = &quot;api&quot;
main = &quot;dist/index.js&quot;
compatibility_date = &quot;2024-04-05&quot;
assets = { directory = &quot;public&quot; }

[vars]
KEY = &quot;VALUE&quot;
# 见环境变量

# 仅用于统计访问量, 可不设置
[[d1_databases]]
binding = &quot;count&quot;
database_name = &quot;YOUR_D1_DATABASE_NAME&quot;
database_id = &quot;YOUR_D1_DATABASE_ID&quot;

# 仅用于文件快递柜, 可不设置
[[r2_buckets]]
binding = &quot;filebox&quot;
bucket_name = &quot;YOUR_BUCKET_NAME&quot;

[observability]
enabled = true
</code></pre>
<h3>环境变量</h3>
<ul>
<li><code>CF_USER</code>: <code>Cloudflare</code> 用户 <code>ID</code>, 用于 <code>PainterLeaf</code> 和 <code>CounselorLeaf</code></li>
<li><code>CF_AI_API_KEY</code>: <code>Cloudflare AI</code> 的 <code>API</code> 密钥, 用于 <code>PainterLeaf</code> 和 <code>CounselorLeaf</code></li>
<li><code>HF_API_KEY</code>: <code>Hugging Face</code> 的 <code>API</code> 密钥, 用于 <code>PainterLeaf</code></li>
<li><code>WEATHER_API_KEY</code>: 和风天气的 <code>API</code> 密钥, 用于 <code>MyHomepage</code></li>
<li><code>FILEBOX_UPLOAD_PW</code>: 文件快递柜上传密码, 用于 <code>FileBox</code></li>
<li><code>FILEBOX_DOWNLOAD_PW</code>: 文件快递柜下载密码, 用于 <code>FileBox</code></li>
</ul>
<blockquote>
<p>如果您不需要使用某个功能, 可以不设置对应的环墇变量</p>
</blockquote>
<h3>部署</h3>
<pre><code class="language-bash"># 安装依赖
npm i -g bun
bun i
# 登录 Cloudflare
bunx wrangler login
# 部署
bun dep
</code></pre>
<h2>API 文档</h2>
<table>
<thead>
<tr>
<th align="center">分类</th>
<th align="center">功能</th>
<th align="center">路径</th>
<th align="center">方法</th>
<th align="center">查询参数</th>
<th align="center">请求体</th>
<th align="center">返回值</th>
</tr>
</thead>
<tbody><tr>
<td align="center"><code>PainterLeaf</code></td>
<td align="center">获取模型列表</td>
<td align="center"><code>/painter/models</code></td>
<td align="center"><code>GET</code></td>
<td align="center">-</td>
<td align="center">-</td>
<td align="center"><code>application/json</code></td>
</tr>
<tr>
<td align="center"><code>PainterLeaf</code></td>
<td align="center">生成图片</td>
<td align="center"><code>/painter/generate</code></td>
<td align="center"><code>POST</code></td>
<td align="center">-</td>
<td align="center"><code>prompt</code>: 提示词<br><code>model</code>: 模型名称<br>如果图生图: <code>image: Array.from(uint8Array)</code></td>
<td align="center"><code>image/png</code></td>
</tr>
<tr>
<td align="center"><code>PainterLeaf</code></td>
<td align="center">提示词翻译</td>
<td align="center"><code>/painter/translate</code></td>
<td align="center"><code>POST</code></td>
<td align="center">-</td>
<td align="center"><code>text</code>: 文本<br><code>source_lang</code>: 源语言<br><code>target_lang</code>: 目标语言</td>
<td align="center"><code>application/json</code></td>
</tr>
<tr>
<td align="center"><code>MyHomepage</code></td>
<td align="center">和风天气</td>
<td align="center"><code>/weather</code></td>
<td align="center"><code>GET</code></td>
<td align="center"><code>location</code>: <code>经度,纬度</code></td>
<td align="center">-</td>
<td align="center"><code>application/json</code></td>
</tr>
<tr>
<td align="center"><code>CounselorLeaf</code></td>
<td align="center">聊天</td>
<td align="center"><code>/counselor/chat</code></td>
<td align="center"><code>POST</code></td>
<td align="center">-</td>
<td align="center"><code>messages</code>: 消息列表, 不含系统消息</td>
<td align="center"><code>application/json</code></td>
</tr>
<tr>
<td align="center"><code>PainterLeaf</code></td>
<td align="center">图片生成文字</td>
<td align="center"><code>/painter/genprompt</code></td>
<td align="center"><code>POST</code></td>
<td align="center">-</td>
<td align="center"><code>image: Array.from(uint8Array)</code></td>
<td align="center"><code>application/json</code></td>
</tr>
<tr>
<td align="center"><code>Others</code></td>
<td align="center">访问量统计</td>
<td align="center"><code>/count</code></td>
<td align="center"><code>GET</code></td>
<td align="center">-</td>
<td align="center">-</td>
<td align="center"><code>text/javascript</code></td>
</tr>
<tr>
<td align="center"><code>Others</code></td>
<td align="center">访问量统计</td>
<td align="center"><code>/count</code></td>
<td align="center"><code>POST</code></td>
<td align="center">-</td>
<td align="center"><code>hostname</code>: 域名<br><code>unique</code>: 是否统计为独立访客</td>
<td align="center"><code>application/json</code></td>
</tr>
<tr>
<td align="center"><code>Others</code></td>
<td align="center">显示 <code>README</code></td>
<td align="center"><code>/</code></td>
<td align="center"><code>GET</code></td>
<td align="center">-</td>
<td align="center">-</td>
<td align="center"><code>text/html</code></td>
</tr>
<tr>
<td align="center"><code>FileBox</code></td>
<td align="center">上传文件</td>
<td align="center"><code>/filebox/upload</code></td>
<td align="center"><code>POST</code></td>
<td align="center">-</td>
<td align="center"><code>key</code>: 取件码<br><code>filename</code>: 文件名<br><code>password</code>: 上传密码<br><code>file</code>: base64 编码的文件</td>
<td align="center"><code>application/json</code></td>
</tr>
<tr>
<td align="center"><code>FileBox</code></td>
<td align="center">下载文件</td>
<td align="center"><code>/filebox/download</code></td>
<td align="center"><code>POST</code></td>
<td align="center">-</td>
<td align="center"><code>key</code>: 取件码<br><code>password</code>: 下载密码<br><code>shouldDelete</code>: 是否删除文件<br><code>filetype</code>: <code>file</code> 或 <code>text</code></td>
<td align="center"><code>application/json</code></td>
</tr>
<tr>
<td align="center"><code>Others</code></td>
<td align="center">返回我的头像</td>
<td align="center"><code>/avatar.jpg</code></td>
<td align="center"><code>GET</code></td>
<td align="center">-</td>
<td align="center">-</td>
<td align="center"><code>image/jpeg</code></td>
</tr>
</tbody></table>

`
// end html

const Page: FC = () => { 
  
  return (
    <html>
      <head>
        <title>小叶子的 API 仓库</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.min.css" integrity="sha512-h/laqMqQKUXxFuu6aLAaSrXYwGYQ7qk4aYCQ+KJwHZMzAGaEoxMM6h8C+haeJTU1V6E9jrSUnjpEzX23OmV/Aw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style>{`
          .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
          }

          @media (max-width: 767px) {
            .markdown-body {
              padding: 15px;
            }
          }
        `}</style>
      </head>
      <body>
        <div 
          dangerouslySetInnerHTML={{__html: html}}
          className="markdown-body"
        ></div>        
      </body>
    </html>
  )
}

export async function index(c: Context): Promise<Response> {
  
  return c.html(<Page />)
}
