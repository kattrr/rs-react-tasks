import { NavLink } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';

const Navbar = () => {
  return (
    <nav className="w-full bg-indigo-200 text-indigo-900 top-0 py-6 px-[20%] flex items-center justify-between mb-8 shadow">
      <div className="flex items-center gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-lg font-bold transition-colors ${isActive ? 'underline underline-offset-4 text-purple-400' : 'hover:text-purple-500'}`
          }
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `text-lg font-bold transition-colors ${isActive ? 'underline underline-offset-4 text-purple-400' : 'hover:text-purple-500'}`
          }
        >
          About
        </NavLink>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSelector />
        <span className="font-mono text-sm text-indigo-200">Pokédex SPA</span>
      </div>
    </nav>
  );
};

export default Navbar;
