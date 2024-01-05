import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
//import Image from next/image
import Image from 'next/image';

//import logo.scss
import Img from '../../images/svg/logo.svg';

const Logo: React.FC = () => {
  const router = useRouter();
  const cc = useContext(MainContext);

  return (
    // <Link href="/" passHref legacyBehavior>
    <div className="">
      <Link
        href="/"
        passHref
        className="logo"
        onClick={(e) => {
          e.preventDefault();
          console.log('Logo clicked');
          if (cc?.menuOpen) {
            cc.setMenuOpen(false);
          }
          router.push('/');
        }}
      >
        <Img className="w-full" />
        {/* <Image src={Img} alt="Arcan" />
      {/* <Image src={Img} alt="Arcan" /> */}
      </Link>
    </div>
    // </Link>
  );
};

export default Logo;
