import { combineReducers } from '@reduxjs/toolkit';
import currentClassReducer from './slices/currentClassSlice';
import talentsReducer from './slices/talentsSlice';
import characteristicsReducer from './slices/characteristicsSlice';

export const rootReducer = combineReducers({
  currentClass: currentClassReducer,
  talents: talentsReducer,
  characteristics: characteristicsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;