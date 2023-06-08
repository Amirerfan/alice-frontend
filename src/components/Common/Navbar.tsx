import logo from '../../assets/images/navbar/logo.svg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar flex justify-between items-center py-9 pl-14 pr-12">
      <div className="navbar__left">
        <Link to={'/'}>
          <img src={logo} alt={''} className="w-[120px] h-auto" />
        </Link>
      </div>
      <div className="navbar__right flex justify-end items-center gap-4">
        <Link className={'flex--1'} to={'/create'}>
          <button className="btn btn--small">Create BonPION</button>
        </Link>
        <button className="btn btn--small">Buy PION</button>
        <button className="btn btn--small btn--dark-primary">
          Balance: <strong className="ml-2 mr-1">2310.013</strong>
          <strong className="text-xyz-75">PION</strong>
        </button>
        <button className="btn btn--small btn--dark-primary">
          0x5a03…c7ef
        </button>
      </div>
    </div>
  );
};

export default Navbar;