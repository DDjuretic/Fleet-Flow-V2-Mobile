import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { FleetMap } from '@/components/dashboard/fleet-map'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { AlertsPanel } from '@/components/dashboard/alerts-panel'

export default async function DashboardPage() {
  // Server-side auth check
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check onboarding status
  const { data: userProfile } = await supabase
    .from('users')
    .select('onboarding_status')
    .eq('user_id', user.id)
    .single()

  if (userProfile?.onboarding_status === 'pending') {
    redirect('/onboarding')
  }
  return (
    <DashboardShell>
      <DashboardHeader
        heading="FleetFlow Dashboard"
        text="Monitor your fleet in real-time"
      />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Stats Overview */}
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards />
        </Suspense>

        {/* Main Content Grid */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Fleet Map - Takes full width on mobile, 2 cols on larger screens */}
          <div className="xl:col-span-2">
            <Suspense fallback={<FleetMapSkeleton />}>
              <FleetMap />
            </Suspense>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-4">
            <Suspense fallback={<AlertsPanelSkeleton />}>
              <AlertsPanel />
            </Suspense>

            <Suspense fallback={<RecentActivitySkeleton />}>
              <RecentActivity />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

// Loading skeletons
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="fleetflow-card p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function FleetMapSkeleton() {
  return (
    <div className="fleetflow-card p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
        <div className="h-96 bg-muted rounded"></div>
      </div>
    </div>
  )
}

function AlertsPanelSkeleton() {
  return (
    <div className="fleetflow-card p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RecentActivitySkeleton() {
  return (
    <div className="fleetflow-card p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
