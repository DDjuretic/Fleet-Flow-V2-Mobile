/**
 * Fleet Data API Route
 * Provides real-time fleet information for the web dashboard map
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

interface FleetVehicle {
  id: string
  license_plate: string
  driver_name: string
  driver_id: string
  status: 'active' | 'idle' | 'maintenance' | 'offline'
  location: {
    latitude: number
    longitude: number
    address?: string
    last_updated: string
  }
  trip_info?: {
    trip_id: string
    destination: string
    progress: number // 0-100
  }
  obd_data?: {
    speed: number
    fuel_level: number
    engine_temp: number
    battery_voltage: number
    last_updated: string
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get company ID from authenticated user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's company
    const { data: userProfile } = await supabase
      .from('users')
      .select('company_id')
      .eq('user_id', session.user.id)
      .single()

    if (!userProfile?.company_id) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const companyId = userProfile.company_id

    // Get all vehicles for the company
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select(`
        id,
        license_plate,
        make,
        model,
        status,
        created_at,
        updated_at
      `)
      .eq('company_id', companyId)
      .order('license_plate')

    if (vehiclesError) {
      console.error('Error fetching vehicles:', vehiclesError)
      return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 })
    }

    if (!vehicles || vehicles.length === 0) {
      return NextResponse.json({ fleet: [], total: 0 })
    }

    // Get active trips to correlate with vehicles
    const { data: activeTrips, error: tripsError } = await supabase
      .from('trips')
      .select(`
        id,
        vehicle_id,
        user_id,
        start_location,
        end_location,
        status,
        created_at,
        updated_at
      `)
      .in('vehicle_id', vehicles.map(v => v.id))
      .eq('status', 'active')

    // Get user info for drivers
    const driverIds = activeTrips?.map(trip => trip.user_id).filter(Boolean) || []
    const { data: drivers } = await supabase
      .from('users')
      .select('user_id, first_name, last_name')
      .in('user_id', driverIds)

    // Get OBD data for vehicles (if table exists)
    let obdData: any[] = []
    try {
      const { data: obdRecords } = await supabase
        .from('obd_data')
        .select('*')
        .in('vehicle_id', vehicles.map(v => v.id))
        .order('timestamp', { ascending: false })
        .limit(vehicles.length * 2) // Latest 2 records per vehicle

      obdData = obdRecords || []
    } catch (error) {
      console.log('OBD data table not available, using mock data')
    }

    // Build fleet data
    const fleet: FleetVehicle[] = vehicles.map(vehicle => {
      const activeTrip = activeTrips?.find(trip => trip.vehicle_id === vehicle.id)
      const driver = drivers?.find(d => d.user_id === activeTrip?.user_id)
      const vehicleObdData = obdData.find(obd => obd.vehicle_id === vehicle.id)

      // Determine vehicle status
      let status: FleetVehicle['status'] = 'offline'
      if (vehicle.status === 'maintenance') {
        status = 'maintenance'
      } else if (activeTrip) {
        status = 'active'
      } else if (vehicleObdData && vehicleObdData.vehicle_speed > 5) {
        status = 'active'
      } else {
        status = 'idle'
      }

      const fleetVehicle: FleetVehicle = {
        id: vehicle.id,
        license_plate: vehicle.license_plate,
        driver_name: driver ? `${driver.first_name} ${driver.last_name}` : 'No driver assigned',
        driver_id: activeTrip?.user_id || '',
        status,
        location: {
          latitude: 43.8563 + (Math.random() - 0.5) * 0.1, // Sarajevo area mock
          longitude: 18.3132 + (Math.random() - 0.5) * 0.1,
          address: 'Mock location - Sarajevo area',
          last_updated: vehicle.updated_at || vehicle.created_at
        }
      }

      // Add trip info if active trip exists
      if (activeTrip) {
        fleetVehicle.trip_info = {
          trip_id: activeTrip.id,
          destination: activeTrip.end_location || 'Unknown destination',
          progress: Math.floor(Math.random() * 100) // Mock progress
        }
      }

      // Add OBD data if available
      if (vehicleObdData) {
        fleetVehicle.obd_data = {
          speed: vehicleObdData.vehicle_speed || 0,
          fuel_level: vehicleObdData.fuel_level || 0,
          engine_temp: vehicleObdData.engine_temp || 0,
          battery_voltage: vehicleObdData.battery_voltage || 0,
          last_updated: vehicleObdData.timestamp
        }

        // Update location from OBD GPS if available
        if (vehicleObdData.latitude && vehicleObdData.longitude) {
          fleetVehicle.location = {
            latitude: vehicleObdData.latitude,
            longitude: vehicleObdData.longitude,
            address: `GPS: ${vehicleObdData.latitude.toFixed(4)}, ${vehicleObdData.longitude.toFixed(4)}`,
            last_updated: vehicleObdData.timestamp
          }
        }
      }

      return fleetVehicle
    })

    return NextResponse.json({
      fleet,
      total: fleet.length,
      active: fleet.filter(v => v.status === 'active').length,
      idle: fleet.filter(v => v.status === 'idle').length,
      maintenance: fleet.filter(v => v.status === 'maintenance').length,
      offline: fleet.filter(v => v.status === 'offline').length
    })

  } catch (error) {
    console.error('Fleet API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
