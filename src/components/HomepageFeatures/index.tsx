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
    title: 'Easy to Grasp',
    description: (
      <>
        You can count MonoLISA's concepts on your hand: Monorepo practice, Layered Libraries, Interface Segregation, Single Responsibilities, and Agile Architecture.
      </>
    ),
  },
  {
    title: 'Generic',
    description: (
      <>
        MonoLISA is a design pattern. As a result, you can apply it to repositories of virtually any stack, such as TypeScript, .NET, Java, Python, etc.
      </>
    ),
  },
  {
    title: 'Battle Tested',
    description: (
      <>
        MonoLISA has been tried and tested since 2021. It's been giving engineers the joy of coding in clean and agile repositories.
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
