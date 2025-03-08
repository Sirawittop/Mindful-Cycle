import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'ปฎิทิน',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'สถิติ',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'การตั้งค่า',
    path: '/products',
    icon: icon('ic-cart'),
  },
  {
    title: 'ออกจากระบบ',
    path: '/blog',
    icon: icon('ic-blog'),

  },
];
