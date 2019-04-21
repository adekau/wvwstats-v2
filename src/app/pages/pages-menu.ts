import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'MATCHES',
    group: true,
  },
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
  {
    title: 'GAME DATA',
    group: true,
  },
  {
    title: 'Map',
    icon: 'nb-location',
    link: '/map',
  },
  {
    title: 'ADVANCED',
    group: true,
  },
  {
    title: 'Leaderboard',
    icon: 'nb-list',
    link: '/leaderboard',
  },
  {
    title: 'Timezones',
    icon: 'nb-sunny',
    link: '/timezones',
  },
  {
    title: 'Custom Graphs',
    icon: 'nb-bar-chart',
    link: '/graphs',
  },
];
