import { Home, Calendar, TrendingUp, Bell } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "planner", label: "Planner", icon: Calendar },
    { id: "grades", label: "Grades", icon: TrendingUp },
    { id: "reminders", label: "Reminders", icon: Bell }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-border/50 p-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-smooth ${
                isActive 
                  ? 'bg-gradient-primary text-white shadow-soft' 
                  : 'text-muted-foreground hover:text-primary hover:bg-muted/30'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;