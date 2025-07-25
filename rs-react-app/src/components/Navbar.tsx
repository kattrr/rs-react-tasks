import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-indigo-900 text-white top-0 py-3 px-6 flex items-center justify-between mb-8 shadow">
      <div className="flex items-center gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-lg font-bold transition-colors ${isActive ? 'underline underline-offset-4 text-yellow-300' : 'hover:text-yellow-300'}`
          }
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `text-lg font-bold transition-colors ${isActive ? 'underline underline-offset-4 text-yellow-300' : 'hover:text-yellow-300'}`
          }
        >
          About
        </NavLink>
      </div>
      <span className="font-mono text-sm text-indigo-200">Pokédex SPA</span>
    </nav>
  );
};

export default Navbar; 