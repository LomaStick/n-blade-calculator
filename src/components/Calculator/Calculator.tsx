import { memo, useCallback, useMemo } from "react";
import {  useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/hooks/";
import { setCurrentClass } from "@store/slices/currentClassSlice";
import { assets } from "@utils/assetsProxy";
import { Talents } from "@components/Calculator/Talents";
import { Characteristics } from "@components/Calculator/Characteristics";
import { CharacterClass } from "../../types";
import './Calculator.scss'

const Calculator = memo(() => {
  const dispatch = useAppDispatch();
  const currentClass = useAppSelector((state) => state.currentClass);
  // const navigate = useNavigate();
  const location = useLocation();

  // Мемоизация текущей вкладки
  const currentTab = useMemo(() => 
    location.pathname.includes('characteristics') ? 'characteristics' : 'talents',
    [location.pathname]
  );

  // Обработчики с useCallback
  // const handleTabChange = useCallback((tab: 'characteristics' | 'talents') => {
  //   navigate(`/calculator/${tab}`, { replace: true });
  // }, [navigate]);

  const handleClassChange = useCallback((cls: CharacterClass) => {
    dispatch(setCurrentClass(cls));
  }, [dispatch]);

  // Мемоизация списка классов
  const classList = useMemo(() => Object.values(CharacterClass), []);

  return (
    <div 
      className="calculator" 
      style={{ backgroundImage: `url(${assets.interface._background})` }}
    >
      <div className="calculator__header">
        <div className="class-selector" role="group" aria-label="Character class selection">
          {classList.map((cls) => (
            <ClassButton
              key={cls}
              cls={cls}
              currentClass={currentClass}
              onChange={handleClassChange}
            />
          ))}
        </div>
        
        {/* <TabNavigation 
          currentTab={currentTab}
          onChange={handleTabChange}
        /> */}
      </div>
      
      <main className="calculator__content">
        {currentTab === 'characteristics' ? <Characteristics /> : <Talents />}
      </main>
    </div>
  );
});

// Вынесенные компоненты для оптимизации
const ClassButton = memo(({ 
  cls, 
  currentClass, 
  onChange 
}: { 
  cls: CharacterClass; 
  currentClass: CharacterClass; 
  onChange: (cls: CharacterClass) => void 
}) => (
  <button
    className={`class-button ${currentClass === cls ? 'class-button_active' : ''}`}
    onClick={() => onChange(cls)}
    aria-label={`Select ${cls} class`}
    aria-pressed={currentClass === cls}
		style={{position: 'relative'}}
  >
    <img 
      src={assets.interface.classesIcons[`_${cls}`]}
      alt="" 
      loading="lazy"
      decoding="async"
    />
		{!(currentClass === cls) && <img className="class-button_filter-lock" src={assets.calculator.talents.interface.skillsStatus._lockFilter}/>}
  </button>
));

const TabNavigation = memo(({ 
  currentTab, 
  onChange 
}: { 
  currentTab: string; 
  onChange: (tab: 'characteristics' | 'talents') => void 
}) => (
  <nav className="tabs-navigation" aria-label="Calculator sections">
    <TabButton
      tab="characteristics"
      currentTab={currentTab}
      onChange={onChange}
      label="Характеристики"
    />
    <TabButton
      tab="talents"
      currentTab={currentTab}
      onChange={onChange}
      label="Таланты"
    />
  </nav>
));

const TabButton = memo(({ 
  tab, 
  currentTab, 
  onChange, 
  label 
}: { 
  tab: string; 
  currentTab: string; 
  onChange: (tab: 'characteristics' | 'talents') => void; 
  label: string 
}) => (
  <button 
    className={`tab-button ${currentTab === tab ? 'active' : ''}`}
    onClick={() => onChange(tab as 'characteristics' | 'talents')}
    aria-current={currentTab === tab ? 'page' : undefined}
  >
    {label}
  </button>
));

Calculator.displayName = 'Calculator';
ClassButton.displayName = 'ClassButton';
TabNavigation.displayName = 'TabNavigation';
TabButton.displayName = 'TabButton';

export default Calculator;