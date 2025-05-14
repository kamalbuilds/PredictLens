"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type MarketFormProps = {
  templateId: string;
  onChangeTemplate: () => void;
};

export function MarketForm({ templateId, onChangeTemplate }: MarketFormProps) {
  const router = useRouter();
  const [marketData, setMarketData] = useState({
    question: "",
    description: "",
    option0Text: "Yes",
    option1Text: "No",
    category: "",
    endDate: undefined as Date | undefined,
    dynamicContent: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (field: string, value: string) => {
    setMarketData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setMarketData(prev => ({ ...prev, endDate: date }));
  };
  
  const handleSubmit = async () => {
    if (!marketData.question || !marketData.option0Text || !marketData.option1Text || !marketData.endDate) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call the smart contract
      console.log('Creating market with:', { templateId, ...marketData });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to markets page
      router.push('/markets');
    } catch (error) {
      console.error('Failed to create market:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question">Market Question</Label>
        <Input 
          id="question" 
          placeholder="e.g., Will Ethereum reach $10,000 before July 2025?" 
          value={marketData.question}
          onChange={(e) => handleInputChange("question", e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Make your question specific and verifiable.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Provide details about how this market will be resolved..." 
          rows={4}
          value={marketData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="option0">Option 1</Label>
          <Input 
            id="option0" 
            placeholder="Yes" 
            value={marketData.option0Text}
            onChange={(e) => handleInputChange("option0Text", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="option1">Option 2</Label>
          <Input 
            id="option1" 
            placeholder="No" 
            value={marketData.option1Text}
            onChange={(e) => handleInputChange("option1Text", e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Market End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {marketData.endDate ? (
                  format(marketData.endDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                initialFocus
                selected={marketData.endDate}
                onSelect={handleDateChange}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={marketData.category}
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="crypto">Cryptocurrency</SelectItem>
              <SelectItem value="politics">Politics</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dynamicContent">Initial Dynamic Content</Label>
        <Textarea 
          id="dynamicContent" 
          placeholder="Add initial content that will be displayed in the market..."
          rows={3}
          value={marketData.dynamicContent}
          onChange={(e) => handleInputChange("dynamicContent", e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          This content will evolve based on market activity and the Bonsai Smart Media template.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleSubmit}
          disabled={!marketData.question || !marketData.option0Text || !marketData.option1Text || !marketData.endDate || isSubmitting}
        >
          {isSubmitting ? "Creating Market..." : "Create Market"}
        </Button>
        <Button variant="outline" onClick={onChangeTemplate}>
          Change Template
        </Button>
      </div>
    </div>
  );
} 