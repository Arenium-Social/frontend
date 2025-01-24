"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTransactionContext } from "@/lib/transaction-provider"
import { PREDICTION_MARKET_CONTRACT } from "@/lib/blockchain/contracts"
import { parseEther } from "viem"

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!writeContract) return

    // Convert percentage to fee units (e.g., 0.3% -> 3000)
    const feeUnits = Math.floor(parseFloat(formData.poolFee) * 10000)
    
    // Validate fee units are within acceptable range (0.01% to 100%)
    if (feeUnits < 100 || feeUnits > 1000000) {
      alert("Pool fee must be between 0.01% and 100%")
      return
    }

    // Log the raw form data and processed arguments
    console.log('Form Data:', formData)
    console.log('Processed Arguments:', {
      outcome1: formData.outcome1,
      outcome2: formData.outcome2,
      description: formData.description,
      reward: parseEther(formData.reward).toString(),
      bond: parseEther(formData.bond).toString(),
      feeUnits
    })

    writeContract({
      address: PREDICTION_MARKET_CONTRACT.address as `0x${string}`,
      abi: PREDICTION_MARKET_CONTRACT.abi,
      functionName: 'initializeMarket',
      args: [
        formData.outcome1,
        formData.outcome2,
        formData.description,
        parseEther(formData.reward),
        parseEther(formData.bond),
        feeUnits
      ],
    })
    // Move router.push('/') to the transaction success callback
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Market</CardTitle>
          <CardDescription>
            Create a new prediction market with two possible outcomes
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
                <Label htmlFor="reward">Reward Amount (ETH)</Label>
                <Input
                  id="reward"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.0"
                  value={formData.reward}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bond">Required Bond (ETH)</Label>
                <Input
                  id="bond"
                  type="number"
                  step="0.01"
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

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Create Market
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 