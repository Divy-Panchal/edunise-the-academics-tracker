import { Home, Calendar, TrendingUp, Target, MessageCircle } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "planner", label: "Planner", icon: Calendar },
    { id: "resources", label: "Resources", icon: MessageCircle },
    { id: "grades", label: "Grades", icon: TrendingUp },
    { id: "focus", label: "Focus", icon: Target }
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 safe-area-pb">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-2xl p-2 max-w-md mx-auto">
        <div className="flex items-center justify-around relative">
          {/* Active Tab Background */}
          <div 
            className="absolute top-1 bottom-1 bg-gradient-primary rounded-xl transition-all duration-300 ease-out shadow-soft"
            style={{
              width: `${100 / tabs.length}%`,
              left: `${(tabs.findIndex(tab => tab.id === activeTab) * 100) / tabs.length}%`,
            }}
          />
          
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 z-10 ${
                isActive 
                  ? 'text-white transform scale-105' 
                  : 'text-muted-foreground hover:text-primary hover:scale-105'
              }`}
            >
              <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'animate-bounce-gentle' : ''}`} />
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-70'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;