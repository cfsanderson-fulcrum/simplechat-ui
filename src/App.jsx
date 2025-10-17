import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { supabase } from './supabaseClient';

const theme = createTheme({
  typography: {
    fontFamily: "'Lato', Tahoma, Geneva, Verdana, sans-serif",
  },
  palette: {
    primary: {
      main: '#4BAEF8',
    },
    secondary: {
      main: '#A023FF',
    },
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping]);

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel('chat_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === payload.new.id);
              if (exists) return prev;
              return [...prev, payload.new];
            });
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((m) => (m.id === payload.new.id ? payload.new : m))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMessages = async () => {
    try {
      setConnectionStatus('connecting');

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error loading messages:', error);
      setConnectionStatus('connected');
    }
  };

  const simulateAIResponse = async (userMessageId) => {
    setShowTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    setShowTyping(false);

    const responses = [
      "I'm here to help! Based on your query, I can provide insights and analysis from your data. What specific information would you like to explore?",
      "That's a great question! Let me analyze the data and provide you with a comprehensive answer. The insights show some interesting patterns.",
      "I understand what you're looking for. Based on the available data, here are the key findings that might help address your question.",
      "Thank you for your question! I've processed the information and here's what I found. Would you like me to dive deeper into any specific aspect?",
      "Excellent query! The data reveals several important trends. Let me break down the most relevant insights for you.",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const { data: assistantMessage, error } = await supabase
      .from('chat_messages')
      .insert({
        role: 'assistant',
        content: randomResponse,
        status: 'processing',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assistant message:', error);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    await supabase
      .from('chat_messages')
      .update({ status: 'completed' })
      .eq('id', assistantMessage.id);

    setIsProcessing(false);
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || isProcessing) return;

    setIsProcessing(true);

    try {
      const { data: userMessage, error } = await supabase
        .from('chat_messages')
        .insert({
          role: 'user',
          content: content.trim(),
          status: 'sending',
        })
        .select()
        .single();

      if (error) throw error;

      await new Promise((resolve) => setTimeout(resolve, 300));

      await supabase
        .from('chat_messages')
        .update({ status: 'sent' })
        .eq('id', userMessage.id);

      await simulateAIResponse(userMessage.id);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsProcessing(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#c7c7c7',
          p: 2,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            backgroundColor: '#f7f7f7',
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '90vh',
            maxHeight: '800px',
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              p: 3,
            }}
          >
            {!hasMessages && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    mb: 2,
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontWeight: 400,
                  }}
                >
                  Fulcrum Insights Chat
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(0, 0, 0, 0.60)',
                    maxWidth: 480,
                  }}
                >
                  Ask me anything about your data and I'll provide insights and analysis to help you make informed decisions.
                </Typography>
              </Box>
            )}

            {hasMessages && (
              <Box sx={{ mt: 2 }}>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {showTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </Box>
            )}
          </Box>

          <Box sx={{ backgroundColor: '#f7f7f7', pb: 1 }}>
            <ChatInput
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
              connectionStatus={connectionStatus}
            />
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: 'rgba(0, 0, 0, 0.38)',
                px: 2,
                pb: 1,
                fontSize: '12px',
              }}
            >
              Your chats aren't used to improve our models. Fulcrum Insights can make mistakes, so double-check your results.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
