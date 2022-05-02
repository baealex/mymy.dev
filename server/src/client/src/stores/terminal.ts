import { iRemember } from '@lib/i-remember';
import { createStore } from 'badland';

export const terminalStore = createStore({
    data: '',
});

iRemember('mymydev__terminal', terminalStore);