"use client"
import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { MarketsList } from '@/components/markets/markets-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const { address, isConnecting } = useAccount()
  const { data, isLoading } = useBalance({
    address: address,
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Prediction Markets</h1>
        <Button asChild>
          <Link href="/markets/create">Create Market</Link>
        </Button>
      </div>
      
      <MarketsList />
    </div>
  )
}
