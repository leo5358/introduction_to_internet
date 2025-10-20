import React, { useState, useEffect } from 'react';

function SecurityNews() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.feedburner.com%2FTheHackersNews';

  useEffect(() => {
    async function fetchSecurityNews() {
      try {
        const response = await fetch(rssUrl);
        if (!response.ok) throw new Error(`News API 錯誤: ${response.status}`);
        const data = await response.json();
        if (data.status !== 'ok') throw new Error('RSS 服務錯誤');
        setNews(data.items);
      } catch (err) {
        setError(err.message);
        console.error('無法獲取資安新聞:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSecurityNews();
  }, []); // 空依賴陣B_T 列，只執行一次

  const renderContent = () => {
    if (isLoading) {
      return <p style={{ color: 'var(--muted)' }}>載入最新資安新聞...</p>;
    }
    if (error) {
      return <p style={{ color: 'var(--muted)' }}>{`無法載入資安新聞: ${error}`}</p>;
    }
    return news.slice(0, 5).map(item => {
      const itemDate = new Date(item.pubDate).toLocaleDateString('zh-TW');
      return (
        <div className="project" key={item.guid}>
          <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h4>{item.title}</h4>
            <p>發布於: {itemDate}</p>
          </a>
        </div>
      );
    });
  };

  return (
    <section id="security-news" className="card" style={{ marginTop: '18px' }}>
      <div className="section-title">
        <h3>資安新聞 (Top 5)</h3>
        <div className="pill">From The Hacker News</div>
      </div>
      <div id="security-news-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {renderContent()}
      </div>
    </section>
  );
}

export default SecurityNews;