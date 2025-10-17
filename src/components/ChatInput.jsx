import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, CircularProgress } from '@mui/material';
import { SendTwoTone } from '@mui/icons-material';

export const ChatInput = ({ onSendMessage, isProcessing, connectionStatus }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textFieldRef = useRef(null);

  const isConnecting = connectionStatus === 'connecting';
  const canSend = message.trim().length > 0 && !isProcessing && !isConnecting;

  const handleSend = () => {
    if (canSend) {
      onSendMessage(message);
      setMessage('');
      textFieldRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPlaceholder = () => {
    if (isConnecting) return 'Connecting...';
    if (isProcessing) return 'Processing your message...';
    return 'How can I help today?';
  };

  const getShadow = () => {
    if (isConnecting) return '0 0px 0px 0 rgba(0, 0, 0, 0.0)';
    if (message.trim().length > 0 || isFocused) {
      return '0 9px 32px 0 rgba(0, 0, 0, 0.12), 0 2px 8px 0 rgba(0, 0, 0, 0.14)';
    }
    return '0 2px 8px 0 rgba(0, 0, 0, 0.07)';
  };

  return (
    <Box
      sx={{
        p: 2,
        pb: 1,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          backgroundColor: isConnecting ? 'rgba(255, 255, 255, 0.50)' : '#fff',
          borderRadius: 2,
          border: '0.5px solid #C7C7C7',
          boxShadow: getShadow(),
          transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
          p: 2,
        }}
      >
        <TextField
          ref={textFieldRef}
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={getPlaceholder()}
          disabled={isConnecting || isProcessing}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: '16px',
              color: message.trim().length > 0 ? 'rgba(0, 0, 0, 0.80)' : 'rgba(0, 0, 0, 0.60)',
              '&::placeholder': {
                color: isConnecting ? 'rgba(0, 0, 0, 0.38)' : 'rgba(0, 0, 0, 0.60)',
                opacity: 1,
              },
            },
          }}
          sx={{
            '& .MuiInputBase-root': {
              padding: 0,
            },
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
          }}
        >
          {isConnecting ? (
            <CircularProgress
              size={24}
              sx={{
                '& .MuiCircularProgress-svg': {
                  color: '#4BAEF8',
                },
              }}
            />
          ) : (
            <IconButton
              onClick={handleSend}
              disabled={!canSend}
              sx={{
                p: 1,
                '&:hover': {
                  backgroundColor: canSend ? 'rgba(75, 174, 248, 0.08)' : 'transparent',
                },
              }}
            >
              <SendTwoTone
                sx={{
                  fontSize: 24,
                  color: canSend ? '#4BAEF8' : 'rgba(0, 0, 0, 0.38)',
                  transition: 'color 0.2s ease',
                }}
              />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};
