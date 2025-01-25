import { useReadContract } from "wagmi";
import { UNISWAP_V3_POOL } from "@/lib/blockchain/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WinningOutcomeProps {
  poolAddress: `0x${string}`;
  outcome1: string;
  outcome2: string;
}

export function WinningOutcome({ poolAddress, outcome1, outcome2 }: WinningOutcomeProps) {
  const { data: slot0 } = useReadContract({
    address: poolAddress,
    abi: UNISWAP_V3_POOL.abi,
    functionName: 'slot0',
  }) as { data: [bigint, number, number, number, number, boolean] };

  if (!slot0) return null;

  const sqrtPriceX96 = slot0[0];
  // Convert sqrtPriceX96 to actual price
  const price = Number(sqrtPriceX96) ** 2 / (2 ** 192);
  
  const winningOutcome = price >= 1 ? outcome1 : outcome2;
  const probability = price >= 1 ? (price / (1 + price)) * 100 : (1 / (1 + price)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Leading</Badge>
            <span className="font-medium">{winningOutcome}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Current probability: {probability.toFixed(1)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 