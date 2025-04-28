import { Button } from './ui/button';

interface WeatherTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function WeatherTabs({ activeTab, onTabChange }: WeatherTabsProps) {
  return (
    <div className="flex gap-4 mb-6">
      <Button variant="secondary" onClick={() => onTabChange('today')}
        className={`flex-1 py-2 px-4 rounded-full text-white transition-colors ${
          activeTab === 'today' ? 'bg-black/20' : 'bg-transparent'
        }`}>Today</Button>
      <Button variant="secondary" onClick={() => onTabChange('week')}
        className={`flex-1 py-2 px-4 rounded-full text-white transition-colors ${
          activeTab === 'week' ? 'bg-black/20' : 'bg-transparent'
        }`}>Next 5 days</Button>
    </div>
  );
}