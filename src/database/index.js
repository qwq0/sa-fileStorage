import { Sequelize, DataTypes  } from "@sequelize/core";

export class Database
{
    constructor()
    {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: './database/database.sqlite',
            logging: false
        });
        this.init();
    }

    async init()
    {
        try
        {
            await this.sequelize.authenticate();
        } catch (error)
        {
            console.error('Unable to connect to the database:', error);
        }
    }

    async ResourceTable(){
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
        })
        await this.sequelize.sync({ alter: true });
        return resourceTable;
    }

}