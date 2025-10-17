import { Box, Paper } from '@mui/material';
import { keyframes } from '@emotion/react';

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
`;

export const TypingIndicator = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 2,
        px: 4,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          px: 2,
          py: 1.5,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          display: 'flex',
          gap: 0.5,
          alignItems: 'center',
          minWidth: 64,
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#4BAEF8',
              animation: `${bounce} 1.4s infinite ease-in-out`,
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </Paper>
    </Box>
  );
};
