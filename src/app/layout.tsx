import '@/app/globals.css'
import { TransactionProvider } from '@/context/TransactionContext'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track your income and expenses with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <TransactionProvider>
          {children}
        </TransactionProvider>
      </body>
    </html>
  )
}