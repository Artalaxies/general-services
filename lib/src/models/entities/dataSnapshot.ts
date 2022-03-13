


export class DataSnapshot<T> {

    /** True if the document exists. */
    /** True if the document exists. */

    readonly exists: boolean = false;


    /**
     * Retrieves all fields in the document as an Object. Returns 'undefined' if
     * the document doesn't exist.
     */
     readonly data?: () => T;

    /**
     * The time the document was created. Not set for documents that don't
     * exist.
     */
     readonly createTime?: number;


    /**
     * The time this snapshot was read.
     */
    protected readTime?: number;


    constructor(data?: () => T, exists: boolean = false) {
        this.exists = exists
        if(data !== undefined){
            this.data = () => {
                this.readTime = Date.now()
                return data();
            }
        }
    
        this.createTime = Date.now()
      }
}