class TextLine {
  text = '';
  indentLevel = 0;

  constructor(text: string) {
    this.text = text;
  }
}

class TextEntryModel {
  lines: TextLine[] = [];

  setText = (text: string) => {
    // break the string into lines
    const linesOfText = text.split('\n');
    // todo trim whitespace at line end
    this.lines = linesOfText.map(text => new TextLine(text));
  };

  getText = (): string => this.lines.map(l => l.text).join('\n');

  getLinesCount = (): number => this.lines.length;

  // get 0-indexed line
  getLineAtIndex = (i: number): TextLine => this.lines[i];

  // get 1-indexed line
  getLineWithNumber = (i: number): TextLine => this.lines[i - 1];

}

export default TextEntryModel;
