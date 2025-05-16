import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getLensClient } from "@/lib/lens/client";
import { fetchAccount } from "@lens-protocol/client/actions";

/**
 * Fetches authenticated user account if logged in
 */
async function getAuthenticatedAccount() {
  const client = await getLensClient();

  if (!client.isSessionClient()) {
    return null;
  }

  const authenticatedUser = client.getAuthenticatedUser().unwrapOr(null);
  if (!authenticatedUser) {
    return null;
  }

  return fetchAccount(client, { address: authenticatedUser.address }).unwrapOr(null);
}

// Mock data for user markets
const mockUserMarkets = [
  {
    id: "1",
    question: "Will Ethereum reach $10,000 before July 2025?",
    endTime: new Date(2025, 6, 1).getTime(),
    option0Text: "Yes",
    option1Text: "No",
    option0Total: 1250,
    option1Total: 750,
    totalStaked: 2000,
    status: "active",
    participants: 48,
    userStake: {
      option0: 50,
      option1: 0
    }
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
    status: "active",
    participants: 22,
    userStake: {
      option0: 0,
      option1: 30
    }
  }
];

// Mock data for user templates
const mockUserTemplates = [
  {
    id: "1",
    name: "Community Poll",
    description: "Engage your community with a polling system that rewards participation.",
    category: "Polls",
    usageCount: 12,
    createdAt: new Date(2024, 2, 15).getTime()
  }
];

export default async function ProfilePage() {
  const account = await getAuthenticatedAccount();

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Sign in Required</CardTitle>
            <CardDescription>
              You need to sign in with your Lens account to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Connect your wallet to access your Lens profile.</p>
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
      {/* Profile Header */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={account.metadata?.picture} />
            <AvatarFallback>{account.address.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl">{account.metadata?.name}</CardTitle>
            <CardDescription className="mt-1 text-base">
              @{account.handle?.fullHandle || account.address.substring(0, 10) + '...'}
            </CardDescription>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <Badge variant="outline">Lens Chain</Badge>
              <Badge variant="outline">PredictLens User</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {account.metadata?.bio || "No bio provided"}
          </p>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="markets">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="markets">My Markets</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="templates">My Templates</TabsTrigger>
        </TabsList>
        
        {/* My Markets Tab */}
        <TabsContent value="markets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Markets You've Created</h2>
            <Button asChild>
              <Link href="/markets/create">Create New Market</Link>
            </Button>
          </div>
          
          {mockUserMarkets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockUserMarkets.map((market) => (
                <Card key={market.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{market.question}</CardTitle>
                    <CardDescription>
                      Ends: {new Date(market.endTime).toLocaleDateString()} • {market.participants} participants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{market.option0Text}: {Math.round((market.option0Total / market.totalStaked) * 100)}%</span>
                      <span>{market.option1Text}: {Math.round((market.option1Total / market.totalStaked) * 100)}%</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        Your stake: {market.userStake.option0 > 0 
                          ? `${market.userStake.option0} BONSAI on "${market.option0Text}"` 
                          : `${market.userStake.option1} BONSAI on "${market.option1Text}"`}
                      </div>
                      <div className="text-sm">
                        Total staked: {market.totalStaked} BONSAI
                      </div>
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
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">You haven't created any markets yet.</p>
                <Button asChild>
                  <Link href="/markets/create">Create Your First Market</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent predictions and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUserMarkets.map((market) => (
                  <div key={market.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {market.option0Text.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Predicted on "{market.question}"</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                      <p className="text-sm mt-1">
                        {market.userStake.option0 > 0 
                          ? `Staked ${market.userStake.option0} BONSAI on "${market.option0Text}"` 
                          : `Staked ${market.userStake.option1} BONSAI on "${market.option1Text}"`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View More Activity</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Templates</h2>
            <Button asChild>
              <Link href="/templates/create">Create Template</Link>
            </Button>
          </div>
          
          {mockUserTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockUserTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <CardDescription>
                      Created: {new Date(template.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                    <p className="text-sm">Used in {template.usageCount} markets</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/templates/${template.id}`}>Edit Template</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href={`/markets/create?templateId=${template.id}`}>Use Template</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">You haven't created any templates yet.</p>
                <Button asChild>
                  <Link href="/templates/create">Create Your First Template</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 