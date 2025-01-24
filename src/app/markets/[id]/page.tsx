"use client"

import { useParams } from "next/navigation"
import { useReadContract } from "wagmi"
import { PREDICTION_MARKET_CONTRACT, UNISWAP_V3_AMM_CONTRACT, type MarketData, type PoolData } from "@/lib/blockchain/contracts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TradingInterface } from "@/components/markets/trading-interface"
import { useTransactionContext } from "@/lib/transaction-provider"
import { parseEther } from "viem"

export default function MarketDetails() {
  const params = useParams()
  const marketId = params.id as `0x${string}`
  const [amount, setAmount] = useState("")

  const { writeContract } = useTransactionContext()

  const handleCreateTokens = (e: React.FormEvent) => {
    e.preventDefault()
    if (!writeContract) return

    writeContract({
      address: PREDICTION_MARKET_CONTRACT.address,
      abi: PREDICTION_MARKET_CONTRACT.abi,
      functionName: 'createOutcomeTokens',
      args: [marketId, parseEther(amount)],
    })
  }

  const { data: market } = useReadContract({
    address: PREDICTION_MARKET_CONTRACT.address as `0x${string}`,
    abi: PREDICTION_MARKET_CONTRACT.abi,
    functionName: 'getMarket',
    args: [marketId],
  }) as { data: MarketData }

  const { data: pool } = useReadContract({
    address: UNISWAP_V3_AMM_CONTRACT.address as `0x${string}`,
    abi: UNISWAP_V3_AMM_CONTRACT.abi,
    functionName: 'getPoolUsingMarketId',
    args: [marketId],
  }) as { data: PoolData }

  if (!market || !pool) {
    return <div>Loading market details...</div>
  }

  const [resolved, outcome1Token, outcome2Token, outcome1, outcome2] = market

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Market Details</h1>
        {!resolved && (
          <Button variant="outline">Assert Outcome</Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Info</CardTitle>
            <CardDescription>Current market status and outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{resolved ? "Resolved" : "Active"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pool Address</p>
                <p className="font-mono text-sm truncate">{pool.pool}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outcome 1</p>
                <p className="font-medium">{outcome1}</p>
                <p className="font-mono text-sm truncate text-muted-foreground">
                  Token: {outcome1Token}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outcome 2</p>
                <p className="font-medium">{outcome2}</p>
                <p className="font-mono text-sm truncate text-muted-foreground">
                  Token: {outcome2Token}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Tokens</CardTitle>
            <CardDescription>Create outcome tokens to trade</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTokens} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Tokens
              </Button>
            </form>
          </CardContent>
        </Card>

        <TradingInterface
          marketId={marketId}
          outcome1={outcome1}
          outcome2={outcome2}
        />
      </div>
    </div>
  )
} 