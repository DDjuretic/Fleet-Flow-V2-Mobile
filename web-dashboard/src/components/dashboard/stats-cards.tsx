import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Users, MapPin, AlertTriangle, Fuel, TrendingUp } from 'lucide-react'

// Mock data - in production, fetch from API
const stats = [
  {
    title: 'Active Vehicles',
    value: '24',
    change: '+2 from yesterday',
    icon: Car,
    color: 'text-blue-600',
  },
  {
    title: 'Active Drivers',
    value: '18',
    change: '+1 from yesterday',
    icon: Users,
    color: 'text-green-600',
  },
  {
    title: 'Ongoing Trips',
    value: '12',
    change: '3 completed today',
    icon: MapPin,
    color: 'text-purple-600',
  },
  {
    title: 'Active Alerts',
    value: '3',
    change: '1 critical',
    icon: AlertTriangle,
    color: 'text-red-600',
  },
  {
    title: 'Fuel Efficiency',
    value: '8.2 L/100km',
    change: '-0.3 from last week',
    icon: Fuel,
    color: 'text-orange-600',
  },
  {
    title: 'Monthly Revenue',
    value: '€45,230',
    change: '+12% from last month',
    icon: TrendingUp,
    color: 'text-emerald-600',
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="fleetflow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
