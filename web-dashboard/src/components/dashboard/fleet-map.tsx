'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FleetData {
  fleet: Array<{
    id: string
    license_plate: string
    driver_name: string
    status: 'active' | 'idle' | 'maintenance' | 'offline'
    location: {
      latitude: number
      longitude: number
      address?: string
      last_updated: string
    }
    obd_data?: {
      speed: number
      fuel_level: number
    }
  }>
  total: number
  active: number
  idle: number
  maintenance: number
  offline: number
}

export function FleetMap() {
  const [fleetData, setFleetData] = useState<FleetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFleetData = async () => {
      try {
        const response = await fetch('/api/dashboard/fleet')
        if (!response.ok) {
          throw new Error('Failed to fetch fleet data')
        }
        const data = await response.json()
        setFleetData(data)
      } catch (err) {
        console.error('Error fetching fleet data:', err)
        setError('Failed to load fleet data')
      } finally {
        setLoading(false)
      }
    }

    fetchFleetData()

    // Refresh every 60 seconds
    const interval = setInterval(fetchFleetData, 60000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'idle':
        return 'bg-yellow-500'
      case 'maintenance':
        return 'bg-red-500'
      case 'offline':
        return 'bg-gray-500'
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
      case 'offline':
        return 'Offline'
      default:
        return 'Unknown'
    }
  }

  if (loading) {
    return (
      <Card className="fleetflow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
            <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center mb-4">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-48 mx-auto mb-2"></div>
              <div className="h-3 bg-muted rounded w-32 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="animate-pulse">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-muted rounded w-12"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !fleetData) {
    return (
      <Card className="fleetflow-card border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Fleet Overview
            <Badge variant="secondary">0 vehicles</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-red-50 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-red-600 font-medium">Failed to load fleet data</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please check your connection and try again
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="fleetflow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Fleet Overview
          <Badge variant="secondary">{fleetData.total} vehicles</Badge>
          <div className="flex gap-1 ml-2">
            <Badge variant="default" className="bg-green-100 text-green-800">
              {fleetData.active} active
            </Badge>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {fleetData.idle} idle
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder - In production, integrate with Google Maps or MapBox */}
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
          <div className="text-center z-10">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-muted-foreground">Interactive Map View</p>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time vehicle tracking
            </p>
          </div>

          {/* Mock vehicle markers on map */}
          <div className="absolute inset-0">
            {fleetData.fleet.slice(0, 6).map((vehicle, index) => (
              <div
                key={vehicle.id}
                className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                  vehicle.status === 'active' ? 'bg-green-500' :
                  vehicle.status === 'idle' ? 'bg-yellow-500' :
                  vehicle.status === 'maintenance' ? 'bg-red-500' : 'bg-gray-500'
                }`}
                style={{
                  left: `${20 + (index * 15)}%`,
                  top: `${30 + (index * 10)}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Fleet Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fleetData.fleet.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`} />
                <div>
                  <p className="font-medium">{vehicle.license_plate}</p>
                  <p className="text-sm text-muted-foreground">{vehicle.driver_name}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                  {getStatusText(vehicle.status)}
                </Badge>
                {vehicle.obd_data && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {vehicle.obd_data.speed > 0 ? `${vehicle.obd_data.speed} km/h` : 'Stationary'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {fleetData.fleet.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🚗</div>
            <p className="text-muted-foreground">No vehicles found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Vehicles will appear here once added to your fleet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
