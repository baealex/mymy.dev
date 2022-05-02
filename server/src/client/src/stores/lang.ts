import { iRemember } from '@lib/i-remember';
import { createStore } from 'badland';

import type { Lang } from '../types';

export const langStore = createStore({
    data: 'c' as Lang,
});

iRemember('mymydev__lang', langStore);