import React, { useState, useRef, ReactElement, cloneElement, useCallback } from 'react';
import './Tooltip.scss';

type TooltipPosition = string;

interface TooltipProps {
  content: React.ReactNode;
  children: ReactElement;
  position?: TooltipPosition;
}

/** Компонент Tooltip отображает всплывающую подсказку при наведении на дочерний элемент.
 * @param {React.ReactNode} content - Контент подсказки.
 * @param {ReactElement} children - Дочерний элемент, к которому привязана подсказка.
 * @param {TooltipPosition} [position='defaurt'] - Позиция подсказки относительно элемента.
 */
const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'default',
}) => {
  const [visible, setVisible] = useState(false);
  const childRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Оптимизация: мемоизация обработчиков для предотвращения лишних ререндеров
  const showTooltip = useCallback(() => setVisible(true), []);
  const hideTooltip = useCallback(() => setVisible(false), []);

  // Клонируем дочерний элемент с добавлением обработчиков событий
  const childWithProps = cloneElement(children, {
    ref: childRef,
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onTouchStart: showTooltip,
    onTouchEnd: hideTooltip,
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <div className="tooltip-container">
      {childWithProps}
      
      {visible && (
        <div 
          ref={tooltipRef}
          className={`tooltip tooltip_${position}`}
          id="tooltip-content"
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default React.memo(Tooltip);