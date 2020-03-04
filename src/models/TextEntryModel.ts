export class TextLine {
  text = '';
  indentLevel = 0;
  folded = false;
  model: TextEntryModel; // the document the line belongs to

  constructor(model: TextEntryModel, text?: string) {
    this.model = model;
    this.text = text ?? '';
  }

  get index(): number {
    return this.model.lines.indexOf(this);
  }

  fold = () => {
    this.model.foldLineAtIndex(this.index);
    console.table(this.model.lines.map((line, i) => line.folded));
  };
}

type LineParserFunction = (text: string) => TextLine

export class TextEntryModel {
  lines: TextLine[] = [];

  setText = (text: string) => {
    // break the string into lines
    const linesOfText = text.split('\n');
    this.lines = linesOfText.map(text => this.getColonSeparatedIndentLevel(text));
  };

  foldLineAtIndex = (index: number) => {
    // we're actually folding all the "children" of this line.
    const startingLine = this.getLineAtIndex(index);
    let previousIndentLevel = startingLine.indentLevel;
    // start with the next line
    for (let i = index + 1; i < this.lines.length; i++) {
      const thisLine = this.lines[i];
      if (thisLine.indentLevel > previousIndentLevel) {
        thisLine.folded = true;
      } else {
        return; // if we've reached a line with the same indent level, we're done.
      }
    }
  };

  getColonSeparatedIndentLevel: LineParserFunction = text => {
    const line = new TextLine(this);
    const components = text.split(':');
    // if no colon
    if (components.length === 1) {
      line.text = components[0];
    } else {
      line.text = components[1];
      line.indentLevel = Number(components[0]);
    }
    return line;
  };

  getText = (): string => this.lines.map(l => l.text).join('\n');

  getLinesCount = (): number => this.lines.length;

  // get 0-indexed line
  getLineAtIndex = (i: number): TextLine => this.lines[i];

  // get 1-indexed line
  getLineWithNumber = (i: number): TextLine => this.lines[i - 1];

}

export default TextEntryModel;
