"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTransactionContext } from "@/lib/transaction-provider"
import { PREDICTION_MARKET_CONTRACT, USDC_ADDRESS } from "@/lib/blockchain/contracts"
import { parseUnits } from "viem"

interface FormData {
  description: string
  outcome1: string
  outcome2: string
  reward: string
  bond: string
  poolFee: string
}

const DEFAULT_FORM_DATA: FormData = {
  description: "",
  outcome1: "",
  outcome2: "",
  reward: "",
  bond: "",
  poolFee: "0.3" // Default 0.3%
}

export default function CreateMarket() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA)
  const [isApproving, setIsApproving] = useState(false)

  const { writeContract } = useTransactionContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    // Validate pool fee to be between 0 and 100
    if (id === 'poolFee') {
      const numValue = parseFloat(value)
      if (numValue < 0 || numValue > 100) return
    }
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleApproval = async () => {
    if (!writeContract) return
    setIsApproving(true)

    const totalAmount = parseUnits(
      (parseFloat(formData.reward) + parseFloat(formData.bond)).toString(), 
      6
    )

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
      args: [PREDICTION_MARKET_CONTRACT.address, totalAmount],
    })
    setIsApproving(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!writeContract) return

    const feeUnits = Math.floor(parseFloat(formData.poolFee) * 10000)
    
    if (feeUnits < 100 || feeUnits > 1000000) {
      alert("Pool fee must be between 0.01% and 100%")
      return
    }

    writeContract({
      address: PREDICTION_MARKET_CONTRACT.address,
      abi: PREDICTION_MARKET_CONTRACT.abi,
      functionName: 'initializeMarket',
      args: [
        formData.outcome1,
        formData.outcome2,
        formData.description,
        parseUnits(formData.reward, 6), // Changed to USDC decimals (6)
        parseUnits(formData.bond, 6),   // Changed to USDC decimals (6)
        feeUnits
      ],
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Market</CardTitle>
          <CardDescription>
            Create a new prediction market with two possible outcomes. All amounts are in USDC.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Market Description</Label>
              <Input
                id="description"
                placeholder="E.g., Will it rain tomorrow?"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="outcome1">Outcome 1</Label>
                <Input
                  id="outcome1"
                  placeholder="Yes"
                  value={formData.outcome1}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outcome2">Outcome 2</Label>
                <Input
                  id="outcome2"
                  placeholder="No"
                  value={formData.outcome2}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reward">Reward Amount (USDC)</Label>
                <Input
                  id="reward"
                  type="number"
                  step="0.000001"
                  min="0"
                  placeholder="0.0"
                  value={formData.reward}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bond">Required Bond (USDC)</Label>
                <Input
                  id="bond"
                  type="number"
                  step="0.000001"
                  min="0"
                  placeholder="0.0"
                  value={formData.bond}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poolFee">Pool Fee (%)</Label>
              <Input
                id="poolFee"
                type="number"
                step="0.01"
                min="0.01"
                max="100"
                placeholder="0.3"
                value={formData.poolFee}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter the fee percentage (e.g., 0.3 for 0.3%). Must be between 0.01% and 100%.
              </p>
            </div>

            <div className="pt-4 space-y-4">
              <Button 
                type="button" 
                className="w-full"
                onClick={handleApproval}
                disabled={isApproving}
              >
                {isApproving ? 'Approving...' : 'Approve USDC'}
              </Button>
              
              <Button 
                type="submit" 
                className="w-full"
              >
                Create Market
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 