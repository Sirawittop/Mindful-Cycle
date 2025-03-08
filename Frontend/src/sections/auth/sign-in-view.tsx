import { useState, useCallback } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { Link as RouterLink } from 'react-router-dom';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/login', { email, password });
      if (response.data.message === 'เข้าสู่ระบบสำเร็จ') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', response.data.user.username); // Store username
        router.push('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [email, password, router]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="stretch">
      <TextField
        fullWidth
        name="email"
        label="อีเมล"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="password"
        label="รหัสผ่าน"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {error && (
        <Typography color="error" sx={{ mb: 3 }}>
          {error}
        </Typography>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        sx={{
          backgroundColor: "#de5d83",
          '&:hover': {
            backgroundColor: "#c75473", // Darker shade of #de5d83
          },
        }}
        variant="contained"
        onClick={handleSignIn}
        loading={loading}
      >
        เข้าสู่ระบบ
      </LoadingButton>

      <Link
        component={RouterLink}
        to="/sign-up"
        variant="body2"
        color="inherit"
        sx={{ mt: 2, textAlign: 'center' }}
      >
        สมัครสมาชิก
      </Link>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 5,
        width: '850px',
        ml: '-200px',
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        sx={{
          mb: { xs: 5, sm: 0 },
          gap: 5,
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            mb: { xs: 5, sm: 0 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
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
          <Typography variant="h3" sx={{ fontWeight: 1000, color: '#de5d83', mt: 2, textAlign: 'center', whiteSpace: 'nowrap' }}>MINDFUL CYCLE</Typography>
          <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
            ยินดีต้อนรับสู่แอปพลิเคชันของเรา
          </Typography>
        </Box>

        {/* Right side (sign-in form) */}
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            p: 4,
            bgcolor: "background.paper",
            width: '500px',
            height: '100%',
          }}
        >
          <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
            เข้าสู่ระบบ
          </Typography>
          {renderForm}
        </Box>
      </Box>

      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
          bgcolor: "background.paper",
          width: '100%',
          maxWidth: 900,
          textAlign: 'center',
          mt: 1, // Add margin top to create space between the boxes
        }}
      >
        <Typography variant="body1">
          ปลดล็อคความเข้าใจในตัวเอง ❤️
          ทุกที่ ทุกเวลา! ด้วย MINDFUL CYCLE  บันทึกทุกความรู้สึกติดตามรอบเดือน
        </Typography>
      </Box>
    </Box>
  );
}
