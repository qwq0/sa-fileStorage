import crypto from 'crypto';

export class Md5things{

    /**
     * 计算MD5值
     * @param {Buffer} data 
     * @returns 
     */
    calculateMd5(data) {
        const hash = crypto.createHash('md5');
        hash.update(data);
        return hash.digest('hex');
    }

}