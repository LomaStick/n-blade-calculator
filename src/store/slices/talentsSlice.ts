import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CharacterClass } from '../../types';
import { BranchId, IBranchesState, IBranchState, ISkillsState, ISkillState, ITalentsState, SkillId, SkillStatus } from '../../types/talents';
import { TALENTS_BRANCH_MAX_POINTS, TALENTS_MAX_POINTS, TALENTS_SKILL_MAX_POINTS } from '@utils/consts';

// Инициализация состояний
const getInitialSkillState = (): ISkillState => ({
  level: 0,
  status: SkillStatus.LOCK
});

const getInitialSkillsState = (): ISkillsState => ({
  [SkillId.S1]: getInitialSkillState(),
  [SkillId.S2]: getInitialSkillState(),
  [SkillId.S3]: getInitialSkillState(),
  [SkillId.S4]: getInitialSkillState(),
});

const getInitialBranchState = (): IBranchState => ({
  level: 0,
  skills: getInitialSkillsState()
});

const getInitialBranchesState = (): IBranchesState => ({
  [BranchId.B1]: getInitialBranchState(),
  [BranchId.B2]: getInitialBranchState(),
  [BranchId.B3]: getInitialBranchState(),
});

const getInitialTalentsState = (): ITalentsState => ({
  availablePoints: TALENTS_MAX_POINTS,
  branches: getInitialBranchesState()
});

const initialState: Record<CharacterClass, { talents: ITalentsState }> = {
  [CharacterClass.WARRIOR]: { talents: getInitialTalentsState() },
  [CharacterClass.THIEF]: { talents: getInitialTalentsState() },
  [CharacterClass.ARCHER]: { talents: getInitialTalentsState() },
  [CharacterClass.PRIEST]: { talents: getInitialTalentsState() },
  [CharacterClass.MAGE]: { talents: getInitialTalentsState() },
};

export const talentsSlice = createSlice({
  name: 'talents',
  initialState,
  reducers: {
    incrementSkillLevel: (state, action: PayloadAction<{
      currentClass: CharacterClass;
      branchId: BranchId;
      skillId: SkillId;
    }>) => {
      const { currentClass, branchId, skillId } = action.payload;
      const classTalents = state[currentClass].talents;
      const skill = classTalents.branches[branchId]?.skills[skillId];

      if (!skill) {
        console.error(`Skill ${skillId} not found in class ${currentClass} branch ${branchId}`);
        return;
      }

      if (classTalents.availablePoints <= 0 || 
          skill.status !== SkillStatus.OPEN || 
          skill.level >= TALENTS_SKILL_MAX_POINTS) {
        return;
      }

      skill.level += 1;
      skill.status = SkillStatus.ACCEPT;
      classTalents.availablePoints -= 1;

      // Блокируем OPEN навыки при достижении максимального количества очков
      if (classTalents.availablePoints === 0) {
        Object.values(classTalents.branches).forEach(branch => {
          Object.values(branch.skills).forEach(skill => {
            if (skill.status === SkillStatus.OPEN) {
              skill.status = SkillStatus.LOCK;
            }
          });
        });
      }
    },

    incrementBranchLevel: (state, action: PayloadAction<{
      currentClass: CharacterClass;
      branchId: BranchId;
    }>) => {
      const { currentClass, branchId } = action.payload;
      const classState = state[currentClass].talents;
      const branch = classState.branches[branchId];

      if (!branch) {
        console.error(`Branch ${branchId} not found for class ${currentClass}`);
        return;
      }

      if (classState.availablePoints <= 0 || branch.level >= TALENTS_BRANCH_MAX_POINTS) {
        return;
      }

      branch.level += 1;
      classState.availablePoints -= 1;

      // Разблокировать талант каждые 5 уровней
      if (branch.level % 5 === 0) {
        const talentIndex = Math.floor(branch.level / 5);
        const skillId = `s${talentIndex}` as SkillId;
        
        if (talentIndex >= 0 && branch.skills[skillId]) {
          branch.skills[skillId].status = SkillStatus.OPEN;
        }
      }

      // Блокируем OPEN навыки при достижении максимального количества очков
      if (classState.availablePoints === 0) {
        Object.values(classState.branches).forEach(branch => {
          Object.values(branch.skills).forEach(skill => {
            if (skill.status === SkillStatus.OPEN) {
              skill.status = SkillStatus.LOCK;
            }
          });
        });
      }
    },

    resetBranch: (state, action: PayloadAction<{
      currentClass: CharacterClass;
      branchId: BranchId;
    }>) => {
      const { currentClass, branchId } = action.payload;
      const classTalents = state[currentClass].talents;
      const branch = classTalents.branches[branchId];
      const initialBranch = getInitialBranchState();
      
      if (branch) {
        const spentPoints = branch.level + Object.values(branch.skills)
          .reduce((sum, skill) => sum + skill.level, 0);
        
        classTalents.availablePoints += spentPoints;
        classTalents.branches[branchId] = initialBranch;

        // Разблокируем навыки, если очков стало достаточно
        if (classTalents.availablePoints > 0) {
          Object.values(classTalents.branches).forEach(branch => {
            Object.entries(branch.skills).forEach(([skillId, skill]) => {
              const requiredLevel = (parseInt(skillId.replace('s', ''))) * 5;
              if (branch.level >= requiredLevel && skill.level < TALENTS_SKILL_MAX_POINTS) {
                skill.status = SkillStatus.OPEN;
              }
            });
          });
        }
      }
    },

    resetTalents: (state, action: PayloadAction<CharacterClass>) => {
      const currentClass = action.payload;
      state[currentClass].talents = getInitialTalentsState();
    },
  }
});

export const { 
  incrementSkillLevel,
  incrementBranchLevel,
  resetBranch,
  resetTalents,
} = talentsSlice.actions;

export default talentsSlice.reducer;