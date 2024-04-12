import crypto from 'crypto';

export class Md5things{
    calculateMd5(data) {
        const hash = crypto.createHash('md5');
        hash.update(data);
        return hash.digest('hex');
    }
}