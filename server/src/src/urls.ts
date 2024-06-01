import { Router } from 'express';
import * as views from './views';

export default Router()
    .get('/api/home', views.home);
