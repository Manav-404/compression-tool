import { HuffmanInternalNode } from "./HuffmanInternalNode";
import FastPriorityQueue from "fastpriorityqueue";

export class HuffmanTree {
    private root: HuffmanInternalNode;
    constructor(element:string | null, weight: number, left: HuffmanInternalNode | null, right:HuffmanInternalNode | null){
        this.root = new HuffmanInternalNode(left, right, weight, element);
        
    }

    public weight(): number {
        return this.root.weight();
    }

    public rootNode(): HuffmanInternalNode | null{
        return this.root;
    }



    static buildLeafNode(key: string, value: number): HuffmanTree{
        return new HuffmanTree(key, value, null, null);
    }

    static buildTree(minHeap: FastPriorityQueue<HuffmanTree>): Map<string, string> | null{
        let firstNode, secondNode, thirdNode = null;
        const lookupTable = new Map<string, string>();
        let index=0;
        while(minHeap.size>1){
            index+=1;
            firstNode = minHeap.poll()!;
            secondNode = minHeap.poll()!;
            thirdNode = new HuffmanTree(null, secondNode ? firstNode.weight() + secondNode.weight(): firstNode.weight(), firstNode.root, !secondNode ? null :secondNode.root)
            minHeap.add(thirdNode);
        }

        this.traverseTree(thirdNode!.rootNode()!, "", lookupTable);
        return lookupTable;
        
    }

    private static traverseTree(node: HuffmanInternalNode | null, prefixStr: string, lookupTable: Map<string, string>): void{
        if(!node || node === null){
            return 
        }

        if(node.leftNode()!==null){
            this.traverseTree(node.leftNode(), prefixStr+="0", lookupTable);
        }
        if(node.leftNode()===null && node.rightNode()===null){
            lookupTable.set(node.char()!, prefixStr);
        }

        if(node.rightNode()!==null){
            this.traverseTree(node.rightNode(), prefixStr+="1", lookupTable);
        }

        return;
    }
}