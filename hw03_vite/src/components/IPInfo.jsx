import React, { useState, useEffect } from 'react';

function IPInfo() {
  const [ipData, setIpData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = 'https://ipinfo.io/json';

  useEffect(() => {
    async function fetchIPInfo() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`IP API 錯誤: ${response.status}`);
        const data = await response.json();
        if (!data.ip) throw new Error(`IP API 服務錯誤: 未回傳 IP`);
        setIpData(data);
      } catch (error) {
        console.error('無法獲取 IP 資訊:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchIPInfo();
  }, []); // 空依賴陣列，代表只在元件載入時執行一次

  const renderContent = () => {
    if (isLoading) {
      return <p style={{ color: 'var(--muted)' }}>正在查詢您的網路資訊...</p>;
    }
    if (!ipData) {
      return <p style={{ color: 'var(--muted)' }}>無法查詢您的網路資訊。</p>;
    }
    
    const orgName = ipData.org ? ipData.org.split(' ').slice(1).join(' ') : 'N/A';
    return (
      <div>
        <p className="meta" style={{ margin: 0 }}>您的 IP 位址</p>
        <h4 style={{ margin: '0 0 10px 0', color: 'var(--accent)' }}>{ipData.ip}</h4>
        <p className="meta" style={{ margin: 0 }}>網路服務供應商 (ISP)/組織</p>
        <p style={{ margin: '0 0 10px 0' }}>{orgName}</p>
        <p className="meta" style={{ margin: 0 }}>地理位置</p>
        <p style={{ margin: 0 }}>{`${ipData.city || 'N/A'}, ${ipData.region || 'N/A'}, ${ipData.country || 'N/A'}`}</p>
      </div>
    );
  };

  return (
    <section id="ip-info" className="card" style={{ marginTop: '18px' }}>
      <div className="section-title">
        <h3>您的網路資訊</h3>
        <div className="pill">Network Info</div>
      </div>
      <div id="ip-info-content">
        {renderContent()}
      </div>
    </section>
  );
}

export default IPInfo;