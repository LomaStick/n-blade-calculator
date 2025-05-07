import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CharacterClass } from '../../types';


type CurrentClassState = CharacterClass;

const initialState: CurrentClassState = CharacterClass.WARRIOR;


const currentClassSlice = createSlice({
  name: 'currentClass',
  initialState: initialState as CurrentClassState,
  reducers: {
    setCurrentClass: (
      _: CurrentClassState,
      action: PayloadAction<CharacterClass>
    ): CharacterClass => {
      return action.payload;
    }
  }
});

export const { setCurrentClass } = currentClassSlice.actions;
export const selectCurrentClass = (state: { currentClass: CharacterClass }) => state.currentClass;
export default currentClassSlice.reducer;