import { useState, useCallback } from 'react';
import axios from 'axios'; // Import axios for API calls

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { Link as RouterLink } from 'react-router-dom';

// Add validation utility
const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// ----------------------------------------------------------------------

export function SignUpView() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [username, setUsername] = useState('');
    const [apiError, setApiError] = useState('');

    const handleSignUp = useCallback(async () => {
        let valid = true;

        if (!validateEmail(email)) {
            setEmailError('อีเมลไม่ถูกต้อง');
            valid = false;
        } else {
            setEmailError('');
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('รหัสผ่านไม่ตรงกัน');
            valid = false;
        } else {
            setConfirmPasswordError('');
        }

        if (valid) {
            try {
                const response = await axios.post('http://localhost:3000/register', { username, email, password });
                if (response.data.message === 'ลงทะเบียนสำเร็จ') {
                    router.push('/sign-in');
                }
            } catch (error) {
                setApiError(error.response?.data?.error || 'เกิดข้อผิดพลาด');
            }
        }
    }, [username, email, password, confirmPassword, router]);

    const renderForm = (
        <Box display="flex" flexDirection="column" alignItems="stretch">
            <TextField
                fullWidth
                name="username"
                label="ชื่อผู้ใช้"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mb: 3 }}
            />

            <TextField
                fullWidth
                name="email"
                label="อีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
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

            <TextField
                fullWidth
                name="confirmPassword"
                label="ยืนยันรหัสผ่าน"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
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

            {apiError && (
                <Typography color="error" sx={{ mb: 3 }}>
                    {apiError}
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
                onClick={handleSignUp}
            >
                สมัครสมาชิก
            </LoadingButton>

            <Link
                component={RouterLink}
                to="/sign-in"
                variant="body2"
                color="inherit"
                sx={{ mt: 2, textAlign: 'center' }}
            >
                เข้าสู่ระบบ
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

                {/* Right side (sign-up form) */}
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
                        สมัครสมาชิก
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
                    ปลดล็อคความเข้าใจในตัวเอง 💖
                    ทุกที่ ทุกเวลา! ด้วย MINDFUL CYCLE  บันทึกทุกความรู้สึกติดตามรอบเดือน
                </Typography>
            </Box>
        </Box>
    );
}
