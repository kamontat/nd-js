import { Novel } from "./Novel";

export class Resource {
  novel: Novel;

  constructor(novel: Novel) {
    this.novel = novel;
  }

  /**
   * Load the resource file to this model
   */
  load() {
    // this.novel =
  }

  /**
   * Save the result to resource file
   */
  save() {}
}
