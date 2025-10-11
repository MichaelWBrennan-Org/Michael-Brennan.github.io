/**
 * Page-Aware Legal Navigation System
 * Automatically adjusts links based on current page location
 */

class LegalNavigation {
    constructor() {
        this.currentPath = window.location.pathname;
        this.baseUrl = window.location.origin;
        this.isGamePage = this.currentPath.includes('/games/');
        this.isMainPage = this.currentPath === '/' || this.currentPath === '/index.html';
        this.isLegalPage = this.currentPath.includes('legal') || this.isLegalDocument();
        
        this.init();
    }

    init() {
        this.updateAllLinks();
        this.addBreadcrumbs();
        this.highlightCurrentSection();
        this.tailorLegalFooter();
    }

    isLegalDocument() {
        const legalDocs = [
            'privacy-policy', 'terms-of-service', 'accessibility-statement',
            'cookie-policy', 'website-disclaimer', 'dmca-policy', 'eula',
            'refund-policy', 'legal-protection-summary', 'arbitration-agreement',
            'force-majeure-clause', 'liability-waiver', 'Match-3-privacy-policy',
            'infinite-match-privacy-policy', 'infinite-match-terms', 'infinite-match-eula',
            'infinite-match-cookie-policy', 'infinite-match-accessibility-statement',
            'infinite-match-refund-policy'
        ];
        return legalDocs.some(doc => this.currentPath.includes(doc));
    }

    getRelativePath(targetPath) {
        const currentDir = this.getCurrentDirectory();
        const targetDir = this.getTargetDirectory(targetPath);
        
        if (currentDir === targetDir) {
            return targetPath.split('/').pop();
        }
        
        if (this.isGamePage && !targetPath.includes('/games/')) {
            return '../' + targetPath;
        }
        
        if (!this.isGamePage && targetPath.includes('/games/')) {
            return 'games/' + targetPath.split('/').pop();
        }
        
        return targetPath;
    }

    getCurrentDirectory() {
        if (this.isGamePage) return 'games';
        if (this.isMainPage) return 'main';
        return 'main';
    }

    getTargetDirectory(targetPath) {
        if (targetPath.includes('/games/')) return 'games';
        return 'main';
    }

    updateAllLinks() {
        // Update all legal document links
        const legalLinks = document.querySelectorAll('a[href*="privacy-policy"], a[href*="terms-of-service"], a[href*="accessibility-statement"], a[href*="cookie-policy"], a[href*="website-disclaimer"], a[href*="dmca-policy"], a[href*="eula"], a[href*="refund-policy"], a[href*="legal-protection-summary"], a[href*="arbitration-agreement"], a[href*="force-majeure-clause"], a[href*="liability-waiver"], a[href*="Match-3-privacy-policy"], a[href*="infinite-match-terms"], a[href*="infinite-match-eula"]');
        
        legalLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                const newHref = this.getRelativePath(href);
                link.setAttribute('href', newHref);
            }
        });

        // Update main navigation links
        const navLinks = document.querySelectorAll('.nav-link[href*="index.html"]');
        navLinks.forEach(link => {
            if (this.isGamePage) {
                link.setAttribute('href', '../index.html');
            } else {
                link.setAttribute('href', 'index.html');
            }
        });

        // Update footer links
        this.updateFooterLinks();
    }

    updateFooterLinks() {
        const footerLinks = document.querySelectorAll('.footer-links a');
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                if (href.includes('index.html')) {
                    link.setAttribute('href', this.isGamePage ? '../index.html' : 'index.html');
                } else if (href.includes('legal.html')) {
                    link.setAttribute('href', this.isGamePage ? '../legal.html' : 'legal.html');
                } else if (href.includes('sitemap.xml')) {
                    link.setAttribute('href', this.isGamePage ? '../sitemap.xml' : 'sitemap.xml');
                } else if (href.includes('manifest.json')) {
                    link.setAttribute('href', this.isGamePage ? '../manifest.json' : 'manifest.json');
                }
            }
        });
    }

    // Reduce footer legal links based on current page context
    tailorLegalFooter() {
        const legalSections = Array.from(document.querySelectorAll('.footer .footer-links'));
        if (legalSections.length === 0) return;

        // Do not prune links on the consolidated legal index page
        const isLegalIndex = this.currentPath.endsWith('/legal.html') || this.currentPath.endsWith('legal.html');
        if (isLegalIndex) return;

        legalSections.forEach(section => {
            const headingEl = section.querySelector('h4');
            const heading = (headingEl ? headingEl.textContent : '' || '').toLowerCase().trim();
            if (!heading.includes('legal')) return;

            const listItems = Array.from(section.querySelectorAll('ul > li'));
            if (listItems.length === 0) return;

            // Determine allowed tokens per context
            let allowedTokens = [];
            if (this.isGamePage) {
                if (heading.includes('game')) {
                    allowedTokens = [
                        'infinite-match-privacy-policy',
                        'match-3-privacy-policy',
                        'infinite-match-terms',
                        'infinite-match-eula'
                    ];
                } else if (heading.includes('main')) {
                    allowedTokens = ['legal.html'];
                } else {
                    // Generic legal heading on game page: keep minimal
                    allowedTokens = [
                        'infinite-match-privacy-policy',
                        'infinite-match-terms',
                        'infinite-match-eula',
                        'legal.html'
                    ];
                }
            } else {
                // Main site pages
                allowedTokens = [
                    'legal.html',
                    'privacy-policy',
                    'terms-of-service',
                    'cookie-policy'
                ];
            }

            listItems.forEach(li => {
                const anchor = li.querySelector('a');
                if (!anchor) return;
                const href = (anchor.getAttribute('href') || '').toLowerCase();
                const keep = allowedTokens.some(token => href.includes(token));
                if (!keep) {
                    li.style.display = 'none';
                }
            });
        });
    }

    addBreadcrumbs() {
        if (this.isLegalDocument()) {
            this.createBreadcrumbs();
        }
    }

    createBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumbs');
        if (!breadcrumbContainer) {
            const container = document.createElement('div');
            container.className = 'breadcrumbs';
            container.innerHTML = this.generateBreadcrumbHTML();
            
            const content = document.querySelector('.container');
            if (content) {
                content.insertBefore(container, content.firstChild);
            }
        }
    }

    generateBreadcrumbHTML() {
        const breadcrumbs = [
            { name: 'Home', url: this.isGamePage ? '../index.html' : 'index.html' }
        ];

        if (this.isGamePage) {
            breadcrumbs.push({ name: 'Games', url: 'infinite-match.html' });
        }

        breadcrumbs.push({ name: this.getCurrentPageName(), url: '' });

        return `
            <nav aria-label="Breadcrumb" class="breadcrumb-nav">
                <ol class="breadcrumb-list">
                    ${breadcrumbs.map((crumb, index) => `
                        <li class="breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}">
                            ${crumb.url ? `<a href="${crumb.url}">${crumb.name}</a>` : crumb.name}
                        </li>
                    `).join('')}
                </ol>
            </nav>
        `;
    }

    getCurrentPageName() {
        const path = this.currentPath.split('/').pop().replace('.html', '');
        const nameMap = {
            'privacy-policy': 'Privacy Policy',
            'terms-of-service': 'Terms of Service',
            'accessibility-statement': 'Accessibility Statement',
            'cookie-policy': 'Cookie Policy',
            'website-disclaimer': 'Website Disclaimer',
            'dmca-policy': 'DMCA Policy',
            'eula': 'End User License Agreement',
            'refund-policy': 'Refund Policy',
            'legal-protection-summary': 'Legal Protection Summary',
            'arbitration-agreement': 'Arbitration Agreement',
            'force-majeure-clause': 'Force Majeure Clause',
            'liability-waiver': 'Liability Waiver',
            'Match-3-privacy-policy': 'Game Privacy Policy',
            'infinite-match-terms': 'Game Terms of Service',
            'infinite-match-eula': 'Game EULA'
        };
        return nameMap[path] || 'Legal Document';
    }

    highlightCurrentSection() {
        const currentDoc = this.getCurrentPageName().toLowerCase().replace(/\s+/g, '-');
        const currentLink = document.querySelector(`a[href*="${currentDoc}"]`);
        if (currentLink) {
            currentLink.classList.add('current-legal-doc');
        }
    }

    // Method to get legal document links for current context
    getLegalDocumentLinks() {
        const basePath = this.isGamePage ? '../' : '';
        
        return {
            main: {
                privacy: `${basePath}privacy-policy.html`,
                terms: `${basePath}terms-of-service.html`,
                accessibility: `${basePath}accessibility-statement.html`,
                cookie: `${basePath}cookie-policy.html`,
                disclaimer: `${basePath}website-disclaimer.html`,
                dmca: `${basePath}dmca-policy.html`,
                eula: `${basePath}eula.html`,
                refund: `${basePath}refund-policy.html`,
                legal: `${basePath}legal.html`
            },
            games: {
                privacy: 'Match-3-privacy-policy.html',
                terms: 'infinite-match-terms.html',
                eula: 'infinite-match-eula.html'
            }
        };
    }
}

// Initialize safely whether or not DOMContentLoaded already fired
(function initLegalNavWhenReady() {
    const init = () => {
        try { new LegalNavigation(); } catch (e) { /* no-op */ }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// Add CSS for breadcrumbs and current document highlighting
const style = document.createElement('style');
style.textContent = `
    .breadcrumbs {
        background: #f8fafc;
        padding: 1rem 0;
        margin-bottom: 2rem;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .breadcrumb-nav {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem;
    }
    
    .breadcrumb-list {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 0.5rem;
    }
    
    .breadcrumb-item {
        color: #6b7280;
        font-size: 0.875rem;
    }
    
    .breadcrumb-item:not(:last-child)::after {
        content: '›';
        margin-left: 0.5rem;
        color: #9ca3af;
    }
    
    .breadcrumb-item a {
        color: #4f46e5;
        text-decoration: none;
    }
    
    .breadcrumb-item a:hover {
        text-decoration: underline;
    }
    
    .breadcrumb-item.active {
        color: #374151;
        font-weight: 500;
    }
    
    .current-legal-doc {
        background-color: #e0e7ff !important;
        color: #3730a3 !important;
        font-weight: 600 !important;
    }
    
    @media (max-width: 768px) {
        .breadcrumb-list {
            flex-wrap: wrap;
        }
    }
`;
document.head.appendChild(style);