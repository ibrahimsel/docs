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
    title: <>Safe Deployment</>,
    imageUrl: "img/modular.png",
    description: (
      <>
        Deploy software to vehicles with confidence using A/B slot deployment.
        Every update is cryptographically signed, schema-validated, and instantly
        rollbackable. A bad update never bricks a vehicle.
      </>
    ),
  },
  {
    title: <>ROS 2 Native</>,
    imageUrl: "img/ros-logo-color.png",
    description: (
      <>
        Built for{" "}
        <a href="https://www.openrobotics.org/">ROS 2</a> from the ground up.
        Lifecycle node management, topic-based health probes, graph monitoring,
        and DDS configuration — all integrated into a declarative bundle format.
      </>
    ),
  },
  {
    title: <>Fleet Scale</>,
    imageUrl: "img/modular.png",
    description: (
      <>
        Manage hundreds of vehicles from a single dashboard. Monitor health,
        trigger mode transitions, deploy bundles, and track every action through
        a tamper-proof audit log.
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

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Adaptive orchestration for ROS 2 software stacks on vehicles and edge devices"
    >
      <header className={classnames("hero hero--primary", styles.mutoBanner)}>
        <div className="container">
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
                  to={useBaseUrl("docs/intro")}
                >
                  Get Started
                </Link>
                <Link
                  className={classnames("button button--secondary button--lg")}
                  style={{ background: "#ccd0cf" }}
                  to={useBaseUrl("docs/architecture/system-overview")}
                >
                  Architecture
                </Link>
              </div>

            </div>
            <div className={classnames("col col--6")}>
              <Image
                className={styles.splashImage}
                img={mutosplash}
                alt={"banner img"}
              />
              <h3 style={{color:"white"}}>Adaptive orchestration for ROS 2 software stacks on vehicles and edge devices</h3>
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
