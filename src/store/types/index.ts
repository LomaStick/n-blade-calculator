import { CharacterClass } from "../../types";
import { ICharacteristicsState } from "../../types/characteristics";
import {  ITalentsState } from "../../types/talents";

// ===== КОРНЕВЫЕ ТИПЫ =====
/** Состояние класса */
export type IClassTalentsState = {
	talents: ITalentsState;
}

export type IClassCharacteristicsState = {
	characteristics: ICharacteristicsState;
}

export type IClassState = IClassTalentsState & IClassCharacteristicsState

/** Коллекция состояний классов */
export type IClassesState = {
  [K in CharacterClass]: IClassState;
};

/** Глобальное состояние приложения */
export type IRootState = {
  currentClass: CharacterClass;
  classesState: IClassesState;
}