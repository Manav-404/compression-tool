import * as fs from 'node:fs';
import { HuffmanTree } from './HuffmanTree';
import FastPriorityQueue from 'fastpriorityqueue';

export class Compressor {
    private fileName: string;
    private lookupTable: Map<string, string> | null = null

    constructor(file: string){
        this.fileName = file;
    }

    public process(): this{
        const map = new Map();
        const stream  = fs.createReadStream(process.cwd() + `/data/${this.fileName}`);
        stream.on("data", (chunk)=>{
            this.countCharacters(chunk.toString(), map);
        })
        stream.on("close", ()=>{
            this.initialiseHuffmanTree(map);
        })

        return this;
    }

    private initialiseHuffmanTree(map: Map<string, number>){
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

        for(let [key,value] of this.lookupTable?.entries()!){
            console.log(`${key}:`, value)
        }
    }

    private countCharacters(chunk: string, map: Map<string, number>){
        const characters = chunk.split("");
        for(let character of characters){
            if(map.has(character)){
                map.set(character, map.get(character)!+1);
            }else{
                map.set(character, 1);
            }
        }
    }

}