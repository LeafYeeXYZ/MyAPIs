import type { Context } from 'hono'
import type { ConsoleMessage } from '../console'

type Models = {
  [key: string]: { 
    description: string, 
    type: 'textToImage' | 'imageToImage' | 'both' 
    lang: 'natural' | 'sdPrompt'
  }
}

const MODELS: Models = {
  // 由于这个模型和 Cloudflare 的其他模型返回值不同, 故在 painter_generate.ts 中进行了两处特殊处理
  '@cf/black-forest-labs/flux-1-schnell': { description: '☁️ FLUX.1 Schnell', type: 'textToImage', lang: 'natural' },
  '@cf/stabilityai/stable-diffusion-xl-base-1.0': { description: '☁️ SDXL Base 1.0', type: 'textToImage', lang: 'natural' },
  '@cf/bytedance/stable-diffusion-xl-lightning': { description: '☁️ SDXL Lightning', type: 'textToImage', lang: 'natural' },
  '@hf/black-forest-labs/FLUX.1-schnell': { description: '🤗 FLUX.1 Schnell', type: 'textToImage', lang: 'natural' },
  '@hf/black-forest-labs/FLUX.1-dev': { description: '🤗 FLUX.1 Dev', type: 'textToImage', lang: 'natural' },
  '@hf/stabilityai/stable-diffusion-3.5-large': { description: '🤗 SD 3.5 Large', type: 'textToImage', lang: 'natural' },
  '@hf/cagliostrolab/animagine-xl-3.1': { description: '🤗 AnimagineXL 3.1', type: 'textToImage', lang: 'sdPrompt' },
  '@hf/UnfilteredAI/NSFW-GEN-ANIME-v2': { description: '🤗 NSFWGenAnime', type: 'textToImage', lang: 'sdPrompt' },
  '@cf/runwayml/stable-diffusion-v1-5-img2img': { description: '☁️ StableDiffusion 1.5 Img2Img', type: 'imageToImage', lang: 'sdPrompt' },
}

export function painter_models(c: Context): Response {

  console.log({
    type: 'log',
    route: 'painter/models',
    message: 'Painter Models Requested Successfully',
    time: new Date().toUTCString(),
    data: {}
  } as ConsoleMessage)

  return new Response(JSON.stringify(MODELS), {
    headers: {
      'content-type': 'application/json',
    }
  })
}
