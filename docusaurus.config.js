module.exports = {
  title: 'Eclipse Muto',
  tagline: 'Declarative orchestrator for managing ROS software stacks on edge devices',
  url: 'https://github.com',
  baseUrl: '/docs/',
  favicon: 'img/favicon.ico',
  organizationName: 'eclipse-muto', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: ['docusaurus-plugin-sass', '@docusaurus/plugin-ideal-image'],
  themeConfig: {
    background: 'light',
    prism: {
      defaultLanguage: 'javascript',
    },
    navbar: {
      title: 'Muto',
      logo: {
        alt: 'Eclipse Muto Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/muto',
          activeBasePath: 'docs/muto',
          label: 'Introduction',
          position: 'left',
        },
        {
          to: 'docs/muto-edge',
          activeBasePath: 'docs/muto-edge',
          label: 'Edge',
          position: 'left',
        },
        {
          to: 'docs/blueprint',
          activeBasePath: 'docs/blueprint',
          label: 'Blueprints',
          position: 'left',
        },
        {
          to: 'liveui',
          activeBasePath: 'liveui',
          label: 'LiveUI',
          position: 'left',
        },
        {
          href: 'https://github.com/eclipse-muto',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/docs/muto',
            },
            {
              label: 'Getting Started',
              to: '/docs/muto-edge/getting-started',
            },
            {
              label: 'Blueprints',
              to: '/docs/blueprint',
            },
            {
              label: 'User Guide',
              to: '/docs/user-guide',
            },
            {
              label: 'Developer Guide',
              to: '/docs/developer-guide',
            },
          ],
        },
        {
          title: 'Components',
          items: [
            {
              label: 'Agent',
              to: '/docs/muto-edge/mutoagent',
            },
            {
              label: 'Composer',
              to: '/docs/muto-edge/mutocomposer',
            },
            {
              label: 'Digital Twins',
              to: '/docs/muto-twins',
            },
            {
              label: 'Dashboard',
              to: '/docs/muto-dashboard',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/eclipse-muto',
            },
            {
              label: 'Eclipse Foundation',
              href: 'https://projects.eclipse.org/projects/automotive.muto',
            },
            {
              label: 'Contributing',
              to: '/docs/contributing/contributing',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Sandbox',
              href: 'https://sandbox.composiv.ai',
            },
            {
              label: 'Dashboard Demo',
              href: 'https://dashboard.composiv.ai',
            },
            {
              label: 'LiveUI',
              to: '/docs/LiveUI',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://eclipse.org">Eclipse Foundation</a> - All rights reserved`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
          'https://github.com/eclipse-muto/docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
          'https://github.com/eclipse-muto/docs/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      },
    ],
  ],
};
