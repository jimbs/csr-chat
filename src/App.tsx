import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/Toast/ToastContainer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CSR } from './pages/Main';
import { Login } from './pages/Login';
import { Chat } from './pages/Chat';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<CSR />}>
            <Route path=":ticket_number" element={<Chat />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </ToastProvider>
  );
}

export default App;
