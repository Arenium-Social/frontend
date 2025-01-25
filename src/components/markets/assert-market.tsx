"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useTransactionContext } from "@/lib/transaction-provider"
import { PREDICTION_MARKET_CONTRACT } from "@/lib/blockchain/contracts"

interface AssertMarketProps {
  marketId: `0x${string}`
  outcome1: string
  outcome2: string
}

export function AssertMarket({ marketId, outcome1, outcome2 }: AssertMarketProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<string>("")
  const { writeContract } = useTransactionContext()

  const handleAssert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!writeContract || !selectedOutcome) return

    writeContract({
      address: PREDICTION_MARKET_CONTRACT.address,
      abi: PREDICTION_MARKET_CONTRACT.abi,
      functionName: 'assertMarket',
      args: [marketId, selectedOutcome],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assert Market Outcome</CardTitle>
        <CardDescription>
          Propose the final outcome for this market. This requires posting a bond.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAssert} className="space-y-6">
          <RadioGroup
            value={selectedOutcome}
            onValueChange={setSelectedOutcome}
            className="grid grid-cols-3 gap-4"
          >
            <Label
              htmlFor="outcome1"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value={outcome1} id="outcome1" className="sr-only" />
              <span className="text-sm font-medium">{outcome1}</span>
            </Label>
            <Label
              htmlFor="outcome2"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value={outcome2} id="outcome2" className="sr-only" />
              <span className="text-sm font-medium">{outcome2}</span>
            </Label>
            <Label
              htmlFor="unresolvable"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="Unresolvable" id="unresolvable" className="sr-only" />
              <span className="text-sm font-medium">Unresolvable</span>
            </Label>
          </RadioGroup>

          <Button type="submit" className="w-full" disabled={!selectedOutcome}>
            Assert Outcome
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 