import React, { useState } from 'react';

const GITHUB_REPOSITORY_PATTERN = /^(?:https:\/\/github\.com\/)?[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?\/[A-Za-z0-9._-]{1,100}(?:\/)?$/;
const INVALID_REPOSITORY_MESSAGE = 'Enter a valid GitHub repository URL or owner/repo.';

export const isValidGitHubRepository = (value) => {
    const repository = value.trim().replace(/\.git\/?$/, '');
    return GITHUB_REPOSITORY_PATTERN.test(repository);
};

function RepoInput({ onRepoSubmit, loading }) {
    const [url, setUrl] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const repository = url.trim();
        if (!isValidGitHubRepository(repository)) {
            setValidationError(INVALID_REPOSITORY_MESSAGE);
            return;
        }

        setValidationError('');
        onRepoSubmit(repository);
    };

    const handleChange = (e) => {
        const nextUrl = e.target.value;
        setUrl(nextUrl);

        if (validationError && isValidGitHubRepository(nextUrl)) {
            setValidationError('');
        }
    };

    return (
        <form className="repo-input" onSubmit={handleSubmit} noValidate>
            <div className="repo-input-field">
                <input
                    type="text"
                    placeholder="GitHub repository URL or owner/repo"
                    value={url}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={Boolean(validationError)}
                    aria-describedby={validationError ? 'repo-input-error' : undefined}
                />
                {validationError && (
                    <p id="repo-input-error" className="repo-input-error" role="alert">
                        {validationError}
                    </p>
                )}
            </div>
            <button type="submit" disabled={loading || !url.trim()}>
                {loading ? 'Loading...' : 'Analyze Repo'}
            </button>
        </form>
    );
}

export default RepoInput;
