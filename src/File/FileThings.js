import fs from 'fs';
import path from 'path';

/**
 * @typedef {Object} Config
 * @property {Object} database - Database configuration
 * @property {"sqlite" | "mysql" | "postgres" | "mariadb" | "mssql" | "db2" | "snowflake" | "ibmi"} database.dialect - Database dialect
 * @property {string} database.storage - Database storage path
 * @property {boolean} database.logging - Database logging
 * @property {Object} server - Server configuration
 * @property {string} server.host - Server host
 * @property {number} server.port - Server port
 * @property {string} server.token - Storage configuration
 */

export class FileThings
{

    /**
     * 储存文件
     * @param {Express.Multer.File} file 
     * @returns 
     */
    async trySaveFile(file)
    {
        let saveresult = {
            status: true,
            message: 'Success'
        };

        const fp = this.getFilePath(file.filename);

        fs.mkdir(fp.uploadPath, { recursive: true }, (err) =>
        {
            if (err)
            {
                console.error('无法创建目标目录:', err);
                saveresult.status = false;
                saveresult.message = '无法创建目标目录';
                return Promise.reject(saveresult);
            }
            fs.writeFile(fp.filePath, file.buffer, (err) =>
            {
                if (err)
                {
                    console.error('无法保存文件:', err);
                    saveresult.status = false;
                    saveresult.message = '无法保存文件';
                    return Promise.reject(saveresult);
                }
            });
        });

        return Promise.resolve(saveresult);
    }

    /**
     * 获得文件路径
     * @param {string} filename 
     */
    getFilePath(filename)
    {
        const folder = filename.substring(0, 2);
        const uploadPath = `data/storage/image/${folder}/`;
        const filePath = path.join(uploadPath, `${filename}`);
        const fp = { filePath, uploadPath };
        return fp;
    }

    /**
     * Read and parse configuration from config.json file.
     * @returns {Promise<Config>} Promise object representing the configuration.
     */
    getConfig()
    {
        const configPath = path.resolve('./', 'config.json');

        return new Promise((resolve, reject) =>
        {
            fs.readFile(configPath, 'utf8', (err, data) =>
            {
                if (err)
                {
                    console.error('Error reading config file:', err);
                    reject(err);
                    return;
                }

                try
                {
                    const config = JSON.parse(data);
                    resolve(config);
                } catch (parseError)
                {
                    console.error('Error parsing config file:', parseError);
                    reject(parseError);
                }
            });
        });
    }
}