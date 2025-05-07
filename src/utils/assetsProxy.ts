import { IAssets } from "../types/assets";

const BASE_ASSETS_PATH = '/n-blade-calculator/src/assets/';

// type TerminalProperties<T> = {
//   [K in keyof T]: T[K] extends string 
//     ? [K, T[K]]  // Если значение - строка, сохраняем пару
//     : T[K] extends object
//       ? TerminalProperties<T[K]> // Рекурсия для вложенных объектов
//       : never;
// }[keyof T];

const createAssetsProxy = <T extends object>(basePath: string = ''): T => {
  return new Proxy({} as T, {
    get(_, prop: string) {
      if (typeof prop !== 'string') return '';

      const currentPath = basePath ? `${basePath}/${prop}` : prop;

      
      // Для свойств с подчеркиванием возвращаем полный путь
      if (prop.startsWith('_')) {
        const fileName = prop.slice(1);
        return `${BASE_ASSETS_PATH}${basePath}/${fileName}.png`;
      }
      
      // Для остальных случаев создаем новый Proxy
      return createAssetsProxy(currentPath);
    }
  });
};

export const assets = createAssetsProxy<IAssets>();