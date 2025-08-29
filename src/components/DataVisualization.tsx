import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, BarChart3, Activity, PieChart as PieChartIcon } from 'lucide-react';

interface DataVisualizationProps {
  activeLayer: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ activeLayer }) => {
  // Mock historical data for trends
  const trendData = [
    { time: '00:00', temperature: 22, pollution: 45, greenery: 60, flood: 15 },
    { time: '04:00', temperature: 20, pollution: 40, greenery: 60, flood: 12 },
    { time: '08:00', temperature: 24, pollution: 65, greenery: 58, flood: 18 },
    { time: '12:00', temperature: 28, pollution: 85, greenery: 55, flood: 25 },
    { time: '16:00', temperature: 30, pollution: 90, greenery: 52, flood: 30 },
    { time: '20:00', temperature: 26, pollution: 70, greenery: 55, flood: 22 },
  ];

  // Mock district comparison data
  const districtData = [
    { district: 'Downtown', current: 85, simulated: 65 },
    { district: 'Industrial', current: 95, simulated: 70 },
    { district: 'Residential', current: 45, simulated: 30 },
    { district: 'Green Park', current: 25, simulated: 15 },
    { district: 'Waterfront', current: 35, simulated: 25 },
  ];

  // Mock distribution data for pie chart
  const distributionData = [
    { name: 'Good', value: 35, color: 'hsl(var(--success))' },
    { name: 'Moderate', value: 45, color: 'hsl(var(--warning))' },
    { name: 'Poor', value: 20, color: 'hsl(var(--destructive))' },
  ];

  // Historical weekly data
  const weeklyData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 72 },
    { day: 'Wed', value: 68 },
    { day: 'Thu', value: 85 },
    { day: 'Fri', value: 90 },
    { day: 'Sat', value: 75 },
    { day: 'Sun', value: 60 },
  ];

  const getMetricLabel = (layer: string) => {
    switch (layer) {
      case 'temperature': return 'Temperature (°C)';
      case 'pollution': return 'Air Quality Index';
      case 'greenery': return 'Green Coverage (%)';
      case 'flood': return 'Flood Risk (%)';
      default: return 'Metric';
    }
  };

  const getMetricColor = (layer: string) => {
    switch (layer) {
      case 'temperature': return '#ef4444';
      case 'pollution': return '#f97316';
      case 'greenery': return '#22c55e';
      case 'flood': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" />
            Data Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trends" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends" className="space-y-4 mt-4">
              {/* 24-Hour Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    24-Hour Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="time" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey={activeLayer}
                        stroke={getMetricColor(activeLayer)}
                        fill={getMetricColor(activeLayer)}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Weekly Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Weekly Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="day" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={getMetricColor(activeLayer)}
                        strokeWidth={3}
                        dot={{ fill: getMetricColor(activeLayer), strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="compare" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    District Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={districtData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="district" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="current" 
                        fill="hsl(var(--destructive))" 
                        name="Current"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="simulated" 
                        fill="hsl(var(--success))" 
                        name="After Simulation"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="distribution" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <PieChartIcon className="w-4 h-4 mr-2" />
                    City-wide Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Legend */}
                  <div className="flex justify-center space-x-4 mt-4">
                    {distributionData.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm text-muted-foreground">
                          {entry.name} ({entry.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-success">↓ 15%</div>
                    <div className="text-sm text-muted-foreground">This Week</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">8.2</div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVisualization;