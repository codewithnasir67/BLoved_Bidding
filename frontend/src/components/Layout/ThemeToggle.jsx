import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BiMoon, BiSun } from 'react-icons/bi';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex items-center">
            <div
                className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer p-1 transition-colors duration-300"
                onClick={toggleTheme}
            >
                <div
                    className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                        }`}
                >
                    {theme === 'dark' ? (
                        <BiMoon className="text-gray-800 text-xs" />
                    ) : (
                        <BiSun className="text-yellow-500 text-xs" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThemeToggle;
