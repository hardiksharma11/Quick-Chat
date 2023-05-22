import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import ChatState from './Context/Chats/ChatState'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
    <ChatState>
      <App />
      <ToastContainer />
    </ChatState>
  </BrowserRouter>

);

