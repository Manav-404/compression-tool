import * as fs from 'node:fs';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Compressor } from './models/Compressor';


const rl = readline.createInterface({input, output});
const map = new Map();

async function commandInput(): Promise<void>{
    const file = await rl.question("Please input filename to compress ");
    const extension = file.split(".");
    if(!extension){
        throw new Error("Please provide filename with extension");
    }
    if(file){
        try {
            const compressor = new Compressor(file).process()
            return;
            
        } catch (error) {
            throw new Error("Cannot open the file, please check if file exists.")
        }
    }
}



commandInput();
