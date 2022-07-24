import { createStore } from 'badland'
import { rememberOnStorage } from 'badland/dist/plugin'

import type { Lang } from '../types'

export const langStore = createStore({
    data: 'c' as Lang,
})

rememberOnStorage('mymydev__lang', langStore)
