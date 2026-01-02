'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Users, MapPin, AlertTriangle, Fuel, TrendingUp } from 'lucide-react'

interface StatsData {
  activeVehicles: { value: number; change: string; trend: string }
  activeDrivers: { value: number; change: string; trend: string }
  ongoingTrips: { value: number; change: string; trend: string }
  activeAlerts: { value: number; change: string; trend: string }
  monthlyRevenue: { value: number; change: string; trend: string }
  fuelEfficiency: { value: number; change: string; trend: string }
}

const statsConfig = [
  {
    key: 'activeVehicles' as keyof StatsData,
    title: 'Active Vehicles',
    icon: Car,
    color: 'text-blue-600',
    format: (value: number) => value.toString()
  },
  {
    key: 'activeDrivers' as keyof StatsData,
    title: 'Active Drivers',
    icon: Users,
    color: 'text-green-600',
    format: (value: number) => value.toString()
  },
  {
    key: 'ongoingTrips' as keyof StatsData,
    title: 'Ongoing Trips',
    icon: MapPin,
    color: 'text-purple-600',
    format: (value: number) => value.toString()
  },
  {
    key: 'activeAlerts' as keyof StatsData,
    title: 'Active Alerts',
    icon: AlertTriangle,
    color: 'text-red-600',
    format: (value: number) => value.toString()
  },
  {
    key: 'monthlyRevenue' as keyof StatsData,
    title: 'Monthly Revenue',
    icon: TrendingUp,
    color: 'text-emerald-600',
    format: (value: number) => `€${value.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  },
  {
    key: 'fuelEfficiency' as keyof StatsData,
    title: 'Fuel Efficiency',
    icon: Fuel,
    color: 'text-orange-600',
    format: (value: number) => `${value.toFixed(1)} L/100km`
  }
]

export function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Failed to load statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="fleetflow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 animate-pulse mb-2"></div>
              <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statsConfig.map((config) => {
          const Icon = config.icon
          return (
            <Card key={config.key} className="fleetflow-card border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
                <Icon className={`h-4 w-4 ${config.color} opacity-50`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">--</div>
                <p className="text-xs text-muted-foreground">Data unavailable</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsConfig.map((config) => {
        const Icon = config.icon
        const statData = stats[config.key]

        return (
          <Card key={config.key} className="fleetflow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{config.format(statData.value)}</div>
              <p className="text-xs text-muted-foreground">{statData.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
