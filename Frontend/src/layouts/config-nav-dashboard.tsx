import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/icon/${name}.svg`} />
);

export const navData = [
  {
    title: 'ปฎิทิน',
    path: '/',
    icon: icon('calendar'),
  },
  {
    title: 'สถิติ',
    path: '/user',
    icon: icon('chart'),
  },
  {
    title: 'การตั้งค่า',
    path: '/products',
    icon: icon('settings'),
  },
  {
    title: 'ออกจากระบบ',
    path: '/sirawittop',
    icon: icon('logout'),

  },
];
