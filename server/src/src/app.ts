import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import path from 'path';

import router from './urls';

export default express()
    .use(expressWinston.logger({
        transports: [
            new winston.transports.Console()
        ],
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(info => `${[info.timestamp]}: ${info.message} ${JSON.stringify(info.meta)}`),
        ),
        colorize: true,
        expressFormat: true
    }))
    .use(express.json())
    .use(express.static(path.resolve('client/dist'), { extensions: ['html'] }))
    .use(router);
