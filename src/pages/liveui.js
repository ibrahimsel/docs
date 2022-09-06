import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import Image from '@theme/IdealImage';
import logo from '../../static/img/logo-left-text-liveui.png';

const features = [
  {
    title: <>Modular</>,
    imageUrl: 'img/modular.png',
    description: (
      <>
       LiveUI helps you divide a monolithic frontend into smaller, more manageable <a href="https://martinfowler.com/articles/micro-frontends.html">micro frontends</a>. 
       There is no magic, LiveUI allows you to split and manage your codebase, teams, release processes and runtimes independently.
      </>
    ),
  },
  {
    title: <>Framework Support</>,
    imageUrl: 'img/compatible.png',
    description: (
      <>
        LiveUI is framework and bundler agnostic. It works with <a href="https://reactjs.org/">React.js</a>, <a href="https://reactnative.dev/">React Native</a>. <a href="https://vuejs.org/">Vue.js</a>, <a href="https://nativescript.org/">NativeScript</a> support is in the works.  You can use with with the bundler of your choice such as <a href="https://webpack.js.org/">Webpack</a>, <a href="https://facebook.github.io/metro/">Metro</a> and others. It will reuse support from the underlying stack such as the upcoming  <a href="https://webpack.js.org/concepts/module-federation/">Module federation</a> from webpack 5 automatically, or default to its own.
      </>
    ),
  },
  {
    title: <>Open Source</>,
    imageUrl: 'img/open-source.png',
    description: (
      <>
        LiveUI is open source and developer friendly. LiveUI was designed from the ground up to be easy. It comes with tools and samples that will get your project up and running quickly.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const bannerImg = useBaseUrl('img/banner-img.png');

  return (
    <Layout
      title={`LiveUI`}
      description="LiveUI helps you divide a monolithic frontend into smaller, more manageable micro frontends.">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          {/* <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p> */}
          <div className="row">
            <div className={classnames('col col--6', styles.feature, styles.valign)}>
              <Image img={logo} alt="LiveUI Logo" />
              <div className={styles.buttons}>
              <Link
                className={classnames(
                  'button button--primary button--lg'
                )}
                style={{ marginRight: 10 }}
                to={useBaseUrl('docs/LiveUI/getting-started/zero-configuration')}>
                Get Started
              </Link>
              <Link
                className={classnames(
                  'button button--secondary button--lg'
                )}
                style={{background: '#ccd0cf'}}
                to={useBaseUrl('docs/muto')}>
                Learn More
              </Link>
            </div>
            </div>
            <div className={classnames('col col--6')}>
              <img className={styles.bannerImage} src={bannerImg} alt={'banner img'} />
            </div>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
          <section className={styles.video}>
            <div className="container">
              <iframe width="1120" height="630" src="https://www.youtube.com/embed/t6sSNCjK0AU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </section>
      </main>
    </Layout>
  );
}

export default Home;
