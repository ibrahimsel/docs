module.exports = {
  title: 'Eclipse Muto',
  tagline: 'Adaptive orchestration for ROS 2 software stacks on vehicles and edge devices',
  url: 'https://github.com',
  baseUrl: '/docs/',
  favicon: 'img/favicon.ico',
  organizationName: 'eclipse-muto',
  projectName: 'docs',
  deploymentBranch: 'gh-pages',
  onBrokenLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  plugins: ['docusaurus-plugin-sass', '@docusaurus/plugin-ideal-image'],
  themeConfig: {
    background: 'light',
    prism: {
      defaultLanguage: 'python',
      additionalLanguages: ['bash', 'yaml', 'json', 'protobuf', 'typescript'],
    },
    navbar: {
      title: 'Muto',
      logo: {
        alt: 'Eclipse Muto Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/intro',
          activeBasePath: 'docs/intro',
          label: 'Introduction',
          position: 'left',
        },
        {
          to: 'docs/getting-started/installation',
          activeBasePath: 'docs/getting-started',
          label: 'Getting Started',
          position: 'left',
        },
        {
          to: 'docs/architecture/system-overview',
          activeBasePath: 'docs/architecture',
          label: 'Architecture',
          position: 'left',
        },
        {
          to: 'docs/guides/authoring-bundles',
          activeBasePath: 'docs/guides',
          label: 'Guides',
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
              to: 'docs/intro',
            },
            {
              label: 'Getting Started',
              to: 'docs/getting-started/installation',
            },
            {
              label: 'Architecture',
              to: 'docs/architecture/system-overview',
            },
            {
              label: 'Guides',
              to: 'docs/guides/authoring-bundles',
            },
          ],
        },
        {
          title: 'Components',
          items: [
            {
              label: 'Daemon (mutod)',
              to: 'docs/architecture/daemon',
            },
            {
              label: 'Agent',
              to: 'docs/architecture/agent',
            },
            {
              label: 'Composer',
              to: 'docs/architecture/composer',
            },
            {
              label: 'CLI',
              to: 'docs/architecture/cli',
            },
            {
              label: 'Dashboard',
              to: 'docs/architecture/dashboard',
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
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Reference',
              to: 'docs/reference/manifest-schema',
            },
            {
              label: 'Developer Guide',
              to: 'docs/developer-guide/project-structure',
            },
          ],
        },
      ],
      copyright: `Copyright &copy; ${new Date().getFullYear()} <a href="https://eclipse.org">Eclipse Foundation</a> - All rights reserved`,
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
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      },
    ],
  ],
};
