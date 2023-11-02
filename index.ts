import * as fs from 'node:fs';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Compressor } from './models/Compressor';


const rl = readline.createInterface({input, output});
const map = new Map();

if(process.argv.length < 3){
    console.error("Invalid use of commands");
    informUsage();
    process.exit(1);
}

const command = process.argv[2];
if(command === "--compress"){
    if(process.argv.length!==5){
        console.error("Input and output file required")
    }

    compressInput()
}else if(command === "--decompress"){
    if(process.argv.length!==5){
        console.error("Input and output file required")
    }

    decompressInput()
}

function informUsage() {
    const text = `
    Usage
      compress
          npx ts-node index.ts --compress <input_file> <output_file>
      decompress
          npx ts-node index.ts --decompress <compressed_file> <output_file>
  `;
    console.log(text);
  }
 
function compressInput(): void{
   const inputFile = process.argv[3];
   const outputFile = process.argv[4];
    if(inputFile && outputFile){
        try {
            const compressor = Compressor.getInstance();
            compressor.process(inputFile, outputFile);
            return;
            
        } catch (error) {
            throw new Error("Cannot open the file, please check if file exists.")
        }
    }
}

function decompressInput(): void{
    const inputFile = process.argv[3];
    const outputFile = process.argv[4];
     if(inputFile && outputFile){
         try {
             const compressor = Compressor.getInstance();
             compressor.process(inputFile, outputFile);
             return;
             
         } catch (error) {
             throw new Error("Cannot open the file, please check if file exists.")
         }
     }
}



