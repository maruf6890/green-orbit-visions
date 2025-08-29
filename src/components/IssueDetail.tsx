import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  MapPin, 
  Calendar,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Thermometer,
  Wind,
  Droplets
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

interface IssueDetailProps {
  issue: Issue;
  onBack: () => void;
}

const IssueDetail: React.FC<IssueDetailProps> = ({ issue, onBack }) => {
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

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'open': return 20;
      case 'investigating': return 60;
      case 'resolved': return 100;
      default: return 0;
    }
  };

  const Icon = getIssueIcon(issue.type);

  // Mock data for detailed view
  const mockTimeline = [
    { date: '2024-01-15', event: 'Issue reported by environmental sensors', status: 'completed' },
    { date: '2024-01-15', event: 'Initial assessment conducted', status: 'completed' },
    { date: '2024-01-16', event: 'Field team dispatched for investigation', status: 'current' },
    { date: '2024-01-17', event: 'Mitigation plan development', status: 'pending' },
    { date: '2024-01-18', event: 'Implementation and monitoring', status: 'pending' }
  ];

  const mockMetrics = [
    { label: 'Current Reading', value: '185 AQI', trend: 'up' },
    { label: 'Normal Range', value: '50-100 AQI', trend: 'neutral' },
    { label: 'Peak Reading', value: '210 AQI', trend: 'up' },
    { label: 'People Affected', value: '~50,000', trend: 'neutral' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Issues
        </Button>
      </div>

      {/* Issue Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-muted">
                <Icon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">{issue.title}</CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{issue.location}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">Affected: {issue.affectedArea}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Badge variant={getSeverityColor(issue.severity) as any}>
                {issue.severity.toUpperCase()}
              </Badge>
              <Badge variant={getStatusColor(issue.status) as any}>
                {issue.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground mb-6">{issue.description}</p>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Resolution Progress</span>
              <span className="text-sm text-muted-foreground">{getProgressValue(issue.status)}%</span>
            </div>
            <Progress value={getProgressValue(issue.status)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Current Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Current Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockMetrics.map((metric, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Investigation Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTimeline.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${
                  item.status === 'completed' ? 'bg-success' :
                  item.status === 'current' ? 'bg-warning' :
                  'bg-muted'
                }`}>
                  {item.status === 'completed' && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                  {item.status === 'current' && (
                    <Clock className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      item.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {item.event}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex space-x-3">
        <Button className="flex-1">
          <MapPin className="w-4 h-4 mr-2" />
          View on Map
        </Button>
        <Button variant="outline" className="flex-1">
          <Users className="w-4 h-4 mr-2" />
          Assign Team
        </Button>
        <Button variant="outline" className="flex-1">
          <TrendingUp className="w-4 h-4 mr-2" />
          Update Status
        </Button>
      </div>
    </div>
  );
};

export default IssueDetail;