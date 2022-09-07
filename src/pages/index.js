import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import Image from "@theme/IdealImage";
import logo from "../../static/img/logo-left-text.png";
import mutosplash from "../../static/img/muto-splash.png";

const features = [
  {
    title: <>Adaptive</>,
    imageUrl: "img/modular.png",
    description: (
      <>
        Muto is a context aware software solution to address some of the runtime
        adaptivity{" "}
        <a href="https://www.darpa.mil/work-with-us/ai-next-campaign">
          challenges
        </a>{" "}
        in autonomous and robotic platforms. Adaptive Muto stacks support
        connected architectures for autonomous and software-defined vehicles,
        including supporting cloud-based apps and services that can dynamically
        change.
      </>
    ),
  },
  {
    title: <>ROS</>,
    imageUrl: "img/ros-logo-color.png",
    description: (
      <>
        Muto is a platform that supports ROS from{" "}
        <a href="https://www.openrobotics.org/">Open Robotics</a>.The Robot
        Operating System (ROS) is a set of software libraries and tools for
        building robot applications. ROS has widespread use in many autonomous
        applications such as the{" "}
        <a href="https://www.autoware.auto/">Autoware.Auto</a> open-source
        autonomous driving stack , as well as many other opensource and
        commercial systems and solutions.
      </>
    ),
  },
  {
    title: <>Extensible</>,
    imageUrl: "img/modular.png",
    description: (
      <>
        Muto is built on an extensible architecture. Similar to plugins and the
        extension points that are foundational to Eclipse extensibility. many of
        Muto's functionality are implemented as plugins that you can easily
        replace and modify for your requirements. You can add new ROS nodes for
        controlling, monitoring, composing and adapting vehicle behavior as
        plugins. The Muto dashboard is also extensible with our own{" "}
        <a href="/liveui">LiveUI</a> framework.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <div className="text--justify">
        <p>{description}</p>
      </div>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const bannerImg = useBaseUrl("img/banner-img.png");

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Muto is a context aware software solution to address some of the runtime adaptivity challenges in autonomous and robotic platform"
    >
      <header className={classnames("hero hero--primary", styles.mutoBanner)}>
        <div className="container">
          {/* <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p> */}
          <div className="row">
            <div
              className={classnames(
                "col col--6",
                styles.feature,
                styles.valign
              )}
            >
              <Image img={logo} alt="Muto Logo" />
              <div className={styles.buttons}>
                <Link
                  className={classnames("button button--primary button--lg")}
                  style={{ marginRight: 10 }}
                  to={useBaseUrl("docs/muto")}
                >
                  Get Started
                </Link>
                <Link
                  className={classnames("button button--secondary button--lg")}
                  style={{ background: "#ccd0cf" }}
                  to={useBaseUrl("docs/muto")}
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className={classnames("col col--6")}>
              <Image
                className={styles.splashImage}
                img={mutosplash}
                alt={"banner img"}
              />
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
      </main>
    </Layout>
  );
}

export default Home;
