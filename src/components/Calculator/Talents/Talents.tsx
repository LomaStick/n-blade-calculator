import { memo, RefObject, useCallback, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { incrementBranchLevel, incrementSkillLevel, resetBranch, resetTalents, selectCurrentClass } from "@store/slices";
import { useScaleFactor } from "@hooks/useScaleFactor";
import { TALENTS_BRANCH_MAX_POINTS, TALENTS_MAX_POINTS } from "@utils/consts";
import { assets } from "@utils/assetsProxy";
import { TalentsData } from "@data/TalentsData";
import { BranchId, ISkillsData, SkillId, SkillStatus } from '../../../types/talents';
import { Tooltip } from "@components/UI/Tooltip/";
import './Talents.scss';
import { shallowEqual } from "react-redux";

const TalentsTab = memo(() => {
  const dispatch = useAppDispatch();
  const currentClass = useAppSelector(selectCurrentClass);
  const { branchesState, availablePoints } = useAppSelector(state => ({
    branchesState: state.talents[currentClass].talents.branches,
    availablePoints: state.talents[currentClass].talents.availablePoints
  }), shallowEqual );

  const imageRef = useRef<HTMLImageElement>(null);
  const { updateScale } = useScaleFactor({
    baseWidth: 329,
    targetRef: imageRef as RefObject<HTMLImageElement>,
    cssVarName: '--branch-scale'
  });

  // Вспомогательные функции
  const hasSpentTalentsPoint = useMemo(() => (
    availablePoints !== TALENTS_MAX_POINTS
  ), [availablePoints]);

  const canUpgradeBranch = useMemo(() => (branchId: BranchId) => (
    availablePoints > 0 && 
    branchesState[branchId]?.level < TALENTS_BRANCH_MAX_POINTS
  ), [availablePoints, branchesState]);

  const calculateBranchPoints = useCallback((branchId: BranchId): number => {
    const branch = branchesState[branchId];
    return branch ? branch.level + Object.values(branch.skills).reduce((sum, skill) => sum + (skill.level || 0), 0) : 0;
  }, [branchesState]);

  // Обработчики событий
  const handleResetAll = useCallback(() => {
    dispatch(resetTalents(currentClass));
  }, [currentClass, dispatch]);

  const handleBranchLevelUp = useCallback((branchId: BranchId) => {
    if (canUpgradeBranch(branchId)) {
      dispatch(incrementBranchLevel({ currentClass, branchId }));
    }
  }, [canUpgradeBranch, currentClass, dispatch]);

  const handleSkillLevelUp = useCallback((branchId: BranchId, skillId: SkillId) => {
    if (availablePoints > 0) {
      dispatch(incrementSkillLevel({ currentClass, branchId, skillId }));
    }
  }, [availablePoints, currentClass, dispatch]);

  const handleBranchReset = useCallback((branchId: BranchId) => {
    dispatch(resetBranch({ currentClass, branchId }));
  }, [currentClass, dispatch]);

  // Функции рендеринга
  const renderBranchLevelIndicators = useCallback((level: number) => {
    return Array.from({ length: TALENTS_BRANCH_MAX_POINTS }).map((_, i) => {
      const isActive = i < level;
      const isBig = (i + 1) % 5 === 0;
      const type = isBig ? 'Big' : 'Small';
      const state = isActive ? 'Active' : '';
      
      return (
        <img 
          key={`${type}-${state}-${i}`}
          className={`level-indicator__item_${type}`}
          alt=""
          src={assets.calculator.talents.interface.talents[`_talentPoint${type}${state}`]}
          loading="lazy"
        />
      );
    });
  }, []);

  const renderSkills = useCallback((skillsData: ISkillsData, branchId: BranchId) => {
    return Object.entries(skillsData).map(([id, skillData]) => {
      const skillId = id as SkillId;
      const skill = branchesState[branchId]?.skills[skillId];
      if (!skill) return null;

      const requiredLevel = (parseInt(skillId.replace('s', ''))) * 5;
      const isLocked = skill.status === SkillStatus.LOCK;
      const isOpen = skill.status === SkillStatus.OPEN;

      return (
        <div className="skill__item-wrapper" key={skillId}>
          <div className="skill__item">
            <Tooltip
              content={
                <div className="tooltip__wrapper">
                  <h4 className="tooltip__title">{skillData.name}</h4>
                  <p className="tooltip__description">{skillData.description}</p>
                  <span className={`tooltip__skill-status tooltip__skill-status_${skill.status}`}>
                    <img 
                      src={assets.calculator.talents.interface.skillsStatus[`_${skill.status}Status`]} 
                      alt="" 
                    />
                    {isLocked && <span>Требуется уровень: {requiredLevel}</span>}
                    {isOpen && <span>Нажмите для изучения</span>}
                    {!isLocked && !isOpen && <span>Изучено</span>}
                  </span>
                </div>
              }
              position={`skillIcon${branchId}${skillId}`}
            >
              <div className="skill__button-container">
                <button 
                  className="skill__button"
                  onClick={() => isOpen && handleSkillLevelUp(branchId, skillId)}
                  disabled={!isOpen}
                  aria-label={`Upgrade ${skillData.name}`}
                >
                  <img 
                    className="skill__icon" 
                    src={assets.calculator.talents.skillsIcons[currentClass][`_${branchId}${skillId}`]} 
                    alt="" 
                  />
                  <div className="button__overlay">
                    <img
                      className="button__overlay_status"
                      src={assets.calculator.talents.interface.skillsStatus[`_${skill.status}Status`]} 
                      alt=""
                    />
                    <img
                      className="button__overlay_filter"
                      src={assets.calculator.talents.interface.skillsStatus[`_${skill.status}Filter`]} 
                      alt=""
                    />
                  </div>
                </button>
              </div>
            </Tooltip>
            <span className='skill__name'>{skillData.name}</span>
          </div>
        </div>
      );
    });
  }, [branchesState, currentClass, handleSkillLevelUp]);

  const renderBranchCounterPoints = useCallback((branchId: BranchId) => (
    <div className="skill__points-counter" key={`points-${branchId}`}>
      <span className="skill__points-current">
        {calculateBranchPoints(branchId)}
      </span>
    </div>
  ), [calculateBranchPoints]);

  return (
    <div className="talents">
      <div className="talents__control-panel">
        <div className="talents__points">
          Осталось очков: {availablePoints}/{TALENTS_MAX_POINTS}
        </div>
        
        <button 
          className="talents__button_reset" 
          onClick={handleResetAll}
          disabled={!hasSpentTalentsPoint}
          aria-label="Reset all talents"
        >
          <img 
            src={assets.interface.buttons[hasSpentTalentsPoint ? "_buttonBrown" : "_buttonUnactive"]} 
            alt="" 
            draggable={false}
          />
          <span>Сбросить все</span>
        </button>
      </div>

      <div className="talents__branches">
        {Object.entries(TalentsData[currentClass]).map(([id, branchData]) => {
          const branchId = id as BranchId;
          const branchState = branchesState[branchId];
          if (!branchState) return null;
					if (!branchData) return null;

          return (
            <div className="talent-branch" key={branchId}>
              <div className="talent-branch__container">
                <div className="talent-branch__header">
                  <img 
                    src={assets.calculator.talents.interface.branch._headerBranch} 
                    alt="" 
                    loading="lazy"
                  />
                  <div className="talent-branch__header_wrapper">
                    <Tooltip 
                      content={
                        <div className="tooltip__wrapper">
                          <p className="tooltip__title">{branchData.name}</p>
                          <p className="tooltip__description">{branchData.description}</p>
                        </div>
                      } 
                      position={`branchName${branchId}`}
                    >
                      <span className="talent-branch__header-name">{branchData.name}</span>
                    </Tooltip>
                  </div>
                </div>

                <img 
                  className="talent-branch__background" 
                  ref={imageRef}
                  src={assets.calculator.talents.interface.branch._background} 
                  alt="" 
                  onLoad={updateScale}
                  loading="lazy"
                />

                <div className="talent-branch__content">
                  <div className="talent-branch__left-panel">
                    <div className="level-indicator__list">
                      {renderBranchLevelIndicators(branchState.level)}
                    </div>
                    <button 
                      className="level-indicator__level-up"
                      onClick={() => handleBranchLevelUp(branchId)}
                      disabled={!canUpgradeBranch(branchId)}
                      aria-label="Increase branch level"
                    >
                      <img 
                        src={assets.calculator.talents.interface.talents[
                          `_plus${canUpgradeBranch(branchId) ? 'Active' : ''}`
                        ]} 
                        alt="" 
                      />
                    </button>
                  </div>

                  <div className="talent-branch__right-panel">
                    <div className="skill__list">
                      {renderSkills(branchData.skills, branchId)}
                    </div>
                    {renderBranchCounterPoints(branchId)}
                  </div>
                </div>

                <div className="talent-branch__footer">
                  <button 
                    className="talents__button_reset" 
                    onClick={() => handleBranchReset(branchId)}
                    disabled={branchState.level <= 0}
                    aria-label={`Reset ${branchData.name} branch`}
                  >
                    <img 
                      src={assets.interface.buttons[branchState.level <= 0 ? '_buttonUnactive' : '_buttonBrown']} 
                      alt="" 
                    />
                    <span>Сбросить</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

TalentsTab.displayName = 'TalentsTab';
export default TalentsTab;