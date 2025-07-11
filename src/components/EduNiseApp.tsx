import { useState } from "react";
import AuthScreen from "./AuthScreen";
import Dashboard from "./Dashboard";
import Planner from "./Planner";
import Reminders from "./Reminders";
import GradeTracker from "./GradeTracker";
import BottomNavigation from "./BottomNavigation";

const EduNiseApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "planner":
        return <Planner />;
      case "grades":
        return <GradeTracker />;
      case "reminders":
        return <Reminders />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      {renderActiveScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default EduNiseApp;