import { iRemember } from '@lib/i-remember';
import { createStore } from 'badland';

export const modalStore = createStore({
    github: false,
    setting: false,
});

iRemember('mymydev__modal', modalStore);