import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { marked } from 'marked'

const markdown: string = readFileSync(resolve(import.meta.dirname, '../../README_ZH.md'), 'utf-8')
const html: string = await marked(markdown)
const oldTsx: string = readFileSync(resolve(import.meta.dirname, './Page.tsx'), 'utf-8')
const newTsx: string = oldTsx.replace(/\/\/ start html[\s\S]*\/\/ end html/, `// start html\nconst html: string = \`\n${html}\n\`\n// end html`)
writeFileSync(resolve(import.meta.dirname, './Page.tsx'), newTsx)