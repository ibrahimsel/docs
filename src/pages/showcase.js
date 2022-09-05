import React from 'react';
import Layout from '@theme/Layout';
import styles from './styles.module.css';
import Image from '@theme/IdealImage';
import classnames from 'classnames';

const TITLE = 'Showcase';
const DESCRIPTION =
  'Here is our sample projects that are built with LiveUI.';
const projects = [
  // Please add in alphabetical order of title.
  {
    title: 'Book Universe (Multiple Code Bases of LiveUI for React)',
    description:
      'E-commerce website with LiveUI. Live Payment Screen, live Categories and Cart components. This project is an example of multiple code bases for React.',
    preview: require('../../static/img/showcase-book-universe.png'),
    document: 'https://liveui.composiv.ai/docs/sample-react',
    source: 'https://github.com/composiv/liveui-samples',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Eventies (Multiple Code Bases of LiveUI for React Native)',
    description: 'Event application with LiveUI. Live Login Screen, live Event Box and Event Details components. This project is an example of multiple code bases for React Native.',
    preview: require('../../static/img/showcase-eventies.png'),
    document: 'https://liveui.composiv.ai/docs/sample-react-native',
    source: 'https://github.com/composiv/liveui-samples',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'ToDos (Single Code Base of LiveUI for React Native)',
    description:
      'To Do application with LiveUI. Live To Do Boxes. This project is an example of single code base for React Native.',
    preview: require('../../static/img/showcase-todos.png'),
    document: 'https://liveui.composiv.ai/docs/sample-advanced-react-native',
    source: 'https://github.com/composiv/liveui-samples',
    fbOpenSource: false,
    pinned: false,
  },
  {
    title: 'Book Universe (Single Code Base of LiveUI for React)',
    description: 'E-commerce website with LiveUI. Live Payment Screen, live Categories and Cart components. This project is an example of single code base for React.',
    preview: require('../../static/img/showcase-book-universe-advanced.png'),
    document: 'https://liveui.composiv.ai/docs/sample-advanced-react',
    source: 'https://github.com/composiv/liveui-samples',
    fbOpenSource: false,
    pinned: false,
  },
];

function Showcase() {

  return (
    <Layout title="Showcase">
      <main className="container margin-vert--lg">
        <div className="text--center margin-bottom--xl">
          <h1>{TITLE}</h1>
          <p>{DESCRIPTION}</p>
        </div>
        <div className="row">
          {projects.map((project) => (
            <div key={project.title} className="col col--4 margin-bottom--lg">
              <div className={classnames('card', styles.showcaseUser, styles.cardHeight)}>
                <div className="card__image">
                  <Image img={project.preview} alt={project.title} />
                </div>
                <div className="card__body">
                  <div className="avatar">
                    <div className="avatar__intro margin-left--none">
                      <h4 className="avatar__name">{project.title}</h4>
                      <small className="avatar__subtitle">
                        {project.description}
                      </small>
                    </div>
                  </div>
                </div>
                {(project.document || project.source) && (
                  <div className="card__footer">
                    <div className="button-group button-group--block">
                      {project.document && (
                        <a
                          className="button button--small button--secondary button--block"
                          href={project.document}
                          target="_blank"
                          rel="noreferrer noopener">
                          Document
                        </a>
                      )}
                      {project.source && (
                        <a
                          className="button button--small button--secondary button--block"
                          href={project.source}
                          target="_blank"
                          rel="noreferrer noopener">
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}

export default Showcase;