import * as fs from 'node:fs';
import { HuffmanTree } from './HuffmanTree';
import FastPriorityQueue from 'fastpriorityqueue';

export class Compressor {
    private static compressor: Compressor | null = null
    private lookupTable: Map<string, string> | null = null

    private constructor(){
    }

    public static getInstance(): Compressor{
        if(this.compressor===null){
            return new Compressor();
        }
        return this.compressor;
    }

    public process(inputFile: string, outputFile: string): this{
        const map = new Map();
        if(!fs.existsSync(inputFile) || !fs.existsSync(outputFile)){
            console.error("File path for input or output file doesn't exist.")
        }
        const stream  = fs.createReadStream(inputFile);
        let text = '';
        stream.on("data", (chunk)=>{
            text+=chunk
            this.countCharacters(chunk.toString(), map);
        })
        stream.on("close", ()=>{
            this.initialiseHuffmanTree(map, text, outputFile);
        })

        return this;
    }

    public decompress(): void{
        
    }

    private initialiseHuffmanTree(map: Map<string, number>, text: string, outputFile: string){
        const minPriorityQueue = new FastPriorityQueue((node1: HuffmanTree, node2: HuffmanTree)=>{
            let weight1 = node1.weight();
            let weight2 = node2.weight();

            return weight1 < weight2;
        })
        for(let [key, value] of map.entries()){
            const leafNode = HuffmanTree.buildLeafNode(key, value);
            minPriorityQueue.add(leafNode);
        }
        this.lookupTable = HuffmanTree.buildTree(minPriorityQueue);
        this.compressAndWrite(this.lookupTable, text, outputFile);

    }

    private countCharacters(chunk: string, map: Map<string, number>){
        let groupCharacters = ''
        for(let i=0; i<chunk.length; i++){
            let character = chunk.charAt(i);
            groupCharacters+=character;
            if(groupCharacters.length===2){
                map.set(groupCharacters, (map.get(groupCharacters) ?? 0)+1)
                groupCharacters=""
            }
        }
    }

    private compressAndWrite(lookupTable: Map<string, string>| null, text:string, outputFile: string){
        let header = JSON.stringify(Array.from(lookupTable!.entries()));
        const headerUint8Array = new TextEncoder().encode(header);
        const headerLength = headerUint8Array.length*8;
        const headerbytes = Number(headerLength).toString(2);
        const path = outputFile;
        let textBits = '';
        let groupTextBits = '';
        for(let char of text){
            groupTextBits+=char;
            if(groupTextBits.length===2){
                textBits+=lookupTable?.get(groupTextBits);
                groupTextBits = '';
            }
        }
        const [compressedTextUint8, padding] = this.getUint8TextArray(textBits);
        fs.writeFileSync(path, headerbytes + '\n');
        fs.appendFileSync(path, padding.toString()+'\n');
        fs.appendFileSync(path, headerUint8Array);
        fs.appendFileSync(path, '\n');
        fs.appendFileSync(path, compressedTextUint8);
        console.log("The file is now compressed");
        process.exit(0)
    }

    private getUint8TextArray(textBits: string): [Uint8Array, number]{
        let bits = textBits;

        while(bits.length%8!==0){
            bits+='0';
        }

        const bytes = bits.length / 8;
        const padding = bits.length - textBits.length;
        let bitsArray = new Uint8Array(bytes);

        for(let index=0; index<bytes; index++){
            const start = index*8;
            const end = start + 8;
            const text = bits.slice(start, end);
            bitsArray[index] = parseInt(text, 2);
        }

        return [bitsArray, padding];
    }

}