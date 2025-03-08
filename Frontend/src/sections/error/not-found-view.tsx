import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';

// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container>
        <Typography variant="h3" sx={{ mb: 2 }}>
          ขอโทษ, ไม่พบหน้าที่คุณต้องการ!
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          ขอโทษ, เราไม่สามารถหาหน้านี้ที่คุณกำลังมองหาได้ บางทีคุณอาจพิมพ์ URL ผิด กรุณาตรวจสอบการสะกด
        </Typography>


        <Button component={RouterLink} href="/" size="large" variant="contained" color="inherit" style={{ marginTop: 20 }}>
          Go to home
        </Button>
      </Container>
    </SimpleLayout>
  );
}
