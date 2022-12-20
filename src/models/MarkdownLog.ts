
class MarkdownLog {
    // `_entries` property is a list of Markdown strings
    _entries: string[] = [];

    // `entries` getter returns the list of Markdown strings
    get entries(): string[] {
        return this._entries;
    }

    // `add` method adds a new entry to the list
    add(entry: string) {
        this._entries.push(entry);
    }
    // add(entry: string) {
    //     this.entries.push(entry);
    // }



    //   constructor(public markdown: string) {
    //     super();
    //   }
}

export default MarkdownLog;
