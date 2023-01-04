export type { Lang } from './modules/code'

export type EventListener<T = Event, K = HTMLElement> = T & {
  target: K
}
