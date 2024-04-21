import { Model, Sequelize } from '@sequelize/core';
import { Select } from '../database/Select.js';
import { FileThings } from '../File/FileThings.js';
import fs from 'fs';

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
        const threehour = 1000 * 60 * 60 * 3;
        const interval = setInterval(async () =>
        {
            await this.regCheckDel(databaseObject);
        }, threehour);
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
                const Filethings = new FileThings();
                const fp = Filethings.getFilePath(item.dataValues.fileName);
                fs.unlink(fp.filePath, (err) =>
                {
                    if (err)
                    {
                        console.error('无法删除文件:', err);
                        return Promise.reject('无法删除文件');
                    } else {
                        fs.readdir(fp.uploadPath, (err, files) => {
                            if(files.length === 0) {
                                fs.rmdir(fp.uploadPath, (err) => {
                                    if (err) {
                                        console.error('无法删除目录:', err);
                                        return Promise.reject('无法删除目录');
                                    }
                                })
                            }
                        })
                    }
                });

                await databaseObject.quoteTable.destroy({ where: { fileName: item.dataValues.fileName } });
                await databaseObject.resourceTable.destroy({ where: { id: item.dataValues.fileName } });
                

                
            }

        }

    }



}