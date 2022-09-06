module.exports = {
  title: 'Eclipse Muto',
  tagline: 'Adaptive ROS framework and a runtime platform for dynamically composable model-driven ROS software stacks',
  url: 'https://github.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'eclipse-muto', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  deploymentBranch: 'gh-pages', 
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
          activeBasePath: 'docs',
          label: 'Introduction',
          position: 'left',
        },
        {
          to: 'liveui',
          activeBasePath: 'liveui',
          label: 'LiveUI',
          position: 'left',
        },
        {
          to: 'showcase',
          activeBasePath: 'showcase',
          label: 'LiveUI Showcase',
          position: 'left',
        },
        // {
        //   to: 'support',
        //   activeBasePath: 'support',
        //   label: 'Support',/docs/intro
        //   position: 'left',
        // },
        // {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/eclipse-muto',
          label: 'Muto on GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: './docs/muto',
            },
            {
              label: 'Getting Started',
              to: './docs/LiveUI/getting-started/getting-started-react',
            },
            {
              label: 'Explore The Code',
              to: './docs/LiveUI/explore',
            },
            {
              label: 'API Reference',
              to: './docs/LiveUI/api-reference',
            },
            {
              label: 'Contributing',
              to: 'docs/contributing',
            },
            {
              label: 'Support',
              to: './docs/LiveUI/support/troubleshooting',
            },
          ],
        },
        // {
        //   title: 'Community',
        //   items: [
        //     {
        //       label: 'Stack Overflow',
        //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
        //     },
        //     {
        //       label: 'Discord',
        //       href: 'https://discordapp.com/invite/docusaurus',
        //     },
        //     {
        //       label: 'Twitter',
        //       href: 'https://twitter.com/docusaurus',
        //     },
        //   ],
        // },
        {
          title: 'More',
          items: [
            // {
            //   label: 'Blog',
            //   to: 'blog',
            // },
            {
              label: 'GitHub',
              href: 'https://github.com/eclipse-muto',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://eclipse.org">Eclipse Foundation</a>  - All rights reserved`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
          'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
          'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      },
    ],
  ],
};
