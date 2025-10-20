import React, { useState, useEffect } from 'react';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = 'leo5358';

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
        if (!response.ok) throw new Error(`GitHub API 錯誤: ${response.status}`);
        const repos = await response.json();
        setProjects(repos);
      } catch (err) {
        setError(err.message);
        console.error('無法獲取 GitHub 專案:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, [username]); // 依賴 [username]，雖然它不會變，但這是個好習慣

  let content;
  if (isLoading) {
    content = <p style={{ color: 'var(--muted)' }}>正在從 GitHub 載入專案...</p>;
  } else if (error) {
    content = <p style={{ color: 'var(--muted)' }}>{`無法載入 GitHub 專案: ${error}`}</p>;
  } else {
    content = (
      <div className="grid">
        {projects.slice(0, 6).map(repo => (
          <div className="project" key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h4>專案 - {repo.name}</h4>
              <p>{repo.description || '點擊查看專案詳情'}</p>
            </a>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section id="projects" className="card">
      <div className="section-title">
        <h3>專案集 & 筆記</h3>
        <div className="pill">
          {isLoading ? '載入中...' : (error ? 'Error' : `${projects.length} items`)}
        </div>
      </div>
      {content}
    </section>
  );
}

export default Projects;