import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { configureStore } from '@reduxjs/toolkit';
import { pathSlice } from './Slices/PathSlice';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

const store = configureStore({
  reducer: {
    path: pathSlice.reducer, // Use the reducer property of the slice
  },
});
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <Router>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    </React.StrictMode>
  </QueryClientProvider>,
);
