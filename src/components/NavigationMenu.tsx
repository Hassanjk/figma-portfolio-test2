import React from 'react';
import { useScrollStore } from '../store/useScrollStore';

interface NavigationMenuProps {
  onNavigate: (view: number) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ onNavigate }) => {
  const { currentView } = useScrollStore();

  const menuItems = [
    { id: 1, label: 'HOME' },
    { id: 2, label: 'PROJECTS' },
    { id: 3, label: 'ABOUT' },
    { id: 4, label: 'CONTACT' }
  ];

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <div className="flex flex-col gap-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`text-left text-sm tracking-wider transition-all duration-300 ${
              currentView === item.id
                ? 'text-primary font-medium translate-x-2'
                : 'text-gray-500 hover:text-gray-700 hover:translate-x-1'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationMenu;