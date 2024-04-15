import { Sequelize, DataTypes } from "@sequelize/core";

export class Database
{
    constructor()
    {
        
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: './data/database/database.sqlite',
            logging: false
        });
    }

    connectDatabase(){
        return this.sequelize
    }

    async resourceTable()
    {
        const resourceTable = this.sequelize.define('resources', {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                unique: true
            },
            ip: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            size: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        });
        await this.sequelize.sync();
        return resourceTable;
    }

    async quoteTable()
    {
        const resource = await this.resourceTable();
        const quoteTable = this.sequelize.define('quotes', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                unique: true,
                autoIncrement: true
            },
            expired: {
                type: DataTypes.DATE,
                allowNull: false,
                index: true
            },
            fileName:{
                type: DataTypes.STRING,
                allowNull: false,
                index: true,
                unique: true,
                references: {
                    model: resource,
                    key: 'id'
                }
            }

        });
        await this.sequelize.sync();
        return quoteTable;
    }
}