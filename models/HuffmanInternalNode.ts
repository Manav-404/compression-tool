
export class HuffmanInternalNode {

    private wt: number;
    private left: HuffmanInternalNode | null = null;
    private right: HuffmanInternalNode | null = null;
    private element: string| null


    constructor(left: HuffmanInternalNode | null, right: HuffmanInternalNode | null, weight: number, element: string | null){
        this.wt = weight;
        this.left = left;
        this.right = right
        this.element = element;
    }

    public leftNode():HuffmanInternalNode | null{
        return this.left;
    }

    public rightNode():HuffmanInternalNode | null {
        return this.right;
    }

    public char(): string | null{
        return this.element;
    }
    public weight(): number {
        return this.wt
    }

}