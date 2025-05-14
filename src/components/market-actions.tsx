"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StakeDialog } from "@/components/stake-dialog";

type MarketActionsProps = {
  marketId: string;
  question: string;
  option0Text: string;
  option1Text: string;
};

export function MarketActions({ marketId, question, option0Text, option1Text }: MarketActionsProps) {
  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);

  const handleStakeOption = (option: string, index: number) => {
    setSelectedOption(option);
    setSelectedOptionIndex(index);
    setIsStakeDialogOpen(true);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button 
        className="w-full sm:w-auto"
        onClick={() => handleStakeOption(option0Text, 0)}
      >
        Stake on "{option0Text}"
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full sm:w-auto"
        onClick={() => handleStakeOption(option1Text, 1)}
      >
        Stake on "{option1Text}"
      </Button>

      <StakeDialog
        isOpen={isStakeDialogOpen}
        onClose={() => setIsStakeDialogOpen(false)}
        marketId={marketId}
        marketQuestion={question}
        option={selectedOption}
        optionIndex={selectedOptionIndex}
      />
    </div>
  );
} 