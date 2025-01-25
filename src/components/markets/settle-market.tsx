"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTransactionContext } from "@/lib/transaction-provider"
import { PREDICTION_MARKET_CONTRACT } from "@/lib/blockchain/contracts"

interface SettleMarketProps {
  marketId: `0x${string}`
  resolved: boolean
}

export function SettleMarket({ marketId, resolved }: SettleMarketProps) {
  const { writeContract } = useTransactionContext()

  const handleSettle = async () => {
    if (!writeContract) return

    writeContract({
      address: PREDICTION_MARKET_CONTRACT.address,
      abi: PREDICTION_MARKET_CONTRACT.abi,
      functionName: 'settleOutcomeTokens',
      args: [marketId],
    })
  }

  if (!resolved) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settle Market</CardTitle>
        <CardDescription>
          Redeem your outcome tokens for the final payout
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSettle} className="w-full">
          Settle Tokens
        </Button>
      </CardContent>
    </Card>
  )
} 