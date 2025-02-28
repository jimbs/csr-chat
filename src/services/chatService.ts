import axios from 'axios';

const BASE_URL = 'https://api.karera.com/v1'; // adjust this to your actual API base URL

interface Message {
  id: string;
  text: string;
  sender: 'operator' | 'user';
  time: string;
}

export const chatService = {
  getMessages: (chatId: string) => 
    axios.get<Message[]>(`${BASE_URL}/chats/${chatId}/messages`),

  sendMessage: (chatId: string, message: string) => 
    axios.post<Message>(`${BASE_URL}/chats/${chatId}/messages`, { message }),

  endChat: (chatId: string) =>
    axios.post(`${BASE_URL}/chats/${chatId}/end`),

  rateChat: (chatId: string, rating: number) =>
    axios.post(`${BASE_URL}/chats/${chatId}/rate`, { rating })
};