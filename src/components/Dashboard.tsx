import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Thermometer, 
  Wind, 
  Trees, 
  Droplets,
  TrendingUp,
  TrendingDown,
  Settings,
  BarChart3,
  Activity,
  AlertTriangle,
  Home
} from 'lucide-react';
import LeafletMap from './LeafletMap';
import MetricsSidebar from './MetricsSidebar';
import SimulationControls from './SimulationControls';
import DataVisualization from './DataVisualization';
import IssuesList from './IssuesList';
import IssueDetail from './IssueDetail';

const Dashboard = () => {
  const [activeLayer, setActiveLayer] = useState<string>('temperature');
  const [simulationActive, setSimulationActive] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'issues' | 'issue-detail'>('dashboard');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  const layerControls = [
    { id: 'temperature', label: 'Temperature', icon: Thermometer, color: 'temperature' },
    { id: 'pollution', label: 'Air Quality', icon: Wind, color: 'pollution' },
    { id: 'greenery', label: 'Greenery', icon: Trees, color: 'greenery' },
    { id: 'flood', label: 'Flood Risk', icon: Droplets, color: 'flood' }
  ];

  const handleIssueSelect = (issue: any) => {
    setSelectedIssue(issue);
    setCurrentView('issue-detail');
  };

  const handleBackToIssues = () => {
    setCurrentView('issues');
    setSelectedIssue(null);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedIssue(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-environmental-gradient rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">GreenOrbit 2.0</h1>
                <p className="text-sm text-muted-foreground">Smart City Environmental Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant={currentView === 'dashboard' ? 'default' : 'ghost'} 
                size="sm"
                onClick={handleBackToDashboard}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                variant={currentView === 'issues' || currentView === 'issue-detail' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setCurrentView('issues')}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Issues
              </Button>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Real-time Data
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {currentView === 'dashboard' && (
        <div className="flex h-[calc(100vh-80px)]">
          {/* Main Map Area */}
          <div className="flex-1 relative">
            {/* Layer Controls - Now as Select */}
            <div className="absolute top-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Environmental Layer</h3>
              <Select value={activeLayer} onValueChange={setActiveLayer}>
                <SelectTrigger className="w-48 bg-background">
                  <SelectValue placeholder="Select layer" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-[1001]">
                  {layerControls.map((layer) => {
                    const Icon = layer.icon;
                    return (
                      <SelectItem key={layer.id} value={layer.id} className="hover:bg-muted">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span>{layer.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Map Component */}
            <LeafletMap activeLayer={activeLayer} />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Legend</h4>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="text-muted-foreground">Good</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <span className="text-muted-foreground">Moderate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <span className="text-muted-foreground">Poor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-card border-l border-border overflow-y-auto">
            <Tabs defaultValue="metrics" className="h-full">
              <TabsList className="grid w-full grid-cols-3 m-4">
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="simulation">Simulate</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics" className="m-0 p-4 pt-0">
                <MetricsSidebar activeLayer={activeLayer} />
              </TabsContent>
              
              <TabsContent value="simulation" className="m-0 p-4 pt-0">
                <SimulationControls 
                  onSimulationChange={setSimulationActive}
                  isActive={simulationActive}
                />
              </TabsContent>
              
              <TabsContent value="analytics" className="m-0 p-4 pt-0">
                <DataVisualization activeLayer={activeLayer} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {currentView === 'issues' && (
        <div className="p-6">
          <IssuesList onIssueSelect={handleIssueSelect} />
        </div>
      )}

      {currentView === 'issue-detail' && selectedIssue && (
        <div className="p-6">
          <IssueDetail issue={selectedIssue} onBack={handleBackToIssues} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;