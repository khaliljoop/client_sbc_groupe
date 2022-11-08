import { NavItem } from './nav-item';

export let menu: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'fa-solid fa-grid-2',
    route: ''
  },
  {
    displayName: 'Securite',
    iconName: 'fa fa-lock',
    route: 'user',
    children: [
      {
        displayName: 'Profil',
        iconName: '',
        route: 'profil'
      },
      {
        displayName: 'Menu',
        iconName: '',
        route: 'menu'
      },
      {
        displayName: 'Sous menu',
        iconName: '',
        route: 'smenu'
      },
      {
        displayName: 'Utilisateurs',
        iconName: '',
        route: 'users'
      },
    ]
  },
  {
    displayName: 'Parametre',
    iconName: 'fa fa-cog',
    route: 'user',
    children: [
      {
        displayName: 'Parametrage',
        iconName: '',
        route: 'param'
      }
    ]
  },
  {
    displayName: 'Vehicule',
    iconName: 'fa fa-bus',
    route: '',
    children: [
      {
        displayName: 'Liste vehicule',
        iconName: '',
        route: 'vehicule'
      }
    ]
  },
  {
    displayName: 'A propos',
    iconName: 'fa fa-bank',
    route: 'user',
    children: [
      {
        displayName: 'SBC',
        iconName: '',
        route: 'user'
      }
    ]
  },
];
