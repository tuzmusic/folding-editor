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
    this.lines = linesOfText.map(text => this.getColonSeparatedIndentLevel(text));
  };

  getColonSeparatedIndentLevel(text: string): TextLine {
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
    return line;
  }

  getText = (): string => this.lines.map(l => l.text).join('\n');

  getLinesCount = (): number => this.lines.length;

  // get 0-indexed line
  getLineAtIndex = (i: number): TextLine => this.lines[i];

  // get 1-indexed line
  getLineWithNumber = (i: number): TextLine => this.lines[i - 1];

}

export default TextEntryModel;
