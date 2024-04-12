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
     * @returns {Promise<void>} - 插入操作的 Promise 对象
     */
    async insertResource(id, ip)
    {
        try
        {
            const resourceTable = await this.ResourceTable();
            const resource = resourceTable.build({
                id: id,
                ip: ip
            });
            console.log('Inserted resource:', resource.toJSON());
            await resource.save();
            return Promise.resolve();
        } catch (error)
        {
            console.error('Unable to insert to the database:', error);
            return Promise.reject(error);
        }
    }
}