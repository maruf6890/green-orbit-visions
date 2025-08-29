import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPoint {
  id: string;
  position: LatLngTuple;
  name: string;
  metrics: {
    temperature: number;
    pollution: number;
    greenery: number;
    flood: number;
  };
}

interface LeafletMapProps {
  activeLayer: string;
}

// Dhaka city bounds and areas
const dhakaCenter: LatLngTuple = [23.8103, 90.4125];
const dhakaPoints: MapPoint[] = [
  {
    id: '1',
    position: [23.8103, 90.4125],
    name: 'Dhaka Central',
    metrics: { temperature: 32, pollution: 85, greenery: 15, flood: 60 }
  },
  {
    id: '2', 
    position: [23.7461, 90.3742],
    name: 'Old Dhaka',
    metrics: { temperature: 34, pollution: 95, greenery: 5, flood: 70 }
  },
  {
    id: '3',
    position: [23.8759, 90.3795],
    name: 'Uttara',
    metrics: { temperature: 30, pollution: 65, greenery: 40, flood: 30 }
  },
  {
    id: '4',
    position: [23.7574, 90.3782],
    name: 'Dhanmondi',
    metrics: { temperature: 31, pollution: 70, greenery: 35, flood: 45 }
  },
  {
    id: '5',
    position: [23.8056, 90.3650],
    name: 'Gulshan',
    metrics: { temperature: 29, pollution: 60, greenery: 50, flood: 25 }
  }
];

// Layer overlay polygons for different areas
const layerAreas = [
  {
    id: 'high-pollution',
    positions: [
      [23.7261, 90.3542] as LatLngTuple,
      [23.7661, 90.3942] as LatLngTuple,
      [23.7461, 90.4142] as LatLngTuple,
      [23.7261, 90.3742] as LatLngTuple,
    ],
    type: 'pollution',
    level: 'high'
  },
  {
    id: 'flood-zone',
    positions: [
      [23.7903, 90.3925] as LatLngTuple,
      [23.8303, 90.4325] as LatLngTuple,
      [23.8103, 90.4525] as LatLngTuple,
      [23.7703, 90.4125] as LatLngTuple,
    ],
    type: 'flood',
    level: 'high'
  },
  {
    id: 'green-area',
    positions: [
      [23.8559, 90.3595] as LatLngTuple,
      [23.8959, 90.3995] as LatLngTuple,
      [23.8759, 90.4195] as LatLngTuple,
      [23.8359, 90.3795] as LatLngTuple,
    ],
    type: 'greenery',
    level: 'high'
  }
];

const LayerOverlays: React.FC<{ activeLayer: string }> = ({ activeLayer }) => {
  const getLayerColor = (type: string, level: string) => {
    switch (type) {
      case 'temperature':
        return level === 'high' ? '#ef4444' : level === 'medium' ? '#f97316' : '#22c55e';
      case 'pollution':
        return level === 'high' ? '#ef4444' : level === 'medium' ? '#f97316' : '#22c55e';
      case 'greenery':
        return level === 'high' ? '#22c55e' : level === 'medium' ? '#f97316' : '#ef4444';
      case 'flood':
        return level === 'high' ? '#3b82f6' : level === 'medium' ? '#06b6d4' : '#22c55e';
      default:
        return '#6b7280';
    }
  };

  return (
    <>
      {layerAreas
        .filter(area => area.type === activeLayer)
        .map(area => (
          <Polygon
            key={area.id}
            positions={area.positions}
            pathOptions={{
              color: getLayerColor(area.type, area.level),
              fillColor: getLayerColor(area.type, area.level),
              fillOpacity: 0.3,
              weight: 2
            }}
          />
        ))}
    </>
  );
};

const LeafletMap: React.FC<LeafletMapProps> = ({ activeLayer }) => {
  const getMarkerColor = (point: MapPoint) => {
    const value = point.metrics[activeLayer as keyof typeof point.metrics];
    
    switch (activeLayer) {
      case 'temperature':
        if (value > 32) return '#ef4444';
        if (value > 30) return '#f97316';
        return '#22c55e';
      case 'pollution':
        if (value > 80) return '#ef4444';
        if (value > 60) return '#f97316';
        return '#22c55e';
      case 'greenery':
        if (value > 40) return '#22c55e';
        if (value > 20) return '#f97316';
        return '#ef4444';
      case 'flood':
        if (value > 50) return '#3b82f6';
        if (value > 30) return '#06b6d4';
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const getMetricUnit = (layer: string) => {
    switch (layer) {
      case 'temperature': return '°C';
      case 'pollution': return ' AQI';
      case 'greenery': return '%';
      case 'flood': return '% Risk';
      default: return '';
    }
  };

  const createCustomIcon = (color: string) => {
    return new Icon({
      iconUrl: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}"/>
          <circle cx="12.5" cy="12.5" r="5" fill="white"/>
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        center={dhakaCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LayerOverlays activeLayer={activeLayer} />
        
        {dhakaPoints.map((point) => (
          <Marker
            key={point.id}
            position={point.position}
            icon={createCustomIcon(getMarkerColor(point))}
          >
            <Popup>
              <Card className="border-0 shadow-none p-0">
                <div className="p-3 space-y-2">
                  <h4 className="font-semibold text-sm text-foreground">{point.name}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {point.metrics[activeLayer as keyof typeof point.metrics]}
                      {getMetricUnit(activeLayer)}
                    </Badge>
                    <span className="text-xs text-muted-foreground capitalize">{activeLayer}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temp:</span>
                      <span className="text-foreground">{point.metrics.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AQI:</span>
                      <span className="text-foreground">{point.metrics.pollution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Green:</span>
                      <span className="text-foreground">{point.metrics.greenery}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Flood:</span>
                      <span className="text-foreground">{point.metrics.flood}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;