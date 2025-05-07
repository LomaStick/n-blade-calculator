// characteristicsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICharacteristicsState } from '../../types/characteristics';


export const characteristicsSlice = createSlice({
  name: 'characteristics',
  initialState: {} as ICharacteristicsState,
  reducers: {
    updateCharacteristic: (
      state,
      action: PayloadAction<ICharacteristicsState>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetCharacteristics: () => ({})
  }
});

export const characteristicsActions = characteristicsSlice.actions;
export default characteristicsSlice.reducer;