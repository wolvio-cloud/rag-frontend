import { useEffect, useState } from 'react';

const STORAGE_KEY = 'contract_rag_chat_history';

export function useChatHistory() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        setMessages([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message) => {
    setMessages((current) => [...current, { ...message, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { messages, addMessage, clearHistory };
}
