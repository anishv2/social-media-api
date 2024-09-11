import fs from 'fs';
import path from 'path';
import { lang } from '../constants/constant.js';
import { IMessageReader } from '../interfaces/index.js';


const readKeys=(obj:any,key1:string,key2:string):string =>{
    return obj[key1][key2];
}

const resMessage:IMessageReader={
    message:null,
    readMessageFile(){
        const __dirname=path.resolve();        
        const fullPath=path.join(__dirname,'src','shared','i18n',lang.DEFAULT_LANG+'.json');
        const buffer=fs.readFileSync(fullPath); // read JSON file
        this.message=JSON.parse(buffer.toString()); // convert JSON into object
    },
    readMessage(key1:string,key2:string): string {
        if(this.message===null){
            this.readMessageFile();
        }
        return readKeys(this.message,key1,key2);
    }
}

export default resMessage;