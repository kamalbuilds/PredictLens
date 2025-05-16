"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { MarketActions } from "@/components/market-actions";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

// Mock data for markets - would come from contract 
const mockMarkets = [
  {
    id: "1",
    question: "Will Ethereum reach $10,000 before July 2025?",
    endTime: new Date(2025, 6, 1).getTime(),
    resolveTime: new Date(2025, 6, 2).getTime(),
    option0Text: "Yes",
    option1Text: "No",
    option0Total: 1250,
    option1Total: 750,
    totalStaked: 2000,
    creator: {
      profileId: "0x01",
      handle: "vitalik",
      displayName: "Vitalik Buterin",
      avatar: "https://i.pravatar.cc/150?u=vitalik"
    },
    status: "active",
    participants: 48,
    description: "This market will resolve to 'Yes' if the price of Ethereum (ETH) reaches or exceeds $10,000 USD on any major exchange before July 1, 2025. It will resolve to 'No' otherwise.",
    category: "Cryptocurrency",
    createdAt: new Date(2024, 4, 10).getTime(),
    activity: [
      {
        id: "a1",
        type: "stake",
        user: {
          handle: "satoshi",
          displayName: "Satoshi Nakamoto",
          avatar: "https://i.pravatar.cc/150?u=satoshi"
        },
        option: 0,
        amount: 50,
        timestamp: new Date(2024, 4, 12).getTime()
      },
      {
        id: "a2",
        type: "stake",
        user: {
          handle: "stani",
          displayName: "Stani Kulechov",
          avatar: "https://i.pravatar.cc/150?u=stani"
        },
        option: 1,
        amount: 75,
        timestamp: new Date(2024, 4, 13).getTime()
      },
      {
        id: "a3",
        type: "stake",
        user: {
          handle: "hayden",
          displayName: "Hayden Adams",
          avatar: "https://i.pravatar.cc/150?u=hayden"
        },
        option: 0,
        amount: 100,
        timestamp: new Date(2024, 4, 14).getTime()
      }
    ]
  },
  {
    id: "2",
    question: "Will Bitcoin have a new all-time high in 2025?",
    endTime: new Date(2025, 11, 31).getTime(),
    resolveTime: new Date(2025, 12, 1).getTime(),
    option0Text: "Yes",
    option1Text: "No",
    option0Total: 5000,
    option1Total: 3000,
    totalStaked: 8000,
    creator: {
      profileId: "0x02",
      handle: "saylor",
      displayName: "Michael Saylor",
      avatar: "https://i.pravatar.cc/150?u=saylor"
    },
    status: "active",
    participants: 102,
    description: "This market will resolve to 'Yes' if Bitcoin (BTC) reaches a new all-time high price in USD on any major exchange during the calendar year 2025. It will resolve to 'No' otherwise.",
    category: "Cryptocurrency",
    createdAt: new Date(2024, 3, 15).getTime(),
    activity: [
      {
        id: "a1",
        type: "stake",
        user: {
          handle: "raoul",
          displayName: "Raoul Pal",
          avatar: "https://i.pravatar.cc/150?u=raoul"
        },
        option: 0,
        amount: 500,
        timestamp: new Date(2024, 3, 16).getTime()
      },
      {
        id: "a2",
        type: "stake",
        user: {
          handle: "peter",
          displayName: "Peter Schiff",
          avatar: "https://i.pravatar.cc/150?u=peter"
        },
        option: 1,
        amount: 300,
        timestamp: new Date(2024, 3, 17).getTime()
      }
    ]
  },
  {
    id: "3",
    question: "Will the Lens Spring Hackathon have more than 50 submissions?",
    endTime: new Date(2025, 4, 20).getTime(),
    resolveTime: new Date(2025, 4, 21).getTime(),
    option0Text: "Yes",
    option1Text: "No",
    option0Total: 320,
    option1Total: 180,
    totalStaked: 500,
    creator: {
      profileId: "0x03",
      handle: "stani",
      displayName: "Stani Kulechov",
      avatar: "https://i.pravatar.cc/150?u=stani"
    },
    status: "active",
    participants: 22,
    description: "This market will resolve to 'Yes' if the Lens Spring Hackathon 2025 receives more than 50 valid project submissions by the submission deadline. It will resolve to 'No' otherwise.",
    category: "Community",
    createdAt: new Date(2024, 2, 10).getTime(),
    activity: [
      {
        id: "a1",
        type: "stake",
        user: {
          handle: "lens_contributor",
          displayName: "Lens Contributor",
          avatar: "https://i.pravatar.cc/150?u=lens_contributor"
        },
        option: 0,
        amount: 100,
        timestamp: new Date(2024, 2, 11).getTime()
      }
    ]
  },
  {
    id: "4",
    question: "Will the Federal Reserve cut interest rates by June 2025?",
    endTime: new Date(2025, 5, 30).getTime(),
    resolveTime: new Date(2025, 6, 1).getTime(),
    option0Text: "Yes",
    option1Text: "No",
    option0Total: 800,
    option1Total: 1200,
    totalStaked: 2000,
    creator: {
      profileId: "0x04",
      handle: "economist",
      displayName: "The Economist",
      avatar: "https://i.pravatar.cc/150?u=economist"
    },
    status: "active",
    participants: 67,
    description: "This market will resolve to 'Yes' if the U.S. Federal Reserve announces a reduction in the federal funds rate by June 30, 2025. It will resolve to 'No' otherwise.",
    category: "Economics",
    createdAt: new Date(2024, 1, 20).getTime(),
    activity: [
      {
        id: "a1",
        type: "stake",
        user: {
          handle: "jpow",
          displayName: "J Powell",
          avatar: "https://i.pravatar.cc/150?u=jpow"
        },
        option: 1,
        amount: 200,
        timestamp: new Date(2024, 1, 21).getTime()
      }
    ]
  }
];

// Mock data for current user's activity
const userStakes = {
  option0: 20,
  option1: 0
};

export default function MarketDetailPage() {
  const params = useParams();
  const marketId = params.id;
  
  // Find the market by ID
  const market = mockMarkets.find(m => m.id === Array.isArray(marketId) ? marketId[0] : marketId as string);
  
  // Handle case where market is not found
  if (!market) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Market Not Found</CardTitle>
            <CardDescription>
              The market you're looking for doesn't exist or has been removed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Check that you have the correct URL or browse available markets.</p>
            <Button asChild>
              <Link href="/markets">Browse Markets</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const option0Percentage = Math.round((market.option0Total / market.totalStaked) * 100);
  const option1Percentage = Math.round((market.option1Total / market.totalStaked) * 100);
  const timeRemaining = getTimeRemaining(market.endTime);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{market.category}</Badge>
            <Badge variant={market.status === "active" ? "secondary" : "outline"}>
              {market.status === "active" ? "Active" : "Resolved"}
            </Badge>
            <span className="text-sm text-muted-foreground">Created {formatDate(market.createdAt)}</span>
          </div>
          <h1 className="text-3xl font-bold">{market.question}</h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/markets">Back to Markets</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Market info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Market Info</CardTitle>
              <CardDescription>
                Created by{" "}
                <Link href={`/profile/${market.creator.handle}`} className="text-primary hover:underline">
                  @{market.creator.handle}
                </Link>
                {" • "}{market.participants} participants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{market.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Current Prediction</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span>{market.option0Text}</span>
                  <span>{market.option1Text}</span>
                </div>
                <Progress value={option0Percentage} className="h-3" />
                <div className="flex justify-between text-sm mt-1">
                  <span>{option0Percentage}% ({market.option0Total.toLocaleString()} BONSAI)</span>
                  <span>{option1Percentage}% ({market.option1Total.toLocaleString()} BONSAI)</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-sm text-muted-foreground mb-1">Time Remaining</h3>
                  <p className="font-medium">{timeRemaining}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-sm text-muted-foreground mb-1">Total Staked</h3>
                  <p className="font-medium">{market.totalStaked.toLocaleString()} BONSAI</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Your Position</h3>
                {userStakes.option0 > 0 || userStakes.option1 > 0 ? (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Staked on "{market.option0Text}":</span>
                      <span>{userStakes.option0} BONSAI</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Staked on "{market.option1Text}":</span>
                      <span>{userStakes.option1} BONSAI</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">You haven't staked in this market yet.</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <MarketActions
                marketId={market.id}
                question={market.question}
                option0Text={market.option0Text}
                option1Text={market.option1Text}
              />
            </CardFooter>
          </Card>
          
          {/* Bonsai Smart Media */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Smart Media Insights</CardTitle>
                <CardDescription>AI-powered analysis by Bonsai</CardDescription>
              </div>
              <Badge variant="outline" className="ml-2">Powered by Bonsai</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {market.id === "1" && (
                  <>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Market Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Ethereum's price has shown significant volatility in the past month, with a 15% increase following 
                        positive developments in layer 2 scaling solutions. Based on current trends and market sentiment,
                        there's approximately a 62% chance of reaching $10,000 by the target date.
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Key Factors</h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• ETH 2.0 staking rate has increased to 25% of total supply</li>
                        <li>• Institutional adoption continues to grow with 3 new ETF applications</li>
                        <li>• DeFi TVL on Ethereum has reached new all-time highs</li>
                        <li>• Layer 2 solutions are reducing gas fees by up to 98%</li>
                      </ul>
                    </div>
                  </>
                )}
                
                {market.id === "2" && (
                  <>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Market Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Bitcoin's current price trajectory suggests a strong possibility of setting a new all-time high in 2025.
                        Historical patterns following halving events indicate potential for significant price appreciation 12-18 months
                        post-halving. Current market confidence is reflected in the 62.5% stake on "Yes".
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Key Factors</h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Bitcoin halving scheduled for April 2024 will reduce new supply</li>
                        <li>• Spot Bitcoin ETFs have accumulated over 250,000 BTC</li>
                        <li>• Institutional adoption continues to expand globally</li>
                        <li>• Monetary policy may shift towards easing by late 2024</li>
                      </ul>
                    </div>
                  </>
                )}
                
                {market.id === "3" && (
                  <>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Market Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        The Lens Spring Hackathon has historically attracted strong developer participation.
                        Based on growth trends in the Lens ecosystem and increased developer interest in SocialFi,
                        the probability of exceeding 50 submissions is high, as reflected in the current 64% stake on "Yes".
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Key Factors</h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Previous Lens hackathons averaged 42 submissions</li>
                        <li>• Developer interest in SocialFi has increased by 85% YoY</li>
                        <li>• Lens Protocol has reached 250,000 active profiles</li>
                        <li>• Increased prize pool may attract more participants</li>
                      </ul>
                    </div>
                  </>
                )}
                
                {market.id === "4" && (
                  <>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Market Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Economic indicators suggest the Federal Reserve may begin easing monetary policy in 2025,
                        but the timing remains uncertain. Current market sentiment leans slightly towards "No" with a 60% stake,
                        indicating skepticism about cuts occurring before June 2025.
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Key Factors</h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Inflation has remained sticky at 2.8%, above the 2% target</li>
                        <li>• Labor market has shown signs of cooling but remains resilient</li>
                        <li>• Fed officials have signaled a cautious approach to rate cuts</li>
                        <li>• Economic growth projections have been revised downward for 2025</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()} • This analysis is generated by AI and should not be considered financial advice
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Right column - Activity and Social */}
        <div>
          <Tabs defaultValue="activity">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {market.activity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback>{activity.user.handle.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">@{activity.user.handle}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</p>
                          </div>
                          <p className="text-sm">
                            Staked {activity.amount} BONSAI on "{activity.option === 0 ? market.option0Text : market.option1Text}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Activity</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="social" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Share This Market</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Share this prediction market with your followers to get more participants and increase the reward pool.</p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="w-full">Share to Lens</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getTimeRemaining(endTime: number): string {
  const now = Date.now();
  if (now > endTime) return "Market closed";
  
  const diff = endTime - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} days, ${hours} hours`;
  } else {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hours, ${minutes} minutes`;
  }
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
} 