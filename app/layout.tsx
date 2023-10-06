import { Metadata } from 'next'
import './globals.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { Inter } from 'next/font/google'

import Providers from './providers'
import BackgroundFrame from './backgroundFrame'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IGVF Catalog',
  description: 'Browse the IGVF Catalog',
}

export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode,
  modal: React.ReactNode,
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <BackgroundFrame>
            {children}
          </BackgroundFrame>
          {modal}
        </Providers>
      </body>
    </html>
  )
}
