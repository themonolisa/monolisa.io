import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  //Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const Logo = require('@site/static/img/monolisa.svg').default;

const FeatureList: FeatureItem[] = [
  {
    title: 'Five core concepts',
    description: (
      <>
        MonoLISA is a mnemonic for five core concepts: monorepo practice, layered libraries, interface segregation, single responsibilities, and agile architecture.
      </>
    ),
  },
  {
    title: 'Stack-agnostic',
    description: (
      <>
        MonoLISA is an architectural pattern. It applies to repositories in virtually any stack, from TypeScript to .NET.
      </>
    ),
  },
  {
    title: 'Battle Tested',
    description: (
      <>
        MonoLISA has been battle-tested since 2021. It scales from small teams to large codebases.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      {/* <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div> */}
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
      <div className="text--center">
        <Logo className={styles.painting} role="img" />
      </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
