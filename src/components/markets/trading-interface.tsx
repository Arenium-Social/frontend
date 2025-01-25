"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UNISWAP_V3_AMM_CONTRACT } from "@/lib/blockchain/contracts"
import { parseEther } from "viem"
import { useTransactionContext } from "@/lib/transaction-provider"
import { useReadContract } from "wagmi"
import { formatUnits } from "viem"

interface TradingInterfaceProps {
  marketId: `0x${string}`
  outcome1: string
  outcome2: string
}

export function TradingInterface({ marketId, outcome1, outcome2 }: TradingInterfaceProps) {
  const [amount, setAmount] = useState("")
  const [selectedOutcome, setSelectedOutcome] = useState<"0" | "1">("0")

  const { writeContract } = useTransactionContext()

  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !writeContract) return

    writeContract({
      address: UNISWAP_V3_AMM_CONTRACT.address,
      abi: UNISWAP_V3_AMM_CONTRACT.abi,
      functionName: 'swap',
      args: [
        marketId,
        parseEther(amount),
        BigInt(0), // amountOutMinimum - TODO: Add slippage protection
        selectedOutcome === "0", // zeroForOne
      ],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Tokens</CardTitle>
        <CardDescription>Swap between outcome tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTrade} className="space-y-6">
          <div className="space-y-4">
            <Label>Select Outcome</Label>
            <RadioGroup
              value={selectedOutcome}
              onValueChange={(value) => setSelectedOutcome(value as "0" | "1")}
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="outcome1"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="0" id="outcome1" className="sr-only" />
                <span className="text-sm font-medium">{outcome1}</span>
              </Label>
              <Label
                htmlFor="outcome2"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="1" id="outcome2" className="sr-only" />
                <span className="text-sm font-medium">{outcome2}</span>
              </Label>
            </RadioGroup>
          </div>

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
            Swap Tokens
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 