"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { TemplateSelector } from "@/components/template-selector";
import { MarketForm } from "@/components/market-form";
import { useAccount } from "wagmi";
import { useState, useEffect, Suspense } from "react";

// Mock data for templates (simplified from the templates page)
const mockTemplates = [
  {
    id: "1",
    name: "Prediction Market Basic",
    description: "A simple Yes/No prediction market with real-time updates.",
    category: "Markets"
  },
  {
    id: "2",
    name: "Live Chart Market",
    description: "Prediction market with live price chart integration from external data feeds.",
    category: "Markets"
  },
  {
    id: "5",
    name: "AI Trend Predictor",
    description: "Prediction market enhanced with AI-generated trend analysis and insights.",
    category: "AI"
  },
];

// Create a wrapper component that uses useSearchParams
function CreateMarketContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTemplateId = searchParams.get("templateId") || undefined;
  const { isConnected } = useAccount();
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(initialTemplateId);
  const [activeTab, setActiveTab] = useState<string>(initialTemplateId ? "details" : "template");
  
  // Update URL when template changes
  useEffect(() => {
    if (selectedTemplateId) {
      router.push(`/markets/create?templateId=${selectedTemplateId}`);
    } else {
      router.push("/markets/create");
    }
  }, [selectedTemplateId, router]);
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setActiveTab("details");
  };
  
  const handleChangeTemplate = () => {
    setActiveTab("template");
  };
  
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Sign in Required</CardTitle>
            <CardDescription>
              You need to sign in with your Lens account to create prediction markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Connect your wallet to access your Lens profile and create markets.</p>
            <Link href="/" className="text-primary hover:underline">
              Return to homepage to sign in
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create a Prediction Market</h1>
          <p className="text-muted-foreground">
            Create a new market using Bonsai Smart Media templates
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/markets">Back to Markets</Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="template">1. Choose Template</TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedTemplateId}>2. Market Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="template" className="space-y-4">
          <TemplateSelector 
            initialTemplateId={selectedTemplateId} 
            onSelectTemplate={handleSelectTemplate} 
          />
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          {selectedTemplateId && (
            <Card>
              <CardHeader>
                <CardTitle>Market Details</CardTitle>
                <CardDescription>
                  Using template ID: {selectedTemplateId}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarketForm 
                  templateId={selectedTemplateId}
                  onChangeTemplate={handleChangeTemplate}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create a Prediction Market</h1>
          <p className="text-muted-foreground">
            Create a new market using Bonsai Smart Media templates
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/markets">Back to Markets</Link>
        </Button>
      </div>
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </div>
  );
}

// Main component that wraps the content in a Suspense boundary
export default function CreateMarketPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CreateMarketContent />
    </Suspense>
  );
} 