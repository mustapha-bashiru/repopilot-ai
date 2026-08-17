import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RepoInput, { isValidGitHubRepository } from './RepoInput';

describe('isValidGitHubRepository', () => {
    test.each([
        'https://github.com/owner/repo',
        'https://github.com/owner/repo/',
        'https://github.com/owner/repo.git',
        'owner/repo',
        'owner/repo.git'
    ])('accepts %s', (repository) => {
        expect(isValidGitHubRepository(repository)).toBe(true);
    });

    test.each([
        'A',
        'arbitrary text',
        'github.com/owner/repo',
        'http://github.com/owner/repo',
        'https://gitlab.com/owner/repo',
        'https://github.com/owner/repo/issues',
        'https://github.com/owner/repo?tab=readme',
        '/owner/repo',
        'owner/'
    ])('rejects %s', (repository) => {
        expect(isValidGitHubRepository(repository)).toBe(false);
    });
});

describe('RepoInput', () => {
    test('blocks invalid input and displays an inline error', () => {
        const onRepoSubmit = jest.fn();
        render(<RepoInput onRepoSubmit={onRepoSubmit} loading={false} />);

        const input = screen.getByPlaceholderText('GitHub repository URL or owner/repo');
        fireEvent.change(input, { target: { value: 'A' } });
        fireEvent.click(screen.getByRole('button', { name: 'Analyze Repo' }));

        expect(onRepoSubmit).not.toHaveBeenCalled();
        expect(screen.getByRole('alert')).toHaveTextContent(
            'Enter a valid GitHub repository URL or owner/repo.'
        );
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('submits a valid shorthand repository', () => {
        const onRepoSubmit = jest.fn();
        render(<RepoInput onRepoSubmit={onRepoSubmit} loading={false} />);

        fireEvent.change(
            screen.getByPlaceholderText('GitHub repository URL or owner/repo'),
            { target: { value: ' owner/repo ' } }
        );
        fireEvent.click(screen.getByRole('button', { name: 'Analyze Repo' }));

        expect(onRepoSubmit).toHaveBeenCalledWith('owner/repo');
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});