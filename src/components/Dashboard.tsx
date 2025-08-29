import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Activity
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';
import MetricsSidebar from './MetricsSidebar';
import SimulationControls from './SimulationControls';
import DataVisualization from './DataVisualization';

const Dashboard = () => {
  const [activeLayer, setActiveLayer] = useState<string>('temperature');
  const [simulationActive, setSimulationActive] = useState(false);

  const layerControls = [
    { id: 'temperature', label: 'Temperature', icon: Thermometer, color: 'temperature' },
    { id: 'pollution', label: 'Air Quality', icon: Wind, color: 'pollution' },
    { id: 'greenery', label: 'Greenery', icon: Trees, color: 'greenery' },
    { id: 'flood', label: 'Flood Risk', icon: Droplets, color: 'flood' }
  ];

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

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Map Area */}
        <div className="flex-1 relative">
          {/* Layer Controls */}
          <div className="absolute top-4 left-4 z-10 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Environmental Layers</h3>
            <div className="space-y-2">
              {layerControls.map((layer) => {
                const Icon = layer.icon;
                const isActive = activeLayer === layer.id;
                return (
                  <Button
                    key={layer.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveLayer(layer.id)}
                    className={`w-full justify-start ${
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {layer.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Map Component */}
          <InteractiveMap activeLayer={activeLayer} />

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
    </div>
  );
};

export default Dashboard;