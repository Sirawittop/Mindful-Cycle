import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
  // Remove onLogout from NavContentProps
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
  onLogout,
}: NavContentProps & { layoutQuery: Breakpoint; onLogout: () => void }) {
  const theme = useTheme();
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

  const handleItemClick = (item: { title: string }) => {
    if (item.title === 'ออกจากระบบ') {
      setOpenLogoutConfirm(true);
    } else {
      // handle other item clicks if needed
    }
  };

  const handleLogoutConfirm = () => {
    setOpenLogoutConfirm(false);
    onLogout();
  };

  const handleLogoutCancel = () => {
    setOpenLogoutConfirm(false);
  };

  return (
    <>
      <Box
        sx={{
          pt: 2.5,
          px: 2.5,
          top: 0,
          left: 0,
          height: 1,
          display: 'none',
          position: 'fixed',
          flexDirection: 'column',
          bgcolor: 'var(--layout-nav-bg)',
          zIndex: 'var(--layout-nav-zIndex)',
          width: 'var(--layout-nav-vertical-width)',
          borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
          [theme.breakpoints.up(layoutQuery)]: {
            display: 'flex',
          },
          ...sx,
        }}
      >
        <NavContent data={data} slots={slots} onItemClick={handleItemClick} />
      </Box>
      <Modal
        open={openLogoutConfirm}
        onClose={handleLogoutCancel}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            ยืนยันการออกจากระบบ
          </Typography>
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ ?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleLogoutCancel} sx={{ mr: 1 }}>ยกเลิก</Button>
            <Button onClick={handleLogoutConfirm} color="primary">ออกจากระบบ</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  onLogout,
}: NavContentProps & { open: boolean; onClose: () => void; onLogout: () => void }) {
  const pathname = usePathname();
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleItemClick = (item: { title: string }) => {
    if (item.title === 'ออกจากระบบ') {
      setOpenLogoutConfirm(true);
    } else {
      // handle other item clicks if needed
    }
  };

  const handleLogoutConfirm = () => {
    setOpenLogoutConfirm(false);
    onLogout();
  };

  const handleLogoutCancel = () => {
    setOpenLogoutConfirm(false);
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        sx={{
          [`& .${drawerClasses.paper}`]: {
            pt: 2.5,
            px: 2.5,
            overflow: 'unset',
            bgcolor: 'var(--layout-nav-bg)',
            width: 'var(--layout-nav-mobile-width)',
            ...sx,
          },
        }}
      >
        <NavContent data={data} slots={slots} onItemClick={handleItemClick} />
      </Drawer>
      <Modal
        open={openLogoutConfirm}
        onClose={handleLogoutCancel}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" component="h2">
            ยืนยันการออกจากระบบ
          </Typography>
          <Typography sx={{ mt: 2 }}>
            คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleLogoutCancel} sx={{ mr: 1 }}>ยกเลิก</Button>
            <Button onClick={handleLogoutConfirm} color="primary">ออกจากระบบ</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx, onItemClick }: NavContentProps & { onItemClick: (item: { title: string }) => void }) {
  const pathname = usePathname();

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
        <Box sx={{ width: '50px', mr: 2 }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
        </Box>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          MINDFUL CYCLE
        </Typography>
      </Box>

      {slots?.topArea}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title} onClick={() => onItemClick(item)}>
                  <ListItemButton
                    disableGutters
                    component={item.title === 'ออกจากระบบ' ? 'div' : RouterLink}
                    href={item.title === 'ออกจากระบบ' ? undefined : item.path}
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: 'var(--layout-nav-item-color)',
                      minHeight: 'var(--layout-nav-item-height)',
                      ...(isActived && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: 'var(--layout-nav-item-active-bg)',
                        color: 'var(--layout-nav-item-active-color)',
                        '&:hover': {
                          bgcolor: 'var(--layout-nav-item-hover-bg)',
                        },
                      }),
                    }}
                  >
                    <Box component="span" sx={{ width: 24, height: 24 }}>
                      {item.icon}
                    </Box>

                    <Box component="span" flexGrow={1}>
                      {item.title}
                    </Box>

                    {item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}

    </>
  );
}
