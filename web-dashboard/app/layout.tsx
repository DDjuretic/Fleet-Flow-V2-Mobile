import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SupabaseProvider } from '@/providers/supabase-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FleetFlow - Fleet Management Dashboard',
  description: 'Enterprise fleet management platform with real-time tracking and analytics',
  keywords: 'fleet management, vehicle tracking, logistics, transportation',
  authors: [{ name: 'FleetFlow Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
