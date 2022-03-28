/* eslint-disable require-jsdoc */


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

  readonly status: number;

  /**
     * The time this snapshot was read.
     */
  protected readTime?: number;

  /**
     * message about the data.
     */
  protected message?: string;

  constructor(exists = false, status = 0, data?: () => T, message?: string) {
    this.exists = exists;
    this.status = status;
    this.message = message;
    if (data !== undefined) {
      this.data = () => {
        this.readTime = Date.now();
        return data();
      };
    }

    this.createTime = Date.now();
  }
}
