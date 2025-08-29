import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trees, 
  Zap, 
  Car, 
  Building, 
  Play, 
  Pause, 
  RotateCcw,
  TrendingUp,
  Leaf
} from 'lucide-react';

interface SimulationControlsProps {
  onSimulationChange: (active: boolean) => void;
  isActive: boolean;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({ 
  onSimulationChange, 
  isActive 
}) => {
  const [trees, setTrees] = useState([500]);
  const [solarPanels, setSolarPanels] = useState([200]);
  const [electricVehicles, setElectricVehicles] = useState([30]);
  const [greenBuildings, setGreenBuildings] = useState([15]);

  const simulationParameters = [
    {
      id: 'trees',
      label: 'Trees to Plant',
      icon: Trees,
      value: trees[0],
      setter: setTrees,
      min: 0,
      max: 2000,
      step: 50,
      unit: 'trees',
      impact: 'Reduces CO₂ by ~5kg/tree/year'
    },
    {
      id: 'solar',
      label: 'Solar Panels',
      icon: Zap,
      value: solarPanels[0],
      setter: setSolarPanels,
      min: 0,
      max: 1000,
      step: 25,
      unit: 'panels',
      impact: 'Generates ~4kWh/panel/day'
    },
    {
      id: 'ev',
      label: 'Electric Vehicle %',
      icon: Car,
      value: electricVehicles[0],
      setter: setElectricVehicles,
      min: 0,
      max: 100,
      step: 5,
      unit: '%',
      impact: 'Reduces emissions by 60% per vehicle'
    },
    {
      id: 'buildings',
      label: 'Green Buildings',
      icon: Building,
      value: greenBuildings[0],
      setter: setGreenBuildings,
      min: 0,
      max: 50,
      step: 1,
      unit: 'buildings',
      impact: 'Reduces energy use by 25%'
    }
  ];

  const calculateImpact = () => {
    const treeImpact = (trees[0] / 100) * 2; // 2% improvement per 100 trees
    const solarImpact = (solarPanels[0] / 50) * 1.5; // 1.5% per 50 panels
    const evImpact = electricVehicles[0] * 0.5; // 0.5% per percentage point
    const buildingImpact = greenBuildings[0] * 1; // 1% per building
    
    return {
      pollution: Math.min(50, treeImpact + solarImpact + evImpact),
      temperature: Math.min(20, treeImpact * 0.5 + solarImpact * 0.3),
      greenery: Math.min(80, treeImpact * 2 + buildingImpact),
      overall: Math.min(40, (treeImpact + solarImpact + evImpact + buildingImpact) / 4)
    };
  };

  const impact = calculateImpact();

  const resetSimulation = () => {
    setTrees([500]);
    setSolarPanels([200]);
    setElectricVehicles([30]);
    setGreenBuildings([15]);
    onSimulationChange(false);
  };

  return (
    <div className="space-y-4">
      {/* Simulation Controls Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-primary" />
            Environmental Simulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={isActive ? "destructive" : "default"}
              size="sm"
              onClick={() => onSimulationChange(!isActive)}
              className="flex-1"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={resetSimulation}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {isActive && (
            <Badge variant="outline" className="w-full justify-center bg-success/10 text-success border-success/20">
              Simulation Active - Calculating Impact...
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Parameter Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {simulationParameters.map((param) => {
            const Icon = param.icon;
            return (
              <div key={param.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{param.label}</span>
                  </div>
                  <Badge variant="outline">
                    {param.value} {param.unit}
                  </Badge>
                </div>
                
                <Slider
                  value={[param.value]}
                  onValueChange={(value) => param.setter(value)}
                  max={param.max}
                  min={param.min}
                  step={param.step}
                  className="w-full"
                />
                
                <p className="text-xs text-muted-foreground">{param.impact}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Predicted Impact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-success" />
            Predicted Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Air Quality Improvement</span>
              <span className="text-sm font-medium text-success">+{impact.pollution.toFixed(1)}%</span>
            </div>
            <Progress value={impact.pollution} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Temperature Reduction</span>
              <span className="text-sm font-medium text-success">-{impact.temperature.toFixed(1)}°C</span>
            </div>
            <Progress value={impact.temperature * 5} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Green Coverage</span>
              <span className="text-sm font-medium text-success">+{impact.greenery.toFixed(1)}%</span>
            </div>
            <Progress value={impact.greenery} className="h-2" />
          </div>

          <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-success">Overall Environmental Score</span>
              <span className="text-lg font-bold text-success">+{impact.overall.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Implementation Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Phase 1 (0-6 months)</span>
              <span className="text-foreground">Tree planting, EV infrastructure</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Phase 2 (6-18 months)</span>
              <span className="text-foreground">Solar installation, building retrofits</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Phase 3 (18+ months)</span>
              <span className="text-foreground">Full impact realization</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationControls;