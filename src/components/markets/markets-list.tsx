"use client"

import { useReadContract, useReadContracts } from 'wagmi'
import { UNISWAP_V3_AMM_CONTRACT, PREDICTION_MARKET_CONTRACT } from '@/lib/blockchain/contracts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatAddress } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { hexToString } from 'viem/utils'

interface PoolData {
  marketId: `0x${string}`
  pool: `0x${string}`
  tokenA: `0x${string}`
  tokenB: `0x${string}`
  fee: number
  poolInitialized: boolean
}

interface MarketData {
  resolved: boolean
  outcome1Token: `0x${string}`
  outcome2Token: `0x${string}`
  outcome1: `0x${string}`
  outcome2: `0x${string}`
}

export function MarketsList() {
  const { data: pools, isLoading, isError, error } = useReadContract({
    address: UNISWAP_V3_AMM_CONTRACT.address,
    abi: UNISWAP_V3_AMM_CONTRACT.abi,
    functionName: 'getAllPools',
  })

  const { data: marketsData } = useReadContracts({
    contracts: (pools as PoolData[] || []).map((pool) => ({
      address: PREDICTION_MARKET_CONTRACT.address,
      abi: PREDICTION_MARKET_CONTRACT.abi as const,
      functionName: 'getMarket',
      args: [pool.marketId],
    })),
  })

  console.log('Pools:', pools)
  console.log('Markets Data:', marketsData)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center min-h-[200px]">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <p className="text-muted-foreground">Loading markets...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    console.error('Error fetching pools:', error)
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive">Error loading markets. Please try again.</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!pools || !Array.isArray(pools) || pools.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">No markets found</p>
            <p className="text-sm text-muted-foreground mb-4">Be the first to create a market!</p>
            <Button asChild>
              <Link href="/markets/create">Create Market</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(pools as PoolData[]).map((pool, index) => {
        const marketResult = marketsData?.[index]?.result
        const [resolved, outcome1Token, outcome2Token, outcome1, outcome2] = marketResult || []
        const outcome1String = outcome1 ? hexToString(outcome1 as `0x${string}`) : ''
        const outcome2String = outcome2 ? hexToString(outcome2 as `0x${string}`) : ''
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Market #{index + 1}</CardTitle>
                  <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-mono text-sm">{formatAddress(pool.pool)}</span>
                    <Badge variant={pool.poolInitialized ? "success" : "secondary"}>
                      {pool.poolInitialized ? "Active" : "Pending"}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Outcome 1</p>
                    <p className="text-sm text-muted-foreground">
                      {outcome1String || 'Loading...'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Outcome 2</p>
                    <p className="text-sm text-muted-foreground">
                      {outcome2String || 'Loading...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Fee: {pool.fee / 10000}%
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/markets/${pool.marketId}`}>Trade Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 