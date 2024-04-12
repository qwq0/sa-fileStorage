import { Database } from "./index.js";

export class Insert extends Database
{
    constructor()
    {
        super();
    }

    /**
     * 插入资源到数据库
     * @param {string} id - 资源的ID (资源的名)
     * @param {string} ip - 用户的IP地址
     * @param {Date} expired - 过期时间
     * @returns {Promise<void>} - 插入操作的 Promise 对象
     */
    async insertResource(id, ip, expired)
    {
        const t = await this.sequelize.startUnmanagedTransaction();
        try
        {
            const resourceTable = await this.resourceTable();
            const quoteTable = await this.quoteTable();
            const resource = await resourceTable.create({
                id: id,
                ip: ip
            },{transaction: t});

            const quote = await quoteTable.create({
                expired: expired,
                fileName: id
            }, {transaction: t});
            await t.commit();
            return Promise.resolve();
        } catch (error)
        {
            console.error('Unable to insert to the database:', error);
            await t.rollback();
            return Promise.reject(error);
        }
    }
}