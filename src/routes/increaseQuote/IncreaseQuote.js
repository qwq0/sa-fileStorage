// src/routes/Register/index.ts
import { Model, Sequelize } from '@sequelize/core';
import express from 'express';
import { Select } from '../../database/Select.js';
import { Update } from '../../database/Update.js';

export class IncreaseQuote
{



    /**
   * 
   * @param {{connect: Sequelize;resourceTable: import('@sequelize/core').ModelStatic<Model<any, any>>;quoteTable: import('@sequelize/core').ModelStatic<Model<any, any>>;}} databaseObject 
   * @param {string} expectedtoken
   * @returns 
   */
    createRouter(databaseObject, expectedtoken)
    {
        const router = express.Router();
        router.post('/increaseQuote', async (req, res) =>
        {
            try
            {
                const token = req.headers.authorization;
                if(token !== expectedtoken) {
                    res.json({ code: -105, message: 'token error' });
                    return;
                }
                const body = req.body;
                if (!body.uuid || !body.time)
                {
                    res.json({ code: -102, message: 'param not complete' });
                    return;
                }
                const ms = parseInt(body.time);
                if (isNaN(ms))
                {
                    res.json({ code: -102, message: 'time must be number' });
                    return;
                }
                const uuid = body.uuid;
                const select = new Select();
                const quoteTableresult = await select.selectByID(uuid, databaseObject.quoteTable);
                if (!quoteTableresult)
                {
                    res.json({ code: -103, message: 'uuid not found' });
                    return;
                }
                
                const expiredDate = new Date(quoteTableresult.dataValues.expired);
                const expiredTime = expiredDate.getTime();
                const newExpired = expiredTime + ms;
                const newExpiredDate = new Date(newExpired);
                const update = new Update();
                const updateResult = await update.UpdateQuoteExpired(uuid, newExpiredDate, databaseObject);
                if (updateResult[0] === 0)
                {
                    res.json({ code: -104, message: 'update failed' });
                    return;
                }
                res.json({ code: 0, message: 'Success', data: { uuid: uuid, newExpiredDate: newExpiredDate } });
            } catch (error)
            {
                res.json({ code: -101, message: 'Error' });
                return;
            }

        });
        return router;
    }
}

