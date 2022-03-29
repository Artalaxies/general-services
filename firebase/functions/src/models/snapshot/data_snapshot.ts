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


  /**
     * state ID.
     */
  readonly stateId: number;

  /**
     * success checking.
     * @return {boolean} nonce numbers.
     */
  isSuccess(): boolean {
    return this.stateId % 10 == 0;
  }

  /**
   * success checking.
   * @return {boolean} nonce numbers.
   */
  isWarning(): boolean {
    return this.stateId % 1000 >= 500 && this.isSuccess();
  }

  /**
     * message about the data.
     */
  readonly message?: string;

  /**
     * The time this snapshot was read.
     */
  protected readTime?: number;

  /**
     * get read time.
     * @return {number} nonce numbers.
  */
  getReadTime(): number | undefined {
    return this.readTime;
  }

  constructor(exists = false, stateId = 0, data?: () => T, message?: string) {
    this.exists = exists;
    this.stateId = stateId;
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
