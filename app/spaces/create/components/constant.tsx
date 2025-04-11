import { Categories as SpaceTypesConstant } from '@/constant';
import {
  AirTrafficControl,
  Buildings,
  Code,
  IconProps,
  Newspaper,
  Storefront,
  UsersThree,
} from '@phosphor-icons/react';
import React from 'react';

export const Categories = SpaceTypesConstant.map(
  (
    i,
  ): {
    value: string;
    label: string;
    icon: React.ReactElement<IconProps>;
    color: string;
  } => {
    let icon = <UsersThree />;
    let color = '#FFB672';
    const value = i.value;
    const label = i.label;
    switch (i.value) {
      case 'general-group': {
        icon = <UsersThree />;
        color = '#FFB672';
        break;
      }
      case 'event-org': {
        icon = <Newspaper />;
        color = '#FFFA64';
        break;
      }
      case 'venue': {
        icon = <Buildings />;
        color = '#B1FF68';
        break;
      }
      case 'shop': {
        icon = <Storefront />;
        color = '#77FAFF';
        break;
      }
      case 'developer': {
        icon = <Code />;
        color = '#7388FF';
        break;
      }
      case 'permahub': {
        icon = <AirTrafficControl />;
        color = '#D364FF';
        break;
      }
      default: {
        icon = <UsersThree />;
        color = '#FFB672';
      }
    }
    return {
      value,
      label,
      icon,
      color,
    };
  },
);
