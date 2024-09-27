/** 日志消息 */
export type ConsoleMessage = {
  /** 与 console.xxx 的类型相同 */
  type: 'log' | 'error' | 'warn' | 'info'
  /** 路由名称 */
  route: string
  /** 日志消息 */
  message: string
  /** 日志时间 - UTC String */
  time: string
  /** 额外信息 */
  data: {
    [key: string]: any
  }
}