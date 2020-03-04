export class TextLine {
  text = '';
  indentLevel = 0;
  
  constructor(text: string) {
    this.text = text;
  }
}

export class TextEntryModel {
  lines: TextLine[] = [];
  
  setText = (text: string) => {
    // break the string into lines
    const linesOfText = text.split('\n');
    this.lines.length = 0;
    linesOfText.forEach(text => {
      // create the line
      const line = new TextLine('');
      const components = text.split(':');
      // if no colon
      if (components.length === 1) {
        line.text = components[0];
        line.indentLevel = 0;
      } else {
        line.text = components[1];
        line.indentLevel = Number(components[0]);
      }
      // add it to our lines
      this.lines.push(line);
    });

    /*
        // todo trim whitespace at line end
        this.lines = linesOfText.map(text => new TextLine(text));

        // todo lines should be in the format {number}:{text} where number represents the indent level
        // then we'll split on the colon and store the lines'
    */

  };

  getText = (): string => this.lines.map(l => l.text).join('\n');

  getLinesCount = (): number => this.lines.length;

  // get 0-indexed line
  getLineAtIndex = (i: number): TextLine => this.lines[i];

  // get 1-indexed line
  getLineWithNumber = (i: number): TextLine => this.lines[i - 1];

}

export default TextEntryModel;
