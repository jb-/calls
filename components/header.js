import Link from 'next/link';

const Header = () => (

  <div className="header">
    <style jsx>{`
      .header{
        height:80px; 
        background: #151515; 
        overflow:hidden;
        position:fixed; 
        top:0; 
        left:0; 
        right:0; 
        z-index:100;
        box-shadow : rgba(0, 0, 0, 0.25) 0px 4px 12px;
      }
    `}</style>
    <div className="header-container container">
      <p className='logo'>logo</p>
      <div className="tabBox">
        <Link href="/">
          <a className='tab'>index</a>
        </Link>
        <Link href="/another">
          <a className='tab'>another</a>
        </Link>
        <Link href="/circle">
          <a className='tab'>circle</a>
        </Link>
      </div>
    </div>
  </div>
);

export default Header;
