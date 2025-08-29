import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Thermometer, 
  Wind, 
  Trees, 
  Droplets,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface MetricsSidebarProps {
  activeLayer: string;
}

const MetricsSidebar: React.FC<MetricsSidebarProps> = ({ activeLayer }) => {
  const todayMetrics = {
    temperature: { current: 26, change: -2, trend: 'down', status: 'good' },
    pollution: { current: 65, change: +8, trend: 'up', status: 'moderate' },
    greenery: { current: 45, change: +3, trend: 'up', status: 'good' },
    flood: { current: 25, change: -5, trend: 'down', status: 'good' }
  };

  const alerts = [
    { 
      id: 1, 
      type: 'warning', 
      message: 'Air quality moderate in Industrial Zone',
      time: '2 hours ago'
    },
    { 
      id: 2, 
      type: 'success', 
      message: 'Temperature decreased citywide',
      time: '4 hours ago'
    },
    { 
      id: 3, 
      type: 'info', 
      message: 'New green space project completed',
      time: '1 day ago'
    }
  ];

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'temperature': return Thermometer;
      case 'pollution': return Wind;
      case 'greenery': return Trees;
      case 'flood': return Droplets;
      default: return Thermometer;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'success';
      case 'moderate': return 'warning';
      case 'poor': return 'destructive';
      default: return 'muted';
    }
  };

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'temperature': return '°C';
      case 'pollution': return 'AQI';
      case 'greenery': return '%';
      case 'flood': return '% Risk';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Layer Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            {React.createElement(getMetricIcon(activeLayer), { 
              className: "w-5 h-5 mr-2 text-primary" 
            })}
            {activeLayer.charAt(0).toUpperCase() + activeLayer.slice(1)} Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">City Average</span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-foreground">
                {todayMetrics[activeLayer as keyof typeof todayMetrics].current}
                {getMetricUnit(activeLayer)}
              </span>
              {todayMetrics[activeLayer as keyof typeof todayMetrics].trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-destructive" />
              ) : (
                <TrendingDown className="w-4 h-4 text-success" />
              )}
            </div>
          </div>
          
          <Progress 
            value={todayMetrics[activeLayer as keyof typeof todayMetrics].current} 
            className="h-2"
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">24h Change</span>
            <Badge variant={
              todayMetrics[activeLayer as keyof typeof todayMetrics].change > 0 ? 'destructive' : 'default'
            }>
              {todayMetrics[activeLayer as keyof typeof todayMetrics].change > 0 ? '+' : ''}
              {todayMetrics[activeLayer as keyof typeof todayMetrics].change}
              {getMetricUnit(activeLayer)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* All Metrics Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Daily Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(todayMetrics).map(([key, data]) => {
            const Icon = getMetricIcon(key);
            return (
              <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium capitalize">{key}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline"
                    className={`border-${getStatusColor(data.status)}/20 bg-${getStatusColor(data.status)}/10 text-${getStatusColor(data.status)}`}
                  >
                    {data.current}{getMetricUnit(key)}
                  </Badge>
                  {data.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-destructive" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-success" />
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Alerts & Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3 p-2 rounded-lg bg-muted/30">
              {alert.type === 'warning' && (
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
              )}
              {alert.type === 'success' && (
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
              )}
              {alert.type === 'info' && (
                <div className="w-4 h-4 rounded-full bg-accent mt-0.5"></div>
              )}
              <div className="flex-1">
                <p className="text-sm text-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 rounded-lg bg-success/10">
            <div className="text-lg font-bold text-success">5</div>
            <div className="text-xs text-muted-foreground">Good Areas</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-warning/10">
            <div className="text-lg font-bold text-warning">2</div>
            <div className="text-xs text-muted-foreground">Moderate</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-destructive/10">
            <div className="text-lg font-bold text-destructive">1</div>
            <div className="text-xs text-muted-foreground">Poor Areas</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-accent/10">
            <div className="text-lg font-bold text-accent">12</div>
            <div className="text-xs text-muted-foreground">Monitoring</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsSidebar;