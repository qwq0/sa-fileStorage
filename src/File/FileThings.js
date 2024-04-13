import fs from 'fs';
import path from 'path';

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

        const folder = file.filename.substring(0, 2);
        const uploadPath = `data/storage/image/${folder}/`;
        const filePath = path.join(uploadPath, `${file.filename}`);

        fs.mkdir(uploadPath, { recursive: true }, (err) =>
        {
            if (err)
            {
                console.error('无法创建目标目录:', err);
                saveresult.status = false;
                saveresult.message = '无法创建目标目录';
                return Promise.reject(saveresult);
            }
            fs.writeFile(filePath, file.buffer, (err) =>
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
}