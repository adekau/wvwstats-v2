import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'WVWSTATS',
    group: true,
  },
  {
    title: 'Matches',
    icon: 'nb-home',
    expanded: true,
    children: [
      {
        title: 'NA Matches',
        icon: 'wvwstats-icon-na',
        link: '/na',
        home: true,
      },
      {
        title: 'EU Matches',
        icon: 'wvwstats-icon-eu',
        link: '/eu',
      },
    ],
  },
  {
    title: 'Game Data',
    icon: 'nb-help',
    children: [
      {
        title: 'Map',
        icon: 'nb-location',
      },
    ],
  },
  {
    title: 'Advanced',
    icon: 'nb-gear',
    children: [
      {
        title: 'Leaderboard',
        icon: 'nb-list',
      },
      {
        title: 'Timezones',
        icon: 'nb-sunny',
      },
      {
        title: 'Grapher',
        icon: 'nb-bar-chart',
      },
    ],
  },
];
