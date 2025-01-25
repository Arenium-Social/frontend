"use client"

import { useParams } from "next/navigation"
import { useReadContract } from "wagmi"
import { PREDICTION_MARKET_CONTRACT, UNISWAP_V3_AMM_CONTRACT, USDC_ADDRESS, type MarketData, type PoolData } from "@/lib/blockchain/contracts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TradingInterface } from "@/components/markets/trading-interface"
import { useTransactionContext } from "@/lib/transaction-provider"
import { parseUnits, hexToString } from "viem/utils"
import { AssertMarket } from "@/components/markets/assert-market"
import { SettleMarket } from "@/components/markets/settle-market"
import { TokenBalances } from "@/components/markets/token-balances"
import Link from "next/link"
import { WinningOutcome } from "@/components/markets/winning-outcome"
import { Badge } from "@/components/ui/badge"
import { MarketActions } from "@/components/markets/market-actions"

export default function MarketDetails() {
  const params = useParams();
  const marketId = params.id as `0x${string}`;
  const [amount, setAmount] = useState("");
  const [isApproving, setIsApproving] = useState(false);

  const { writeContract } = useTransactionContext()

  const handleApproval = async () => {
    if (!writeContract) return
    setIsApproving(true)

    writeContract({
      address: USDC_ADDRESS,
      abi: [{
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ type: 'bool' }]
      }],
      functionName: 'approve',
      args: [PREDICTION_MARKET_CONTRACT.address, parseUnits(amount, 6)],
    })
    setIsApproving(false)
  }

  const handleCreateTokens = (e: React.FormEvent) => {
    e.preventDefault()
    if (!writeContract) return

    writeContract({
      address: PREDICTION_MARKET_CONTRACT.address,
      abi: PREDICTION_MARKET_CONTRACT.abi,
      functionName: 'createOutcomeTokens',
      args: [marketId, parseUnits(amount, 6)],
    })
  }

  const { data: market } = useReadContract({
    address: PREDICTION_MARKET_CONTRACT.address,
    abi: PREDICTION_MARKET_CONTRACT.abi,
    functionName: 'getMarket',
    args: [marketId],
  }) as { data: MarketData }

  const { data: pool } = useReadContract({
    address: UNISWAP_V3_AMM_CONTRACT.address,
    abi: UNISWAP_V3_AMM_CONTRACT.abi,
    functionName: 'getPoolUsingMarketId',
    args: [marketId],
  }) as { data: PoolData }

  if (!market || !pool) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-muted-foreground">Loading market details...</p>
        </div>
      </div>
    )
  }

  const [resolved, outcome1Token, outcome2Token, outcome1Bytes, outcome2Bytes] = market
  
  // Decode the bytes32 strings
  const outcome1 = hexToString(outcome1Bytes)
  const outcome2 = hexToString(outcome2Bytes)

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Prediction Market</h1>
          <p className="text-muted-foreground mt-2">
            {outcome1} vs {outcome2}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={resolved ? "secondary" : "default"}>
            {resolved ? "Resolved" : "Active"}
          </Badge>
          <Button asChild variant="outline">
            <Link href={`https://sepolia.basescan.org/address/${pool.pool}`} target="_blank">
              View on Explorer
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Market Info and Trading Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Market Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Pool Address</p>
                    <p className="font-mono text-sm text-muted-foreground truncate">{pool.pool}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pool Fee</p>
                    <p className="text-2xl font-bold">{(pool.fee / 10000).toFixed(2)}%</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Outcome Tokens</p>
                    <div className="mt-2 space-y-2">
                      <div className="p-3 rounded-lg bg-secondary">
                        <p className="font-medium">{outcome1}</p>
                        <p className="text-xs text-muted-foreground truncate">{outcome1Token}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary">
                        <p className="font-medium">{outcome2}</p>
                        <p className="text-xs text-muted-foreground truncate">{outcome2Token}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Interface */}
          <Card>
            <TradingInterface
              marketId={marketId}
              outcome1={outcome1}
              outcome2={outcome2}
            />
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Winning Outcome Card */}
          <WinningOutcome 
            poolAddress={pool.pool}
            outcome1={outcome1}
            outcome2={outcome2}
          />

          {/* Token Balances */}
          <TokenBalances
            outcome1Token={outcome1Token}
            outcome2Token={outcome2Token}
            outcome1={outcome1}
            outcome2={outcome2}
          />
        </div>
      </div>

      {/* Market Actions Section */}
      <MarketActions
        marketId={marketId}
        outcome1={outcome1}
        outcome2={outcome2}
        resolved={resolved}
      />
    </div>
  )
} 