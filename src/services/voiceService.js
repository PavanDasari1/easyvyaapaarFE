import api from './api';

export const processVoiceCommand = (text, language = 'en') => 
  api.post('/voice/process', { text, language });

export const confirmVoiceCommand = (data) => 
  api.post('/voice/confirm', data);

export const queryAssistant = (query, language = 'en') => 
  api.post('/assistant/query', { query, language });
