"use client"

import { useReadContract } from 'wagmi'
import { UNISWAP_V3_AMM_CONTRACT } from '@/lib/blockchain/contracts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PoolData {
  marketId: `0x${string}`
  pool: `0x${string}`
  tokenA: `0x${string}`
  tokenB: `0x${string}`
  fee: number
  poolInitialized: boolean
}

export function MarketsList() {
  const { data: pools, isLoading } = useReadContract({
    address: UNISWAP_V3_AMM_CONTRACT.address as `0x${string}`,
    abi: UNISWAP_V3_AMM_CONTRACT.abi,
    functionName: 'getAllPools',
  })

  if (isLoading) {
    return <div>Loading markets...</div>
  }

  if (!pools || !Array.isArray(pools) || pools.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground">No markets found</p>
            <Button asChild className="mt-4">
              <Link href="/markets/create">Create Market</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {(pools as PoolData[]).map((pool, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Market #{index + 1}</CardTitle>
            <CardDescription>Pool: {pool.pool}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Token A: {pool.tokenA}</p>
                <p className="text-sm text-muted-foreground">Token B: {pool.tokenB}</p>
              </div>
              <Button asChild variant="outline">
                <Link href={`/markets/${pool.marketId}`}>View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 