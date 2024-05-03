import { Model, Sequelize } from "@sequelize/core";

export class Update
{

    /**
     * 插入资源到数据库
     * @param {string} uuid - 资源的ID (资源的名)
     * @param {Date} expired - 过期时间
     * @param {{connect: Sequelize;resourceTable: import('@sequelize/core').ModelStatic<Model<any, any>>;quoteTable: import('@sequelize/core').ModelStatic<Model<any, any>>;}} databaseObject
     * @returns {Promise<[affectedCount: number]>} - 插入操作的 Promise 对象
     */
    async UpdateQuoteExpired(uuid, expired,databaseObject)
    {
        try
        {
            const quoteTable = databaseObject.quoteTable;
            const res = await quoteTable.update({ expired: expired }, {
                where: {
                    id: uuid
                }
            });
            return res;
        } catch (error)
        {
            console.error('Unable to insert to the database:', error);
            throw new Error('Unable to insert to the database');
        }
    }
}