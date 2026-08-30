import React, { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './index.css';
import App from './App.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0c0704',
          color: '#ffd873',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'sans-serif'
        }}>
          <h1 style={{ fontSize: '28px', marginBottom: '12px' }}>🪔 দেবীপক্ষ</h1>
          <p style={{ color: '#fdf3e2', opacity: 0.8, maxWidth: '400px', marginBottom: '20px' }}>
            Oops! An issue occurred while loading. Tap below to reload the pandal.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: '10px 24px',
              borderRadius: '20px',
              backgroundColor: '#ffd873',
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Reload Page 🔄
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <Analytics />
      <SpeedInsights />
    </ErrorBoundary>
  </StrictMode>,
);
