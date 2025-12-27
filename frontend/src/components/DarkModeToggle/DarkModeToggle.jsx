import { Sun, Moon } from 'lucide-react';
import './DarkModeToggle.css'; // We'll create this CSS file

const DarkModeToggle = ({ isDark, onToggle, size = 'default' }) => {
  return (
    <button
      onClick={onToggle}
      className={`dark-mode-toggle ${size} ${isDark ? 'dark' : 'light'}`}
      aria-label="Toggle dark mode"
    >
      <span className={`toggle-slider ${isDark ? 'active' : ''}`} />
      
      {/* Sun Icon */}
      <Sun 
        className={`toggle-icon sun-icon ${isDark ? 'hidden' : 'visible'}`}
        size={size === 'small' ? 12 : 16}
      />
      
      {/* Moon Icon */}
      <Moon 
        className={`toggle-icon moon-icon ${isDark ? 'visible' : 'hidden'}`}
        size={size === 'small' ? 12 : 16}
      />
    </button>
  );
};

export default DarkModeToggle;