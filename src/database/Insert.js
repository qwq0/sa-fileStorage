import { Model, Sequelize } from "@sequelize/core";
import { Database } from "./index.js";

export class Insert
{

    /**
     * 插入资源到数据库
     * @param {string} id - 资源的ID (资源的名)
     * @param {string} ip - 用户的IP地址
     * @param {number} size - 资源的大小
     * @param {Date} expired - 过期时间
     * @param {{connect: Sequelize;resourceTable: import('@sequelize/core').ModelStatic<Model<any, any>>;quoteTable: import('@sequelize/core').ModelStatic<Model<any, any>>;}} databaseObject
     * @returns {Promise<void>} - 插入操作的 Promise 对象
     */
    async insertResource(id, ip, size, expired, databaseObject)
    {
        const t = await databaseObject.connect.startUnmanagedTransaction();
        try
        {
            await databaseObject.resourceTable.create({
                id: id,
                ip: ip,
                size: size
            },{transaction: t});

            await databaseObject.quoteTable.create({
                expired: expired,
                fileName: id
            }, {transaction: t});
            await t.commit();
        } catch (error)
        {
            console.error('Unable to insert to the database:', error);
            await t.rollback();
            throw new Error('Unable to insert to the database');
        }
    }
}