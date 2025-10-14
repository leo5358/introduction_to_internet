import { GoogleGenAI } from '@google/genai';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// === 1. 類型定義 (Type Definitions) ===
export type Part = { text: string };
export type ChatMsg = { role: 'user' | 'model'; parts: Part[] };

type Props = {
  /** Default Gemini model id (you can type any valid one) */
  defaultModel?: string; // e.g. 'gemini-2.5-flash'
  /** Optional starter message */
  starter?: string;
};

// 【模型選項列表】
const MODEL_OPTIONS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (推薦)' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (進階推理)' },
  { id: 'gemini-2.5-nano', name: 'Gemini 2.5 Nano (行動裝置/嵌入式)' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (舊版)' },
];


// === 2. 顏色調色盤 (Color Palette) ===
const palette = {
  primary: '#4F46E5', // 深紫色，作為主要品牌色
  primaryLight: '#818CF8', // 淺紫色
  secondary: '#6B7280', // 灰色，用於次要文字和邊框
  userBubble: '#EEF2FF', // 用戶訊息背景 - 淺藍紫
  aiBubble: '#F3F4F6', // AI 訊息背景 - 淺灰
  background: '#F9FAFB', // 頁面背景
  cardBackground: '#FFFFFF', // 卡片背景
  textDark: '#1F2937', // 深色文字
  textMuted: '#6B7280', // 靜音文字
  border: '#E5E7EB', // 邊框顏色
  error: '#EF4444', // 錯誤提示顏色
};

// === 3. 主組件 (Main Component) ===
export default function AItest({
  defaultModel = MODEL_OPTIONS[0].id, // 使用列表中的第一個作為預設
  starter = '嗨！幫我測試一下台北旅遊的一日行程～',
}: Props) {
  const [model, setModel] = useState<string>(defaultModel);
  const [history, setHistory] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  
  // 【恢復點 A】恢復 API Key 狀態管理
  const [apiKey, setApiKey] = useState('');
  const [rememberKey, setRememberKey] = useState(true); // 預設開啟記憶
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  // 【恢復點 B】恢復從 localStorage 讀取金鑰
  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key');
    if (saved) setApiKey(saved);
  }, []);

  // Warm welcome + starter
  useEffect(() => {
    setHistory([{ role: 'model', parts: [{ text: '👋 這裡是 Gemini 小幫手，有什麼想聊的？' }] }]);
    if (starter) setInput(starter);
  }, [starter]);

  // auto-scroll to bottom
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [history, loading]);

  const ai = useMemo(() => {
    try {
      return apiKey ? new GoogleGenAI({ apiKey }) : null;
    } catch {
      return null;
    }
  }, [apiKey]);

  async function sendMessage(message?: string) {
    const content = (message ?? input).trim();
    if (!content || loading) return;
    
    // 檢查 API Key
    if (!ai) { setError('請先輸入有效的 Gemini API Key'); return; }

    setError('');
    setLoading(true);

    const newHistory: ChatMsg[] = [...history, { role: 'user', parts: [{ text: content }] }];
    setHistory(newHistory);
    setInput('');

    try {
      const resp = await ai.models.generateContent({
        model,
        contents: newHistory, // send the chat history to keep context
      });

      const reply = resp.text || '[No content]';
      setHistory(h => [...h, { role: 'model', parts: [{ text: reply }] }]);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  // === Markdown 渲染函數 (保持與之前一致) ===
  function renderContent(parts: Part[]) {
      const text = parts.map(p => p.text).join('\n');
      
      const codeStyle: React.CSSProperties = { 
          backgroundColor: '#1F2937', 
          color: '#fff', 
          padding: '10px', 
          borderRadius: '8px', 
          overflowX: 'auto',
          fontSize: '0.9rem',
      };
      
      const inlineCodeStyle: React.CSSProperties = {
          backgroundColor: palette.aiBubble, 
          padding: '2px 4px', 
          borderRadius: '4px', 
          border: `1px solid ${palette.border}`,
          fontWeight: 'bold',
          color: palette.textDark,
      };
      
      return (
          <ReactMarkdown
              children={text}
              remarkPlugins={[remarkGfm]}
              components={{
                  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: palette.primary, textDecoration: 'underline' }} />,
                  
                  code: ({ node, inline, className, children, ...props }) => {
                      if (!inline) {
                          return <pre style={codeStyle}><code className={className} {...props}>{children}</code></pre>;
                      }
                      return <code style={inlineCodeStyle} className={className} {...props}>{children}</code>;
                  },
                  h1: ({ node, ...props }) => <h1 {...props} style={{ fontSize: '1.5rem', fontWeight: 700, margin: '12px 0' }} />,
                  h2: ({ node, ...props }) => <h2 {...props} style={{ fontSize: '1.25rem', fontWeight: 600, margin: '10px 0' }} />,
                  ul: ({ node, ...props }) => <ul {...props} style={{ paddingLeft: '20px', margin: '8px 0' }} />,
                  ol: ({ node, ...props }) => <ol {...props} style={{ paddingLeft: '20px', margin: '8px 0' }} />,
                  p: ({ node, ...props }) => <p {...props} style={{ margin: '8px 0' }} />,
              }}
          />
      );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.header}>Gemini Chat Playground</div>

        {/* Controls */}
        <div style={styles.controls}>
          
          {/* 模型下拉選單 (保留) */}
          <label style={styles.label}>
            <span>Model Selection</span>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              style={{ ...styles.input, appearance: 'menulist-button' }}
            >
              {MODEL_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.name} ({opt.id})
                </option>
              ))}
            </select>
            <div style={styles.hintText}>
              選擇最適合您的任務的模型。
            </div>
          </label>

          {/* 【恢復點 C】恢復 API Key 輸入欄位和儲存選項 */}
          <label style={styles.label}>
            <span>Gemini API Key</span>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                const v = e.target.value; setApiKey(v);
                // 在輸入時處理 localStorage 寫入/清除
                if (rememberKey && v) {
                    localStorage.setItem('gemini_api_key', v);
                } else if (!v) {
                    localStorage.removeItem('gemini_api_key');
                }
              }}
              placeholder="貼上你的 API Key (僅在本機瀏覽器儲存)"
              style={styles.input}
            />
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberKey}
                onChange={(e)=>{
                  const checked = e.target.checked;
                  setRememberKey(checked);
                  // 根據勾選狀態，處理 localStorage 寫入/清除
                  if (!checked) {
                      localStorage.removeItem('gemini_api_key');
                  } else if (apiKey) {
                      localStorage.setItem('gemini_api_key', apiKey);
                  }
                }}
                style={styles.checkbox}
              />
              <span>記住在瀏覽器 (localStorage)</span>
            </label>
            <div style={styles.hintText}>
              **警告：** 這是前端示範用法。正式環境請務必透過後端代理或使用帶有安全限制的 API Key。
            </div>
          </label>
          
        </div>

        {/* Messages */}
        <div ref={listRef} style={styles.messages}>
          {history.map((m, idx) => (
            <div key={idx} style={{ ...styles.msg, ...(m.role === 'user' ? styles.userMsg : styles.aiMsg) }}>
              <div style={styles.msgRole}>{m.role === 'user' ? 'You' : 'Gemini'}</div>
              <div style={styles.msgBody}>{renderContent(m.parts)}</div>
            </div>
          ))}
          {loading && (
            <div style={{ ...styles.msg, ...styles.aiMsg }}>
              <div style={styles.msgRole}>Gemini</div>
              <div style={styles.msgBody}>思考中...</div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={styles.error}>
            <span style={{fontWeight: 'bold', marginRight: '8px'}}>錯誤：</span>{error}
            <button onClick={() => setError('')} style={styles.clearErrorBtn}>&times;</button>
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={e => { e.preventDefault(); sendMessage(); }}
          style={styles.composer}
        >
          <input
            placeholder="輸入訊息，按 Enter 送出..."
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              ...styles.textInput,
              ...((!apiKey || loading) ? { backgroundColor: '#F3F4F6', cursor: 'not-allowed' } : {}),
            }}
            disabled={!apiKey || loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !apiKey}
            style={{
              ...styles.sendBtn,
              ...((loading || !input.trim() || !apiKey) ? styles.sendBtnDisabled : {}),
            }}
          >
            {loading ? '傳送中...' : '傳送'}
          </button>
        </form>

        {/* Quick examples */}
        <div style={styles.suggestions}>
          {['今天台北有什麼免費展覽？', '幫我把這段英文翻成中文：Hello from Taipei!', '寫一首關於捷運的短詩', '生成一張太空人騎馬的圖片'].map((q) => (
            <button key={q} type="button" style={styles.suggestion} onClick={() => sendMessage(q)}>{q}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// === 4. 樣式定義 (Styles Definition) (保持與上次一致) ===

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: palette.background,
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  card: {
    width: 'min(960px, 100%)',
    background: palette.cardBackground,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
    border: `1px solid ${palette.border}`,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '16px 24px',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: palette.textDark,
    borderBottom: `1px solid ${palette.border}`,
    background: palette.cardBackground,
  },
  controls: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: '1fr 1fr',
    padding: '24px',
    borderBottom: `1px solid ${palette.border}`,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: palette.textDark,
  },
  input: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: `1px solid ${palette.border}`,
    fontSize: '0.9375rem',
    color: palette.textDark,
    backgroundColor: '#fff',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '6px',
    fontSize: '0.8125rem',
    color: palette.textMuted,
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: `1px solid ${palette.border}`,
    cursor: 'pointer',
  },
  hintText: {
    fontSize: '0.75rem',
    opacity: 0.7,
    marginTop: '4px',
    color: palette.textMuted,
  },
  messages: {
    flexGrow: 1,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '500px',
    overflowY: 'auto',
    background: '#fff',
    borderBottom: `1px solid ${palette.border}`,
  },
  msg: {
    maxWidth: '85%',
    padding: '14px 18px',
    borderRadius: '18px',
    lineHeight: 1.6,
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  userMsg: {
    background: palette.userBubble,
    alignSelf: 'flex-end',
    color: palette.textDark,
    borderBottomRightRadius: '6px',
  },
  aiMsg: {
    background: palette.aiBubble,
    alignSelf: 'flex-start',
    color: palette.textDark,
    borderBottomLeftRadius: '6px',
  },
  msgRole: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: palette.textMuted,
    marginBottom: '6px',
  },
  msgBody: {
    fontSize: '0.9375rem',
    color: palette.textDark,
  },
  error: {
    padding: '12px 24px',
    backgroundColor: '#FEE2E2',
    color: palette.error,
    borderTop: `1px solid ${palette.border}`,
    fontSize: '0.875rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearErrorBtn: {
    background: 'none',
    border: 'none',
    color: palette.error,
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0 8px',
  },
  composer: {
    padding: '24px',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '12px',
    borderTop: `1px solid ${palette.border}`,
    background: palette.cardBackground,
  },
  textInput: {
    padding: '14px 18px',
    borderRadius: '12px',
    border: `1px solid ${palette.border}`,
    fontSize: '1rem',
    color: palette.textDark,
    backgroundColor: '#fff',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  sendBtn: {
    padding: '14px 24px',
    borderRadius: '12px',
    border: 'none',
    background: palette.primary,
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s, opacity 0.2s',
  },
  sendBtnDisabled: {
    background: palette.secondary,
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  suggestions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    padding: '16px 24px 24px 24px',
    background: palette.cardBackground,
    borderTop: `1px solid ${palette.border}`,
  },
  suggestion: {
    padding: '10px 16px',
    borderRadius: '20px',
    border: `1px solid ${palette.border}`,
    background: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: palette.textMuted,
    transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
  },
};