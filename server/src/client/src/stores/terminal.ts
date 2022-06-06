import { createStore } from 'badland';
import { rememberOnStorage } from 'badland/dist/plugin';

export const terminalStore = createStore({
    data: '',
});

rememberOnStorage('mymydev__terminal', terminalStore);
