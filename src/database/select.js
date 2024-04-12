import { Database } from "./index.js";

export class Select extends Database{
    constructor(){
        super();
    }

    async selectResource(id){
        try{
            const resourceTable = await this.resourceTable();
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