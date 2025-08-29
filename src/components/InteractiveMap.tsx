import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Info } from 'lucide-react';

interface MapPoint {
  id: string;
  x: number;
  y: number;
  name: string;
  metrics: {
    temperature: number;
    pollution: number;
    greenery: number;
    flood: number;
  };
}

interface InteractiveMapProps {
  activeLayer: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ activeLayer }) => {
  const [hoveredPoint, setHoveredPoint] = useState<MapPoint | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock city data points
  const cityPoints: MapPoint[] = [
    {
      id: '1',
      x: 25,
      y: 30,
      name: 'Downtown District',
      metrics: { temperature: 28, pollution: 85, greenery: 15, flood: 20 }
    },
    {
      id: '2',
      x: 60,
      y: 45,
      name: 'Industrial Zone',
      metrics: { temperature: 32, pollution: 95, greenery: 5, flood: 40 }
    },
    {
      id: '3',
      x: 80,
      y: 20,
      name: 'Residential Area',
      metrics: { temperature: 24, pollution: 45, greenery: 70, flood: 15 }
    },
    {
      id: '4',
      x: 40,
      y: 70,
      name: 'Green Park',
      metrics: { temperature: 22, pollution: 25, greenery: 95, flood: 10 }
    },
    {
      id: '5',
      x: 70,
      y: 60,
      name: 'Waterfront',
      metrics: { temperature: 26, pollution: 35, greenery: 60, flood: 70 }
    }
  ];

  const getPointColor = (point: MapPoint) => {
    const value = point.metrics[activeLayer as keyof typeof point.metrics];
    
    switch (activeLayer) {
      case 'temperature':
        if (value > 30) return 'bg-temperature-hot';
        if (value > 25) return 'bg-temperature-moderate';
        return 'bg-temperature-cool';
      case 'pollution':
        if (value > 70) return 'bg-pollution-high';
        if (value > 40) return 'bg-pollution-moderate';
        return 'bg-pollution-low';
      case 'greenery':
        if (value > 70) return 'bg-greenery-high';
        if (value > 40) return 'bg-greenery-moderate';
        return 'bg-greenery-low';
      case 'flood':
        if (value > 50) return 'bg-flood-high';
        if (value > 30) return 'bg-flood-moderate';
        return 'bg-flood-low';
      default:
        return 'bg-muted';
    }
  };

  const getMetricUnit = (layer: string) => {
    switch (layer) {
      case 'temperature': return '°C';
      case 'pollution': return 'AQI';
      case 'greenery': return '%';
      case 'flood': return '% Risk';
      default: return '';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-background to-muted/30 overflow-hidden">
      {/* Map Background with Grid */}
      <div 
        ref={mapRef}
        className="absolute inset-0 bg-grid-pattern opacity-10"
        onMouseMove={handleMouseMove}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      >
        {/* Simulated City Areas */}
        <div className="absolute inset-0">
          {/* Downtown area */}
          <div className="absolute left-[20%] top-[25%] w-32 h-24 bg-muted/20 rounded-lg border border-border/50"></div>
          
          {/* Industrial zone */}
          <div className="absolute left-[55%] top-[40%] w-28 h-20 bg-muted/30 rounded-lg border border-border/50"></div>
          
          {/* Residential area */}
          <div className="absolute left-[75%] top-[15%] w-24 h-28 bg-muted/15 rounded-lg border border-border/50"></div>
          
          {/* Green park */}
          <div className="absolute left-[35%] top-[65%] w-36 h-32 bg-success/10 rounded-full border border-success/20"></div>
          
          {/* Water body */}
          <div className="absolute left-[65%] top-[55%] w-40 h-24 bg-blue-200/30 rounded-full border border-blue-300/30"></div>
        </div>

        {/* Data Points */}
        {cityPoints.map((point) => (
          <div
            key={point.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            onMouseEnter={() => setHoveredPoint(point)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <div 
              className={`w-4 h-4 rounded-full ${getPointColor(point)} shadow-lg border-2 border-white 
                group-hover:scale-150 transition-transform duration-200 animate-pulse-slow`}
            >
              <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping"></div>
            </div>
            <MapPin className="w-3 h-3 text-foreground/60 absolute -top-1 left-1/2 transform -translate-x-1/2" />
          </div>
        ))}

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-50 pointer-events-none animate-slide-in"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10
            }}
          >
            <Card className="bg-card/95 backdrop-blur-sm border border-border shadow-lg">
              <div className="p-3 space-y-2">
                <h4 className="font-semibold text-sm text-foreground">{hoveredPoint.name}</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {hoveredPoint.metrics[activeLayer as keyof typeof hoveredPoint.metrics]}
                    {getMetricUnit(activeLayer)}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize">{activeLayer}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temp:</span>
                    <span className="text-foreground">{hoveredPoint.metrics.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AQI:</span>
                    <span className="text-foreground">{hoveredPoint.metrics.pollution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Green:</span>
                    <span className="text-foreground">{hoveredPoint.metrics.greenery}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flood:</span>
                    <span className="text-foreground">{hoveredPoint.metrics.flood}%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Map Info */}
      <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-3">
        <div className="flex items-center space-x-2 text-sm">
          <Info className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Hover over points for details</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;