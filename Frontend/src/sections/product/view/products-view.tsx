
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';

import { _products } from 'src/_mock';


export function ProductsView() {
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
        รอทำ 3
      </Typography>
    </Box>
  );
}
