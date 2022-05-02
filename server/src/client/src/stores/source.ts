import { iRemember } from '@lib/i-remember';
import { createStore } from 'badland';

export const sourceStore = createStore({
    data: '',
});

iRemember('mymydev__source', sourceStore);