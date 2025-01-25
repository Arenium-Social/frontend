"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useReadContract } from "wagmi"
import { useAccount } from "wagmi"
import { formatUnits } from "viem"

interface TokenBalancesProps {
  outcome1Token: `0x${string}`
  outcome2Token: `0x${string}`
  outcome1: string
  outcome2: string
}

const ERC20_ABI = [{
  name: 'balanceOf',
  type: 'function',
  stateMutability: 'view',
  inputs: [{ name: 'account', type: 'address' }],
  outputs: [{ type: 'uint256' }]
}]

export function TokenBalances({ outcome1Token, outcome2Token, outcome1, outcome2 }: TokenBalancesProps) {
  const { address } = useAccount()

  const { data: balance1 } = useReadContract({
    address: outcome1Token,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
  }) as { data: bigint }

  const { data: balance2 } = useReadContract({
    address: outcome2Token,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
  }) as { data: bigint }

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Token Balances</CardTitle>
          <CardDescription>Connect your wallet to view balances</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Token Balances</CardTitle>
        <CardDescription>Current outcome token holdings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{outcome1}</p>
            <p className="text-lg font-medium">
              {balance1 ? formatUnits(balance1, 6) : '0.0'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{outcome2}</p>
            <p className="text-lg font-medium">
              {balance2 ? formatUnits(balance2, 6) : '0.0'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 