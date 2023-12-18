import Link from 'next/link';

//import Image from next/image
import Image from 'next/image';

//import logo.scss
import styles from '@/components/logo/logo.module.scss';
import img from '../../images/svg/logo.svg';

const Logo: React.FC = () => (
  <Link href="/" passHref legacyBehavior>
    <div className={styles.logo}>
      <Image src={img} alt="Arcan" />
    </div>
  </Link>
);

export default Logo;
