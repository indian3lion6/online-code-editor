import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './App.css';
import { FaFolder, FaFileCode, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { getAISuggestion } from './api';



function App() {
  const [suggestion, setSuggestion] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [html, setHtml] = useState('<h1>Hello Elegant World</h1>');
  const [css, setCss] = useState('body { background-color: #f4f4f6; font-family: sans-serif; }');
  const [js, setJs] = useState('console.log("Elegant Code Editor");');
  const [srcDoc, setSrcDoc] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('html'); // NEW
  const [showFiles, setShowFiles] = useState(true); // for folder expand
  // Debounce Auto-Run
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
    }, 500);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const theme = darkMode ? 'vs-dark' : 'vs-light';

  const handleAISuggest = async () => {
  const currentCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
  const suggestion = await getAISuggestion(`Improve this ${activeTab} code: ${currentCode}`);
  setSuggestion(suggestion);
  setShowModal(true);
};


return (
  <>
    <div className="header">
      🌐 Elegant Code Editor
      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>

    <div className="main-layout">
    {/* Sidebar */}
    <div className="sidebar">
      <div className="sidebar-title">📁 Files</div>
      <ul>
        <li onClick={() => setShowFiles(!showFiles)}>
          {showFiles ? <FaChevronDown /> : <FaChevronRight />} <FaFolder /> my-project
        </li>
        {showFiles && (
          <>
            <li><FaFileCode /> index.html</li>
            <li><FaFileCode /> style.css</li>
            <li><FaFileCode /> script.js</li>
          </>
        )}
      </ul>
    </div>

      {/* Main content */}
      <div style={{ flexGrow: 1 }}>
        <div className="tab-buttons">
          <button className={activeTab === 'html' ? 'active' : ''} onClick={() => setActiveTab('html')}>HTML</button>
          <button className={activeTab === 'css' ? 'active' : ''} onClick={() => setActiveTab('css')}>CSS</button>
          <button className={activeTab === 'js' ? 'active' : ''} onClick={() => setActiveTab('js')}>JavaScript</button>
        </div>

      <div className="ai-suggest-btn-container">
      <button className="ai-suggest-btn" onClick={handleAISuggest}>✨ AI Suggest Code</button>
      </div>

        <div className="editor-container">
          {activeTab === 'html' && (
            <div className="pane wide-pane">
              <div className="editor-label">HTML</div>
              <Editor height="400px" language="html" value={html} onChange={setHtml} theme={theme} />
            </div>
          )}
          {activeTab === 'css' && (
            <div className="pane wide-pane">
              <div className="editor-label">CSS</div>
              <Editor height="400px" language="css" value={css} onChange={setCss} theme={theme} />
            </div>
          )}
          {activeTab === 'js' && (
            <div className="pane wide-pane">
              <div className="editor-label">JavaScript</div>
              <Editor height="400px" language="javascript" value={js} onChange={setJs} theme={theme} />
            </div>
          )}
        </div>

        <div className="preview-pane">
          <iframe title="Live Preview" srcDoc={srcDoc} sandbox="allow-scripts" frameBorder="0" />
        </div>
      </div>
    </div>
  {showModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>💡 AI Suggestion</h3>
      <pre className="modal-suggestion">{suggestion}</pre>
      <div className="modal-buttons">
        <button onClick={() => {
          if (activeTab === 'html') setHtml(html + suggestion);
          else if (activeTab === 'css') setCss(css + suggestion);
          else setJs(js + suggestion);
          setShowModal(false);
        }}>✅ Apply</button>
        <button onClick={() => setShowModal(false)}>❌ Cancel</button>
      </div>
    </div>
  </div>
)}

  </>
);

}

export default App;
