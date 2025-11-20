import { useState, ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  children: ReactNode;
}

interface TabProps {
  id: string;
  label: string;
  icon?: ReactNode;
  children: ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

const Tabs: React.FC<TabsProps> = ({ defaultTab, onTabChange, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || '');

  const tabs: Tab[] = [];
  const tabContents: { [key: string]: ReactNode } = {};

  // Extract tabs from children
  if (Array.isArray(children)) {
    children.forEach((child: any) => {
      if (child && child.props) {
        const { id, label, icon, children: content } = child.props;
        tabs.push({ id, label, icon, content });
        tabContents[id] = content;
        
        if (!activeTab && id) {
          setActiveTab(id);
        }
      }
    });
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex space-x-1 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>{tabContents[activeTab]}</div>
    </div>
  );
};

export default Tabs;
