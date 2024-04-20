import { Model, Sequelize } from '@sequelize/core';
import { Select } from '../database/Select.js';

export class Task
{

    /**
     * 
     * @param {{connect: Sequelize;resourceTable: import('@sequelize/core').ModelStatic<Model<any, any>>;quoteTable: import('@sequelize/core').ModelStatic<Model<any, any>>;}} databaseObject 
     * @returns 
     */
    init(databaseObject)
    {
        this.regCheckDel(databaseObject);
    }

    /**
     * 
     * @param {{connect: Sequelize;resourceTable: import('@sequelize/core').ModelStatic<Model<any, any>>;quoteTable: import('@sequelize/core').ModelStatic<Model<any, any>>;}} databaseObject 
     * @returns 
     */
    async regCheckDel(databaseObject)
    {
        const select = new Select();
        const quote = await select.selectQuote(databaseObject.quoteTable);
        for (const item of quote)
        {
            const expiredDate = new Date(item.dataValues.expired).getTime();
            // 获取当前日期并转换为时间戳
            const currentDate = new Date().getTime();
            // 检查获取的日期是否比当前日期早
            if (expiredDate < currentDate)
            {
                console.log("获取的日期早于当前日期");
            } else
            {
                console.log("获取的日期晚于或等于当前日期");
            }

        }

    }



}