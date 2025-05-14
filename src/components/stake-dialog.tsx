"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAccount } from "wagmi";

type StakeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  marketId: string;
  marketQuestion: string;
  option: string;
  optionIndex: number; // 0 or 1
};

export function StakeDialog({
  isOpen,
  onClose,
  marketId,
  marketQuestion,
  option,
  optionIndex,
}: StakeDialogProps) {
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { isConnected } = useAccount();

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call the smart contract
      console.log(`Staking ${amount} BONSAI on market ${marketId}, option ${optionIndex} (${option})`);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Close the dialog
      setAmount("");
      onClose();
    } catch (error) {
      console.error("Failed to stake:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Stake on Prediction</DialogTitle>
          <DialogDescription>
            Stake BONSAI tokens on your predicted outcome.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Market</Label>
            <p className="text-sm text-muted-foreground">{marketQuestion}</p>
          </div>
          
          <div className="space-y-2">
            <Label>Your Prediction</Label>
            <p className="font-medium">{option}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Stake</Label>
            <div className="flex items-center">
              <Input
                id="amount"
                placeholder="0.0"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span className="ml-2 text-muted-foreground">BONSAI</span>
            </div>
            <p className="text-xs text-muted-foreground">Minimum stake: 1 BONSAI</p>
          </div>
          
          {isConnected ? (
            <div className="space-y-2">
              <Label>Potential Reward</Label>
              <p className="font-medium">
                {amount && parseFloat(amount) > 0
                  ? `${(parseFloat(amount) * 1.5).toFixed(2)} BONSAI (estimated)`
                  : "Enter an amount to see potential reward"}
              </p>
              <p className="text-xs text-muted-foreground">
                Actual reward may vary based on total stakes and market resolution
              </p>
            </div>
          ) : (
            <div className="p-3 text-sm bg-muted rounded-lg text-muted-foreground">
              Connect your wallet to stake on this prediction
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleStake} 
            disabled={!isConnected || !amount || parseFloat(amount) <= 0 || isSubmitting}
          >
            {isSubmitting ? "Staking..." : "Stake"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 