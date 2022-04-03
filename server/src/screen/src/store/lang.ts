import { createStore } from '../lib/store';
import type { Lang } from '../types';

export const langStore = createStore({
    data: 'c' as Lang,
});