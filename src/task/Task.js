import Sequelize, { Model } from '@sequelize/core';
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

    }

    /**
     * 
     * @param {{connect: Sequelize;resourceTable: import('@sequelize/core').ModelStatic<Model<any, any>>;quoteTable: import('@sequelize/core').ModelStatic<Model<any, any>>;}} databaseObject 
     * @returns 
     */
    regCheckDel(databaseObject)
    {
        const select = new Select();

    }



}