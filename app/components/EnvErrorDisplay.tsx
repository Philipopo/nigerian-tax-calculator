'use client';

/**
 * EnvErrorDisplay Component
 *
 * Displays a helpful error message when environment variables are missing or invalid.
 * This component is shown during development to help developers quickly identify
 * and fix environment configuration issues.
 */

import React from 'react';

interface EnvErrorDisplayProps {
  error: Error;
}

export function EnvErrorDisplay({ error }: EnvErrorDisplayProps) {
  // Parse the error message to extract structured information
  const errorMessage = error.message;
  const isEnvError = errorMessage.includes('Environment Variable Validation Failed');

  if (!isEnvError) {
    // If it's not an environment error, show a generic error
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fee',
        fontFamily: 'monospace',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '800px',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          border: '2px solid #d00'
        }}>
          <h1 style={{ color: '#d00', marginTop: 0 }}>Application Error</h1>
          <pre style={{
            backgroundColor: '#f5f5f5',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '14px'
          }}>
            {error.message}
          </pre>
        </div>
      </div>
    );
  }

  // Environment variable error - show a nicely formatted message
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '900px',
        backgroundColor: '#2d2d2d',
        padding: '40px',
        borderRadius: '12px',
        border: '2px solid #ff6b6b',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{
            fontSize: '48px',
            marginRight: '15px'
          }}>
            ⚙️
          </div>
          <div>
            <h1 style={{
              color: '#ff6b6b',
              margin: 0,
              fontSize: '28px',
              fontWeight: '600'
            }}>
              Environment Configuration Required
            </h1>
            <p style={{
              color: '#999',
              margin: '5px 0 0 0',
              fontSize: '14px'
            }}>
              Nigerian Tax Calculator
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #444'
        }}>
          <pre style={{
            margin: 0,
            color: '#fff',
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            fontFamily: 'Monaco, Consolas, "Courier New", monospace'
          }}>
            {errorMessage}
          </pre>
        </div>

        <div style={{
          backgroundColor: '#1e3a5f',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '15px',
          border: '1px solid #2d5a8f'
        }}>
          <h3 style={{
            color: '#64b5f6',
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            💡 Quick Fix
          </h3>
          <ol style={{
            color: '#ccc',
            margin: 0,
            paddingLeft: '20px',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <li>
              Copy the example file:
              <code style={{
                display: 'block',
                backgroundColor: '#0d1117',
                padding: '8px 12px',
                borderRadius: '4px',
                marginTop: '8px',
                color: '#58a6ff',
                fontFamily: 'Monaco, Consolas, monospace'
              }}>
                cp .env.example .env.local
              </code>
            </li>
            <li style={{ marginTop: '10px' }}>
              Fill in the missing values in <code style={{
                backgroundColor: '#0d1117',
                padding: '2px 6px',
                borderRadius: '3px',
                color: '#58a6ff'
              }}>.env.local</code>
            </li>
            <li style={{ marginTop: '10px' }}>
              Restart your development server:
              <code style={{
                display: 'block',
                backgroundColor: '#0d1117',
                padding: '8px 12px',
                borderRadius: '4px',
                marginTop: '8px',
                color: '#58a6ff',
                fontFamily: 'Monaco, Consolas, monospace'
              }}>
                npm run dev
              </code>
            </li>
          </ol>
        </div>

        <div style={{
          backgroundColor: '#2d1f1f',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #4d3333'
        }}>
          <p style={{
            color: '#ffb74d',
            margin: 0,
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
            <strong>📚 Need help?</strong> Check <code style={{
              backgroundColor: '#0d1117',
              padding: '2px 6px',
              borderRadius: '3px',
              color: '#58a6ff'
            }}>.env.example</code> for detailed instructions on where to get each credential.
          </p>
        </div>

        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #444',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Environment validation by <code style={{ color: '#888' }}>src/lib/env.ts</code>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4caf50'}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    </div>
  );
}
