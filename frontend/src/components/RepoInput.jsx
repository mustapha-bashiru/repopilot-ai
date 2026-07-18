import React, { useState } from 'react';

function RepoInput({ onRepoSubmit, loading }) {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onRepoSubmit(url.trim());
        }
    };

    return (
        <form className="repo-input" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter GitHub URL (e.g., https://github.com/facebook/react)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
            />
            <button type="submit" disabled={loading || !url.trim()}>
                {loading ? 'Loading...' : 'Analyze Repo'}
            </button>
        </form>
    );
}

export default RepoInput;
