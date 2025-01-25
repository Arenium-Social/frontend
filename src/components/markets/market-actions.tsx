import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useTransactionContext } from "@/lib/transaction-provider"
import { PREDICTION_MARKET_CONTRACT, USDC_ADDRESS } from "@/lib/blockchain/contracts"
import { parseUnits } from "viem/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface MarketActionsProps {
  marketId: `0x${string}`
  outcome1: string
  outcome2: string
  resolved: boolean
}

export function MarketActions({ marketId, outcome1, outcome2, resolved }: MarketActionsProps) {
  const [amount, setAmount] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState<string>("")
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

  const handleSettle = async () => {
    if (!writeContract) return

    writeContract({
      address: PREDICTION_MARKET_CONTRACT.address,
      abi: PREDICTION_MARKET_CONTRACT.abi,
      functionName: 'settleOutcomeTokens',
      args: [marketId],
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create Tokens</CardTitle>
          <CardDescription>Create outcome tokens to trade</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTokens} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USDC)</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.000001"
                  min="0"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-muted-foreground">USDC</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                type="button" 
                variant="outline"
                className="w-full"
                onClick={handleApproval}
                disabled={isApproving || !amount}
              >
                {isApproving ? 'Approving...' : 'Approve USDC'}
              </Button>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={!amount}
              >
                Create Tokens
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {!resolved ? (
        <Card>
          <CardHeader>
            <CardTitle>Assert Outcome</CardTitle>
            <CardDescription>
              Propose the final outcome for this market
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssert} className="space-y-6">
              <RadioGroup
                value={selectedOutcome}
                onValueChange={setSelectedOutcome}
                className="grid grid-cols-1 gap-4"
              >
                {[outcome1, outcome2, "Unresolvable"].map((outcome) => (
                  <Label
                    key={outcome}
                    className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value={outcome} className="sr-only" />
                    <span className="text-sm font-medium">{outcome}</span>
                  </Label>
                ))}
              </RadioGroup>

              <Button type="submit" className="w-full" disabled={!selectedOutcome}>
                Assert Outcome
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
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
      )}
    </div>
  )
} 