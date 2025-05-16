import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mocked market data - this will come from contracts in a real implementation
const mockMarkets = [
  {
    id: "1",
    question: "Will Ethereum reach $10,000 before July 2025?",
    endTime: new Date(2025, 6, 1).getTime(),
    option0Text: "Yes",
    option1Text: "No",
    option0Total: 1250,
    option1Total: 750,
    totalStaked: 2000,
    creator: "lens/@vitalik",
    status: "active",
    participants: 48
  },
  {
    id: "2",
    question: "Will Bitcoin have a new all-time high in 2025?",
    endTime: new Date(2025, 11, 31).getTime(),
    option0Text: "Yes",
    option1Text: "No",
    option0Total: 5000,
    option1Total: 3000,
    totalStaked: 8000,
    creator: "lens/@saylor",
    status: "active",
    participants: 102
  },
  {
    id: "3",
    question: "Will the Lens Spring Hackathon have more than 50 submissions?",
    endTime: new Date(2025, 4, 20).getTime(),
    option0Text: "Yes",
    option1Text: "No",
    option0Total: 320,
    option1Total: 180,
    totalStaked: 500,
    creator: "lens/@stani",
    status: "active",
    participants: 22
  },
  {
    id: "4",
    question: "Will the Federal Reserve cut interest rates by June 2025?",
    endTime: new Date(2025, 5, 30).getTime(),
    option0Text: "Yes",
    option1Text: "No",
    option0Total: 800,
    option1Total: 1200,
    totalStaked: 2000,
    creator: "lens/@economist",
    status: "active",
    participants: 67
  },
];

export default function MarketsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prediction Markets</h1>
          <p className="text-muted-foreground">Discover trending markets and make your predictions</p>
        </div>
        <Button asChild>
          <Link href="/markets/create">Create Market</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge className="cursor-pointer" variant="secondary">All</Badge>
        <Badge className="cursor-pointer" variant="outline">Trending</Badge>
        <Badge className="cursor-pointer" variant="outline">Ending Soon</Badge>
        <Badge className="cursor-pointer" variant="outline">Technology</Badge>
        <Badge className="cursor-pointer" variant="outline">Crypto</Badge>
        <Badge className="cursor-pointer" variant="outline">Politics</Badge>
        <Badge className="cursor-pointer" variant="outline">Entertainment</Badge>
      </div>

      {/* Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockMarkets.map((market) => (
          <Card key={market.id}>
            <CardHeader>
              <CardTitle>{market.question}</CardTitle>
              <CardDescription>Created by {market.creator} • {market.participants} participants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{market.option0Text}</span>
                <span>{market.option1Text}</span>
              </div>
              <Progress value={(market.option0Total / market.totalStaked) * 100} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{Math.round((market.option0Total / market.totalStaked) * 100)}%</span>
                <span>{Math.round((market.option1Total / market.totalStaked) * 100)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Staked: {market.totalStaked.toLocaleString()} BONSAI</span>
                <span>Ends: {new Date(market.endTime).toLocaleDateString()}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/markets/${market.id}`}>View Market</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          <Button variant="outline" disabled>Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
} 