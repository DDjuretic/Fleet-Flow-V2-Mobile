import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Thermometer, Fuel, Wrench, Zap } from 'lucide-react'

// Mock alerts data
const alerts = [
  {
    id: '1',
    type: 'temperature',
    severity: 'high',
    title: 'Engine Overheat',
    message: 'Vehicle V001 engine temperature at 110°C',
    vehicle: 'V001',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    icon: Thermometer,
  },
  {
    id: '2',
    type: 'fuel',
    severity: 'medium',
    title: 'Low Fuel Level',
    message: 'Vehicle V003 fuel level below 20%',
    vehicle: 'V003',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    icon: Fuel,
  },
  {
    id: '3',
    type: 'maintenance',
    severity: 'low',
    title: 'Maintenance Due',
    message: 'Vehicle V002 due for oil change',
    vehicle: 'V002',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: Wrench,
  },
  {
    id: '4',
    type: 'battery',
    severity: 'medium',
    title: 'Low Battery',
    message: 'Vehicle V004 battery voltage at 11.8V',
    vehicle: 'V004',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    icon: Zap,
  },
]

export function AlertsPanel() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else {
      const diffHours = Math.floor(diffMins / 60)
      return `${diffHours}h ago`
    }
  }

  return (
    <Card className="fleetflow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Active Alerts
        </CardTitle>
        <Badge variant="destructive">{alerts.length}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-6">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = alert.icon
            return (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className={`p-1 rounded-full ${
                  alert.severity === 'high' ? 'bg-red-100' :
                  alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  <Icon className={`h-4 w-4 ${
                    alert.severity === 'high' ? 'text-red-600' :
                    alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Vehicle {alert.vehicle}</span>
                    <span>{formatTimeAgo(alert.timestamp)}</span>
                  </div>
                </div>
              </div>
            )
          )}
        )}

        {alerts.length > 0 && (
          <Button variant="outline" className="w-full mt-4">
            View All Alerts
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
