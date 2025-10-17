import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';

export const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const isProcessing = message.status === 'processing' || message.status === 'sending';
  const isError = message.status === 'error';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        px: 4,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          maxWidth: '70%',
          px: 2,
          py: 1.5,
          backgroundColor: isUser ? '#f0f7ff' : '#ffffff',
          borderRadius: 2,
          position: 'relative',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(0, 0, 0, 0.87)',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message.content}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            mt: 0.5,
            gap: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '11px' }}
          >
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>

          {isProcessing && (
            <CircularProgress size={12} sx={{ color: '#4BAEF8' }} />
          )}

          {!isProcessing && !isError && message.status === 'completed' && (
            <CheckCircle sx={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.4)' }} />
          )}

          {isError && (
            <ErrorIcon sx={{ fontSize: 12, color: '#d32f2f' }} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};
