import axios from 'axios';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

class GitHubService {
    constructor() {
        this.client = axios.create({
            baseURL: 'https://api.github.com',
            headers: {
                Authorization: `token ${config.GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
    }

    async fetchRepoData(repoUrl) {
        try {
            const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (!match) {
                throw new Error('Invalid GitHub URL');
            }
            
            const [, owner, repo] = match;
            
            const [
                repoInfo,
                readme,
                contributors,
                fileList,
                dependencies,
                languageStats
            ] = await Promise.all([
                this.getRepoInfo(owner, repo),
                this.getReadme(owner, repo),
                this.getContributors(owner, repo),
                this.getFileList(owner, repo),
                this.getDependencies(owner, repo),
                this.getLanguageStats(owner, repo)
            ]);
            
            return {
                ...repoInfo,
                readme,
                contributors,
                fileList,
                dependencies,
                languageStats,
                fileStructure: this.buildFileStructure(fileList),
                keyFeatures: this.extractKeyFeatures(readme)
            };
        } catch (error) {
            logger.error('Failed to fetch repo data:', error.message);
            throw error;
        }
    }

    async getRepoInfo(owner, repo) {
        const response = await this.client.get(`/repos/${owner}/${repo}`);
        const data = response.data;
        return {
            name: data.name,
            fullName: data.full_name,
            description: data.description,
            stars: data.stargazers_count,
            forks: data.forks_count,
            openIssues: data.open_issues_count,
            language: data.language,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            url: data.html_url
        };
    }

    async getReadme(owner, repo) {
        try {
            const response = await this.client.get(`/repos/${owner}/${repo}/readme`, {
                headers: { Accept: 'application/vnd.github.v3.raw' }
            });
            return response.data;
        } catch {
            return '# README not found';
        }
    }

    async getContributors(owner, repo) {
        const response = await this.client.get(`/repos/${owner}/${repo}/contributors`, {
            params: { per_page: 10 }
        });
        return response.data.map(c => ({
            login: c.login,
            contributions: c.contributions,
            avatar: c.avatar_url
        }));
    }

    async getFileList(owner, repo) {
        try {
            const response = await this.client.get(`/repos/${owner}/${repo}/git/trees/main`, {
                params: { recursive: 1 }
            });
            return response.data.tree
                .filter(item => item.type === 'blob')
                .map(item => item.path);
        } catch {
            try {
                const response = await this.client.get(`/repos/${owner}/${repo}/git/trees/master`, {
                    params: { recursive: 1 }
                });
                return response.data.tree
                    .filter(item => item.type === 'blob')
                    .map(item => item.path);
            } catch {
                return [];
            }
        }
    }

    async getDependencies(owner, repo) {
        const dependencies = {};
        
        try {
            const pkgResponse = await this.client.get(
                `/repos/${owner}/${repo}/contents/package.json`
            );
            const pkg = JSON.parse(
                Buffer.from(pkgResponse.data.content, 'base64').toString()
            );
            dependencies.package = {
                dependencies: pkg.dependencies || {},
                devDependencies: pkg.devDependencies || {}
            };
        } catch {
            // No package.json
        }
        
        try {
            const reqResponse = await this.client.get(
                `/repos/${owner}/${repo}/contents/requirements.txt`
            );
            const content = Buffer.from(reqResponse.data.content, 'base64').toString();
            dependencies.python = content.split('\n').filter(Boolean);
        } catch {
            // No requirements.txt
        }
        
        return dependencies;
    }

    async getLanguageStats(owner, repo) {
        const response = await this.client.get(`/repos/${owner}/${repo}/languages`);
        return response.data;
    }

    buildFileStructure(fileList) {
        const structure = {};
        fileList.forEach(file => {
            const parts = file.split('/');
            let current = structure;
            parts.forEach((part, index) => {
                if (index === parts.length - 1) {
                    current[part] = 'file';
                } else {
                    if (!current[part]) current[part] = {};
                    current = current[part];
                }
            });
        });
        return structure;
    }

    extractKeyFeatures(readme) {
        const features = [];
        const lines = readme.split('\n');
        
        let inFeatures = false;
        for (const line of lines) {
            if (line.toLowerCase().includes('features') || 
                line.toLowerCase().includes('what it does')) {
                inFeatures = true;
                continue;
            }
            if (inFeatures && line.startsWith('-')) {
                features.push(line.replace(/^-\s*/, ''));
            }
            if (inFeatures && line.trim() === '' && features.length > 0) {
                break;
            }
        }
        
        return features.length > 0 ? features : ['No features extracted'];
    }
}

export const githubService = new GitHubService();