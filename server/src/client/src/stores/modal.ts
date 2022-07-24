import { createStore } from 'badland'
import { rememberOnStorage } from 'badland/dist/plugin'

export const modalStore = createStore({
    github: false,
    setting: false,
})

rememberOnStorage('mymydev__modal', modalStore)
