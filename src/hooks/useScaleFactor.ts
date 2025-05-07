import { useEffect, RefObject } from 'react';

interface UseScaleFactorOptions {
  baseWidth: number;
  targetRef: RefObject<HTMLElement>;
  cssVarName: string;
}

export const useScaleFactor = ({
  baseWidth,
  targetRef,
  cssVarName
}: UseScaleFactorOptions) => {
  const updateScale = () => {
    if (!targetRef.current || targetRef.current.clientWidth === 0) return;
    
    const newScale = targetRef.current.clientWidth / baseWidth;
    document.documentElement.style.setProperty(cssVarName, newScale.toString());
  };

  useEffect(() => {
    // Первое обновление с задержкой
    const timer = setTimeout(updateScale, 250);
    
    // Наблюдатель за изменениями размеров
    const observer = new ResizeObserver(updateScale);
    if (targetRef.current) observer.observe(targetRef.current);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [baseWidth, targetRef, cssVarName]);

  // Возвращаем функцию для ручного обновления
  return { updateScale };
};