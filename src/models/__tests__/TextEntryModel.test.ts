import TextEntryModel from '../TextEntryModel';

describe('TextEntryModel', () => {
  describe('setText', () => {
    it('breaks the text into lines', () => {
      const model = new TextEntryModel();
      model.setText(`One line
Another line
This one too

There's a space before this one.`);
      expect(model.getLinesCount()).toEqual(5);

      expect(model.lines[0].text).toEqual('One line');
      expect(model.lines[1].text).toEqual('Another line');
      expect(model.lines[2].text).toEqual('This one too');
      expect(model.lines[3].text).toEqual('');
      expect(model.lines[4].text).toEqual('There\'s a space before this one.');
    });
  });
});
