"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UNISWAP_V3_AMM_CONTRACT } from "@/lib/blockchain/contracts"
import { parseEther, formatEther } from "viem"
import { useTransactionContext } from "@/lib/transaction-provider"
import { useReadContract, useAccount, useWaitForTransactionReceipt } from "wagmi"
import { PREDICTION_MARKET_CONTRACT } from "@/lib/blockchain/contracts"

interface TradingInterfaceProps {
  marketId: `0x${string}`
  outcome1: string
  outcome2: string
}

export function TradingInterface({ marketId, outcome1, outcome2 }: TradingInterfaceProps) {
  const [amount, setAmount] = useState("")
  const [selectedOutcome, setSelectedOutcome] = useState<"0" | "1">("0")
  const [isApproving, setIsApproving] = useState(false)
  const { address } = useAccount()
  const { writeContract, hash } = useTransactionContext()

  // Get market data to know which token to approve
  const { data: marketData } = useReadContract({
    address: PREDICTION_MARKET_CONTRACT.address,
    abi: PREDICTION_MARKET_CONTRACT.abi,
    functionName: 'getMarket',
    args: [marketId],
  })

  // Get pool data to know token order
  const { data: poolData } = useReadContract({
    address: UNISWAP_V3_AMM_CONTRACT.address,
    abi: UNISWAP_V3_AMM_CONTRACT.abi,
    functionName: 'getPoolUsingMarketId',
    args: [marketId],
  })

  // Get the token we need to approve based on the pool's token order
  const getTokenToApprove = (selectedOutcome: "0" | "1", poolData: any) => {
    // If we want outcome0 (which is poolToken1), we need to spend poolToken0
    return selectedOutcome === "0" ? poolData.tokenA : poolData.tokenB
  }

  const tokenToApprove = poolData 
    ? getTokenToApprove(selectedOutcome, poolData)
    : undefined

  // Check allowance on the token we're swapping FROM
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenToApprove,
    abi: [{
      name: 'allowance',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' }
      ],
      outputs: [{ name: '', type: 'uint256' }]
    }],
    functionName: 'allowance',
    args: [address, UNISWAP_V3_AMM_CONTRACT.address],
    enabled: !!address && !!poolData,
  })

  // Watch for approval transaction confirmation
  const { isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({ 
    hash: isApproving ? hash : undefined
  })

  useEffect(() => {
    if (isApproveConfirmed) {
      setIsApproving(false)
      refetchAllowance()
      // Now that approval is confirmed, execute the swap
      executeSwap()
    }
  }, [isApproveConfirmed]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (marketData && tokenToApprove && allowance !== undefined && poolData) {
      console.log('Debug Info:', {
        selectedOutcome,
        token0: marketData[1],
        token1: marketData[2],
        poolToken0: poolData.tokenA,
        poolToken1: poolData.tokenB,
        tokenToApprove,
        allowance: allowance.toString(),
        isApproving,
        zeroForOne: selectedOutcome === "1"
      })
    }
  }, [marketData, tokenToApprove, allowance, selectedOutcome, isApproving, poolData])

  // Check if pool is initialized
  useEffect(() => {
    if (poolData) {
      console.log('Pool Data:', {
        pool: poolData,
        isInitialized: poolData.poolInitialized,
        marketId,
        poolAddress: poolData.pool
      })
    }
  }, [poolData, marketId])

  const executeSwap = () => {
    if (!amount || !writeContract || !marketData || !poolData) return
    if (!poolData.poolInitialized) {
      console.error('Pool not initialized')
      return
    }

    const amountInWei = parseEther(amount)
    
    // When selectedOutcome is "0", we want poolToken1 (outcome0)
    // So zeroForOne should be true (swapping FROM poolToken0 TO poolToken1)
    const zeroForOne = selectedOutcome === "0"

    console.log('Executing Swap:', {
      marketId,
      amountInWei: amountInWei.toString(),
      zeroForOne,
      selectedOutcome,
      tokenWeAreSpending: getTokenToApprove(selectedOutcome, poolData),
      poolToken0: poolData.tokenA,
      poolToken1: poolData.tokenB,
      desiredToken: selectedOutcome === "0" ? poolData.tokenB : poolData.tokenA,
      swapDirection: zeroForOne ? "Token0 -> Token1" : "Token1 -> Token0"
    })

    writeContract({
      address: UNISWAP_V3_AMM_CONTRACT.address,
      abi: UNISWAP_V3_AMM_CONTRACT.abi,
      functionName: 'swap',
      args: [
        marketId,
        amountInWei,
        BigInt(0),
        zeroForOne,
      ],
    })
  }

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !writeContract || !marketData || !tokenToApprove) return

    const amountInWei = parseEther(amount)
    const needsApproval = allowance !== undefined && amountInWei > allowance

    if (needsApproval) {
      console.log('Approving:', {
        tokenToApprove,
        spender: UNISWAP_V3_AMM_CONTRACT.address,
        amount: amountInWei.toString()
      })

      setIsApproving(true)
      writeContract({
        address: tokenToApprove,
        abi: [{
          name: 'approve',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          outputs: [{ name: '', type: 'bool' }]
        }],
        functionName: 'approve',
        args: [UNISWAP_V3_AMM_CONTRACT.address, amountInWei],
      })
      return
    }

    executeSwap()
  }

  const needsApproval = allowance !== undefined && parseEther(amount || '0') > allowance

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

          <Button 
            type="submit" 
            className="w-full"
            disabled={isApproving}
          >
            {isApproving 
              ? "Approving..." 
              : needsApproval 
                ? "Approve & Swap Tokens" 
                : "Swap Tokens"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 