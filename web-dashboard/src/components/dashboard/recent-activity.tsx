import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Car, User, MapPin, Fuel, Wrench } from 'lucide-react'

// Mock activity data
const activities = [
  {
    id: '1',
    type: 'trip_started',
    title: 'Trip Started',
    description: 'John Smith started trip to Sarajevo Airport',
    vehicle: 'V001',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    icon: Car,
    color: 'text-blue-600',
  },
  {
    id: '2',
    type: 'fuel_refill',
    title: 'Fuel Refill',
    description: 'Vehicle V003 refueled at Shell Station',
    vehicle: 'V003',
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    icon: Fuel,
    color: 'text-green-600',
  },
  {
    id: '3',
    type: 'maintenance',
    title: 'Maintenance Completed',
    description: 'Oil change completed for vehicle V002',
    vehicle: 'V002',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    icon: Wrench,
    color: 'text-orange-600',
  },
  {
    id: '4',
    type: 'driver_login',
    title: 'Driver Login',
    description: 'Maria Garcia logged into the system',
    vehicle: 'V002',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    icon: User,
    color: 'text-purple-600',
  },
  {
    id: '5',
    type: 'location_update',
    title: 'Location Update',
    description: 'Vehicle V004 arrived at destination',
    vehicle: 'V004',
    timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
    icon: MapPin,
    color: 'text-red-600',
  },
]

export function RecentActivity() {
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

  const getActivityTypeBadge = (type: string) => {
    switch (type) {
      case 'trip_started':
        return <Badge variant="default">Trip</Badge>
      case 'fuel_refill':
        return <Badge variant="secondary">Fuel</Badge>
      case 'maintenance':
        return <Badge variant="outline">Maintenance</Badge>
      case 'driver_login':
        return <Badge className="bg-purple-100 text-purple-800">Driver</Badge>
      case 'location_update':
        return <Badge className="bg-red-100 text-red-800">Location</Badge>
      default:
        return <Badge variant="outline">Activity</Badge>
    }
  }

  return (
    <Card className="fleetflow-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className={`p-2 rounded-full bg-muted`}>
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    {getActivityTypeBadge(activity.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Vehicle {activity.vehicle}</span>
                    <span>{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
