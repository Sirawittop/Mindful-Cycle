import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',  // Centers horizontally
        alignItems: 'center',      // Centers vertically
        height: '100vh',           // Full viewport height
        textAlign: 'center',       // Centers text inside Typography
      }}
    >
      <Typography variant='h2'>
        รอทำ 1
      </Typography>
    </Box>
  );
}
