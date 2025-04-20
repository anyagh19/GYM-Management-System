import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu } from 'lucide-react';
import LogOutBtn from './LogOutBtn';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const authStatus = useSelector((state) => state.auth.status); // Boolean
  const role = useSelector((state) => state.auth.role); // 'admin', 'trainer', 'user'

  const navItems = [
    { name: 'Home', url: '/', active: role !== 'admin' && role !== 'user'},
    { name: 'Dashboard', url: '/member', active: role === 'user' },
    { name: 'Dashboard', url: '/trainer', active: role === 'trainer' },
    { name: 'Gyms', url: '/gym_card', active: role !== 'admin' },
    { name: 'About', url: '/about', active: role !== 'admin' },
    
    { name: 'Contact', url: '/contact', active: role !== 'admin'},
    { name: 'Admin', url: '/admin', active: role === 'admin' },
    
    { name: 'Login', url: '/login', active: !authStatus },
  ];

  return (
    <header className='bg-gray-800 shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center'>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className='text-red-600 font-bold text-xl cursor-pointer tracking-wide'
        >
           GYM_X
        </div>

        {/* Desktop Menu */}
        <ul className='hidden md:flex gap-6 items-center'>
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.url)}
                  className={` text-white text-md font-medium transition duration-200 ${
                    location.pathname === item.url
                      ? 'text-black underline underline-offset-4'
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ) : null
          )}
          {authStatus === true && (
            <li>
              <LogOutBtn />
            </li>
          )}
        </ul>

        {/* Mobile Menu Icon */}
        <button onClick={() => setMenuOpen(!menuOpen)} className='md:hidden text-white'>
          <Menu size={26} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className='md:hidden bg-gray-800 px-4 pb-4 shadow-md'>
          <ul className='flex flex-col gap-4'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      navigate(item.url);
                      setMenuOpen(false);
                    }}
                    className={`text-md text-white font-medium block w-full text-left ${
                      location.pathname === item.url
                        ? 'text-black underline underline-offset-4'
                        : 'text-gray-700 hover:text-red-600'
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus === true && (
              <li>
                <LogOutBtn />
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
