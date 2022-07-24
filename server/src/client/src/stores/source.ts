import { createStore } from 'badland'
import { rememberOnStorage } from 'badland/dist/plugin'

export const sourceStore = createStore({
    data: '',
})

rememberOnStorage('mymydev__source', sourceStore)
