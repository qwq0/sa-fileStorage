import { Model } from "@sequelize/core";
import { Database } from "./index.js";

export class Select{
    /**
     * 查找资源
     * @param {String} id // 资源的ID (文件名)
     * @param {import('@sequelize/core').ModelStatic<Model<any, any>>} table // 数据库表
     * @returns 
     */
    async selectResource(id, table){
        try{
            const resourceTable = table;
            const resource = await resourceTable.findOne({
                where: {
                    id: id
                }
            });
            return Promise.resolve(resource);
        }catch(error){
            console.error('Unable to select from the database:', error);
            return Promise.reject(error);
        }
    }
}