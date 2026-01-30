import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';

const socket = io.connect(import.meta.env.VITE_BACKEND_URL || "http://localhost:3001");

const CodeEditor = () => {
  const [code, setCode] = useState("// Welcome to the Collaborative Canvas!\n// Start typing to see updates live.");
  const [pins, setPins] = useState([]);
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState([]);
  const [userCount, setUserCount] = useState(1); // Default to 1 (yourself)

  useEffect(() => {
    socket.on("receive_code", (data) => setCode(data.code));
    
    socket.on("receive_pin", (data) => {
      setPins((prev) => [...prev, data]);
    });

    socket.on("receive_cursor", (data) => {
      setRemoteCursors((prev) => {
        const filtered = prev.filter(c => c.id !== data.id);
        return [...filtered, data];
      });
    });

    // Listen for user count updates
    socket.on("user_count", (count) => {
      setUserCount(count);
    });

    return () => {
      socket.off("receive_code");
      socket.off("receive_pin");
      socket.off("receive_cursor");
      socket.off("user_count");
    };
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit("send_code", { code: value });
  };

  const handleOverlayClick = (e) => {
    if (!isCommentMode) return;

    // Get coordinates relative to the viewport/container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newPin = { x, y, text: "New Comment" };
    setPins((prev) => [...prev, newPin]);
    socket.emit("send_pin", newPin);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    socket.emit("send_cursor", { x, y, id: socket.id });
  };

  return (
    // Main Container - Flexbox ensures the header and editor stack perfectly
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1e1e1e', color: '#ccc' }}>
      
      {/* 1. PROFESSIONAL NAVBAR */}
      <div style={{ 
        height: '50px', 
        backgroundColor: '#252526', // VS Code Header Color
        borderBottom: '1px solid #3e3e42',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0 // Prevent header from shrinking
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#007acc' }}>
          Realtime<span style={{ color: 'white' }}>Canvas</span>
        </div>

        {/* Center Controls */}
        <div>
          <button 
            onClick={() => setIsCommentMode(!isCommentMode)}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              background: isCommentMode ? '#f44336' : '#2d2d2d',
              color: isCommentMode ? 'white' : '#ccc',
              border: '1px solid #3e3e42',
              borderRadius: '4px',
              transition: 'all 0.2s',
              fontWeight: '500'
            }}
          >
            {isCommentMode ? "🔴 Drop Pin Mode" : "✎ Edit Mode"}
          </button>
        </div>

        {/* User Count Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '10px', height: '10px', 
            borderRadius: '50%', 
            backgroundColor: '#4CAF50',
            boxShadow: '0 0 5px #4CAF50'
          }}></div>
          <span style={{ fontSize: '14px' }}>{userCount} Online</span>
        </div>
      </div>

      {/* 2. EDITOR AREA (Takes remaining space) */}
      <div 
        style={{ position: 'relative', flex: 1, overflow: 'hidden' }}
        onMouseMove={handleMouseMove}
      >
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          theme="vs-dark"
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false }, // Cleaner look
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true // Adjusts when window resizes
          }}
        />

        {/* OVERLAY for Pins & Cursors */}
        <div
          onClick={handleOverlayClick}
          style={{
            position: 'absolute',
            top: 0, 
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
            pointerEvents: isCommentMode ? 'auto' : 'none',
            cursor: isCommentMode ? 'crosshair' : 'default'
          }}
        >
          {/* Pins */}
          {pins.map((pin, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: pin.x,
                top: pin.y,
                width: '24px',
                height: '24px',
                backgroundColor: '#ff9800',
                borderRadius: '50% 50% 50% 0', // Teardrop shape
                transform: 'translate(-50%, -100%) rotate(-45deg)', // Pin tip at exact coordinate
                border: '2px solid white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
              }}
              title={pin.text}
            />
          ))}

          {/* Remote Cursors */}
          {remoteCursors.map((cursor, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: cursor.x,
                top: cursor.y,
                pointerEvents: 'none',
                transition: 'top 0.1s, left 0.1s', // Smooth movement
                zIndex: 20
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M0 0L10 15L12 10L18 8L0 0Z" fill="#007acc" stroke="white" strokeWidth="1"/>
              </svg>
              <span style={{ 
                backgroundColor: '#007acc', 
                color: 'white', 
                padding: '2px 4px', 
                borderRadius: '3px',
                fontSize: '10px',
                marginLeft: '8px'
              }}>
                Guest
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;