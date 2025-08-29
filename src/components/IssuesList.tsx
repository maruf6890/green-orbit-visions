import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Thermometer, 
  Wind, 
  Droplets,
  MapPin,
  Calendar,
  TrendingUp,
  Eye
} from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  type: 'temperature' | 'pollution' | 'flood' | 'greenery';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  reportedDate: string;
  description: string;
  affectedArea: string;
  status: 'open' | 'investigating' | 'resolved';
}

const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'High Air Pollution in Old Dhaka',
    type: 'pollution',
    severity: 'critical',
    location: 'Old Dhaka',
    reportedDate: '2024-01-15',
    description: 'AQI levels have reached 180+ in Old Dhaka area due to increased industrial activity and vehicle emissions.',
    affectedArea: '2.5 km²',
    status: 'investigating'
  },
  {
    id: '2',
    title: 'Urban Heat Island Effect',
    type: 'temperature',
    severity: 'high',
    location: 'Dhaka Central',
    reportedDate: '2024-01-14',
    description: 'Temperature readings show 4°C higher than surrounding areas due to concrete infrastructure.',
    affectedArea: '1.8 km²',
    status: 'open'
  },
  {
    id: '3',
    title: 'Flood Risk Assessment',
    type: 'flood',
    severity: 'medium',
    location: 'Gulshan Area',
    reportedDate: '2024-01-13',
    description: 'Poor drainage system identified during monsoon season preparations.',
    affectedArea: '3.2 km²',
    status: 'investigating'
  },
  {
    id: '4',
    title: 'Deforestation Alert',
    type: 'greenery',
    severity: 'high',
    location: 'Uttara',
    reportedDate: '2024-01-12',
    description: 'Significant reduction in green cover detected in residential development areas.',
    affectedArea: '1.2 km²',
    status: 'open'
  }
];

interface IssuesListProps {
  onIssueSelect?: (issue: Issue) => void;
}

const IssuesList: React.FC<IssuesListProps> = ({ onIssueSelect }) => {
  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'temperature': return Thermometer;
      case 'pollution': return Wind;
      case 'flood': return Droplets;
      case 'greenery': return TrendingUp;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'investigating': return 'warning';
      case 'resolved': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Environmental Issues</h2>
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
          {mockIssues.filter(issue => issue.status === 'open').length} Active Issues
        </Badge>
      </div>
      
      <div className="grid gap-4">
        {mockIssues.map((issue) => {
          const Icon = getIssueIcon(issue.type);
          
          return (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{issue.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{issue.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Badge variant={getSeverityColor(issue.severity) as any} className="text-xs">
                      {issue.severity.toUpperCase()}
                    </Badge>
                    <Badge variant={getStatusColor(issue.status) as any} className="text-xs">
                      {issue.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">{issue.description}</p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Reported: {new Date(issue.reportedDate).toLocaleDateString()}</span>
                  </div>
                  <span>Affected: {issue.affectedArea}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onIssueSelect?.(issue)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default IssuesList;