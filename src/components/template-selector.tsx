"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock data for templates (simplified from the templates page)
const mockTemplates = [
  {
    id: "1",
    name: "Prediction Market Basic",
    description: "A simple Yes/No prediction market with real-time updates.",
    category: "Markets",
    mediaPath: "/templates/basic.png"
  },
  {
    id: "2",
    name: "Live Chart Market",
    description: "Prediction market with live price chart integration from external data feeds.",
    category: "Markets",
    mediaPath: "/templates/chart.png"
  },
  {
    id: "5",
    name: "AI Trend Predictor",
    description: "Prediction market enhanced with AI-generated trend analysis and insights.",
    category: "AI",
    mediaPath: "/templates/ai.png"
  },
];

type TemplateSelectorProps = {
  initialTemplateId?: string;
  onSelectTemplate: (templateId: string) => void;
};

export function TemplateSelector({ initialTemplateId, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(initialTemplateId);
  
  // Initialize selectedTemplateId when initialTemplateId changes
  useEffect(() => {
    if (initialTemplateId) {
      setSelectedTemplateId(initialTemplateId);
    }
  }, [initialTemplateId]);
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    onSelectTemplate(templateId);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockTemplates.map((template) => (
          <Card 
            key={template.id} 
            className={`overflow-hidden cursor-pointer transition-all hover:border-primary/50 ${
              selectedTemplateId === template.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleSelectTemplate(template.id)}
          >
            <div className="aspect-video bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/10 to-muted/30">
                <span className="text-xl font-bold">{template.name}</span>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge variant="outline">{template.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                variant={selectedTemplateId === template.id ? "default" : "outline"}
                onClick={() => handleSelectTemplate(template.id)}
              >
                {selectedTemplateId === template.id ? "Selected" : "Select Template"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 