import { Login } from "@/components/login";
import { getLensClient } from "@/lib/lens/client";
import { fetchAccount } from "@lens-protocol/client/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

export default async function Home() {
  const account = await getAuthenticatedAccount();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Predict. Stake. Earn.</h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Social prediction markets powered by Lens Protocol and quadratic voting
        </p>
        
        {!account ? (
          <Login />
        ) : (
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/markets">Browse Markets</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/markets/create">Create Market</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Social Prediction Markets</CardTitle>
            <CardDescription>Create and participate directly in your Lens feed</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Engage with prediction markets through the familiar Lens social experience. Follow creators, discover trending markets, and build your reputation.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Smart Media Integration</CardTitle>
            <CardDescription>AI-powered market content with Bonsai</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Experience dynamic, evolving market content powered by Bonsai Smart Media Protocol. Markets that update in real-time based on social activity.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quadratic Voting</CardTitle>
            <CardDescription>Fair market resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Our innovative quadratic voting system ensures fair market resolution, preventing wealthy participants from dominating the outcome.</p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <div className="py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
            <h3 className="text-lg font-medium mb-2">Connect</h3>
            <p className="text-muted-foreground">Sign in with your Lens profile</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
            <h3 className="text-lg font-medium mb-2">Create or Join</h3>
            <p className="text-muted-foreground">Create a new market or join existing ones</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
            <h3 className="text-lg font-medium mb-2">Predict</h3>
            <p className="text-muted-foreground">Stake on outcomes you believe will happen</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
            <h3 className="text-lg font-medium mb-2">Earn</h3>
            <p className="text-muted-foreground">Collect rewards when your predictions are correct</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!account && (
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to start predicting?</CardTitle>
            <CardDescription>Connect your Lens profile to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Login />
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">Need a Lens profile? <a href="https://lens.xyz" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Get one here</a></p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
