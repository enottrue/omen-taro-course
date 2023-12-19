import Link from 'next/link';

//import Image from next/image
import Image from 'next/image';

//import logo.scss
import Img from '../../images/svg/logo.svg';

const Logo: React.FC = () => (
  // <Link href="/" passHref legacyBehavior>
  <div className="">
    <Link href="/" passHref className="logo">
      <Img className="w-full" />

      {/* <Image src={Img} alt="Arcan" />
      {/* <Image src={Img} alt="Arcan" /> */}
    </Link>
  </div>
  // </Link>
);

export default Logo;
