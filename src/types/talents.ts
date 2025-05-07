import { CharacterClass } from "../types";

// ===== Базовые перечисления =====
export enum BranchId {
  B1 = 'b1',
  B2 = 'b2',
  B3 = 'b3',
}

export enum SkillId {
  S1 = 's1',
  S2 = 's2',
  S3 = 's3',
  S4 = 's4',
}

export enum SkillStatus {
	LOCK = 'lock',
	OPEN = 'open',
	ACCEPT = 'accept',
}

// ===== 1. СТИЛИ ДАННЫХ (Data Types) =====

/** Данные навыка */
export type ISkillData = {
  name: string;
  description: string;
};

/** Коллекция данных скиллов */
export type ISkillsData = {
	[K in SkillId]: ISkillData
};

/** Данные ветки (без состояния) */
export type IBranchData = {
  name: string;
  description: string;
  skills: ISkillsData
};

/** Коллекция данных веток */
export type IBranchesData = {
	[K in BranchId]:IBranchData
}

/** Данные талантов для всех классов */
export type ITalentsData = {
	[K in CharacterClass]: IBranchesData
}

// ===== 2. СТИЛИ СОСТОЯНИЯ (State Types) =====

/** Состояние навыка */
export type ISkillState = {
  level: number;
	status: SkillStatus;
};

/** Состояние навыков ветки */
export type ISkillsState = {
	[K in SkillId]: ISkillState
}
/** Состояние ветки */
export type IBranchState = {
  level: number;
  skills: ISkillsState;
};

/** Состояние всех веток */
export type IBranchesState = {
	[K in BranchId]: IBranchState
}


/** Общее состояние талантов */
export type ITalentsState = {
  availablePoints: number;
  branches: IBranchesState;
};


// ===== 3. ОБЪЕДИНЕННЫЕ ТИПЫ =====

/** Полный навык (данные + состояние) */
export type ISkill = ISkillData & ISkillState;

/** Полная ветка (данные + состояние) */
export type IBranch = IBranchData & IBranchState;

/** Полные данные по талантам класса */
export type IClassTalents = {
  data: IBranchesData;
  state: ITalentsState;
};

/** Альтернативный вариант (если нужно плоское объединение) */
export type IClassTalentsFlat = ITalentsState & ITalentsData;


