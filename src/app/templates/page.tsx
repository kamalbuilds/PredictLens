import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Mock data for templates - would come from smart contracts
const mockTemplates = [
  {
    id: "1",
    name: "Prediction Market Basic",
    description: "A simple Yes/No prediction market with real-time updates.",
    mediaURI: "/templates/prediction-basic.png",
    creator: {
      handle: "lens-official",
      displayName: "Lens Official",
    },
    active: true,
    usageCount: 248,
    category: "Markets",
    featured: true,
  },
  {
    id: "2",
    name: "Live Chart Market",
    description: "Prediction market with live price chart integration from external data feeds.",
    mediaURI: "/templates/chart-market.png",
    creator: {
      handle: "datascientist",
      displayName: "Data Scientist",
    },
    active: true,
    usageCount: 127,
    category: "Markets",
    featured: true,
  },
  {
    id: "3",
    name: "Community Poll",
    description: "Engage your community with a polling system that rewards participation.",
    mediaURI: "/templates/community-poll.png",
    creator: {
      handle: "community-builder",
      displayName: "Community Builder",
    },
    active: true,
    usageCount: 89,
    category: "Polls",
    featured: false,
  },
  {
    id: "4",
    name: "Tournament Bracket",
    description: "Create betting tournaments with an interactive bracket display.",
    mediaURI: "/templates/tournament.png",
    creator: {
      handle: "sportsfan",
      displayName: "Sports Fan",
    },
    active: true,
    usageCount: 56,
    category: "Sports",
    featured: false,
  },
  {
    id: "5",
    name: "AI Trend Predictor",
    description: "Prediction market enhanced with AI-generated trend analysis and insights.",
    mediaURI: "/templates/ai-predictor.png",
    creator: {
      handle: "aiguru",
      displayName: "AI Guru",
    },
    active: true,
    usageCount: 104,
    category: "AI",
    featured: true,
  },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bonsai Smart Media Templates</h1>
          <p className="text-muted-foreground">
            Choose a template to create dynamic, AI-powered markets
          </p>
        </div>
        <Button asChild>
          <Link href="/templates/create">Create Template</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge className="cursor-pointer" variant="secondary">All</Badge>
        <Badge className="cursor-pointer" variant="outline">Markets</Badge>
        <Badge className="cursor-pointer" variant="outline">Polls</Badge>
        <Badge className="cursor-pointer" variant="outline">Sports</Badge>
        <Badge className="cursor-pointer" variant="outline">AI</Badge>
        <Badge className="cursor-pointer" variant="outline">Featured</Badge>
      </div>

      {/* Featured Templates */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Featured Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockTemplates.filter(t => t.featured).map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {/* This would be an actual image in production */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                  <span className="text-xl font-bold text-primary-foreground">{template.name}</span>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <CardDescription>By @{template.creator.handle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                <p className="text-sm">Used in {template.usageCount} markets</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/markets/create?templateId=${template.id}`}>Use Template</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* All Templates */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {/* This would be an actual image in production */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/10 to-muted/30">
                  <span className="text-xl font-bold">{template.name}</span>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <CardDescription>By @{template.creator.handle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                <p className="text-sm">Used in {template.usageCount} markets</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/markets/create?templateId=${template.id}`}>Use Template</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 