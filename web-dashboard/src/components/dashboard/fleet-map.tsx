'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock fleet data
const fleetData = [
  {
    id: 'V001',
    driver: 'John Smith',
    status: 'active',
    location: 'Sarajevo Center',
    coordinates: { lat: 43.8563, lng: 18.3132 },
    speed: 45,
    fuel: 78,
  },
  {
    id: 'V002',
    driver: 'Maria Garcia',
    status: 'idle',
    location: 'Airport Road',
    coordinates: { lat: 43.8248, lng: 18.3317 },
    speed: 0,
    fuel: 92,
  },
  {
    id: 'V003',
    driver: 'Ahmed Hassan',
    status: 'maintenance',
    location: 'Service Center',
    coordinates: { lat: 43.8500, lng: 18.3000 },
    speed: 0,
    fuel: 15,
  },
  {
    id: 'V004',
    driver: 'Lisa Johnson',
    status: 'active',
    location: 'Highway A1',
    coordinates: { lat: 43.8700, lng: 18.3200 },
    speed: 85,
    fuel: 45,
  },
]

export function FleetMap() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'idle':
        return 'bg-yellow-500'
      case 'maintenance':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'idle':
        return 'Idle'
      case 'maintenance':
        return 'Maintenance'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card className="fleetflow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Fleet Overview
          <Badge variant="secondary">{fleetData.length} vehicles</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder - In production, integrate with Google Maps or MapBox */}
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-muted-foreground">Interactive Map View</p>
            <p className="text-sm text-muted-foreground mt-1">
              Google Maps integration planned
            </p>
          </div>
        </div>

        {/* Fleet Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fleetData.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`} />
                <div>
                  <p className="font-medium">{vehicle.id}</p>
                  <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                  {getStatusText(vehicle.status)}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {vehicle.speed > 0 ? `${vehicle.speed} km/h` : 'Stationary'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
