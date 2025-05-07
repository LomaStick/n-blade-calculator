import { CharacterClass } from "../types/";
import { SkillStatus } from "./talents";

export type skillIconName = {
  [key in `_b${1|2|3}s${1|2|3|4}`]: string;
};


export interface IAssets {
  interface: {
    buttons: {
      _buttonBrown: string;
      _buttonInfo: string;
      _buttonUnactive: string;
    };
    classesIcons: {
      [C in `_${CharacterClass}`]: string;
    };
    _background: string;
  };
  calculator: {
    talents: {
      interface: {
        branch: {
          _headerBranch: string;
          _headerFill: string;
          _headerLeft: string;
          _headerRight: string;
					_background: string;
        };
        skillsStatus: {
					[K in `_${SkillStatus}Filter` | `_${SkillStatus}Status`]: string;
        };
        talents: {
          _plus: string;
          _plusActive: string;
          _talentPointBig: string;
          _talentPointBigActive: string;
          _talentPointSmall: string;
          _talentPointSmallActive: string;
        };
      };
      skillsIcons: {
        [C in CharacterClass]: skillIconName;
      };
    };
  };
}
