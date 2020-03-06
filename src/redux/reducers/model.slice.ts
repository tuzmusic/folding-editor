import { createSlice } from '@reduxjs/toolkit';
import TextEntryModel from '../../models/TextEntryModel';

const startingText = [
  ...Array.from({ length: 20 }, (_, i) => `${ i % 5 }:This is line #${ i + 1 }`),
  '6:This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long. This line is really long.',
  '1:This is line after the really long line.',
].join('\n');

export const modelSlice = createSlice({
  name: 'model',
  initialState: new TextEntryModel(),  // non-serializable!
  reducers: {
    updateModel(state, action) {
      const { model } = action.payload;
      state = model;
    },
    setModelText(state, { payload }) {
      state.setText(payload);
    },
  },
});

export const { updateModel, setModelText } = modelSlice.actions;
export default modelSlice.reducer;
