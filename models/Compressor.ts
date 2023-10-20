import * as fs from 'node:fs';

export class Compressor {
    private fileName: string;
    private stream: fs.ReadStream;

    constructor(file: string){
        this.fileName = file;
        this.stream  = fs.createReadStream(process.cwd() + `/data/${this.fileName}`);
        console.log(this.stream)
    }
    public compress(): void{
        const map = new Map();
        this.stream.on("data", (chunk)=>{
            this.countCharacters(chunk.toString(), map);
        })
        this.stream.on("close", ()=>{
            this.printCharacterCount(map);
        })
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

    private printCharacterCount(map: Map<string, number>){
        for(let [key, value] of map.entries()){
            console.log(`${key} :=`, value);
        }
    }

}