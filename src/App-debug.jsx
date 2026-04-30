import React from 'react';

function App() {
  console.log('App component is rendering');
  return (
    <div style={{ 
      backgroundColor: '#0a0a0a', 
      color: 'white', 
      padding: '20px', 
      minHeight: '100vh',
      fontSize: '24px'
    }}>
      <h1>DEBUG: Portfolio Test</h1>
      <p>If you can see this, React is working!</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid white' }}>
        <p>This is a test to verify the app loads correctly.</p>
      </div>
    </div>
  );
}

export default App;
