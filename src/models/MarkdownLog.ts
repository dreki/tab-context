
class MarkdownLog {
    // `_entries` property is a list of Markdown strings
/*     _entries: string[] = [];

    // `entries` getter returns the list of Markdown strings
    get entries(): string[] {
        return this._entries;
    }
 */
    constructor(public entries: string[] = []) {
        console.log("MarkdownLog constructor")
    }

    // `add` method adds a new entry to the list
    add(entry: string) {
        console.log("add entry: " + entry)
        // this._entries.push(entry);
        this.entries.push(entry);
        // console.log(`> entries after: ${this._entries}`)
        console.log(`> entries after: ${this.entries}`)
    }
    // add(entry: string) {
    //     this.entries.push(entry);
    // }

    joinAll() {
        // return this._entries.join("\n");
        return this.entries.join("\n");
    }


    //   constructor(public markdown: string) {
    //     super();
    //   }
}

export default MarkdownLog;
