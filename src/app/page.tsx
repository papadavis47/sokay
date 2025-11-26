import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">sokay</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container py-20">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold tracking-tight sm:text-6xl">
              It&apos;s okay to enjoy life
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Build a healthier relationship with food by tracking your treats mindfully.
              Set your own budget, stay accountable, and remember—perfection isn&apos;t the goal.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg h-12 px-8">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg h-12 px-8">
                Log In
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <Card>
              <CardHeader>
                <CardTitle>Set Your Budget</CardTitle>
                <CardDescription>
                  Choose 5-20 &quot;sokay&quot; credits and a timeframe (1 month to 1 year)
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Track Mindfully</CardTitle>
                <CardDescription>
                  Log your treats when you indulge. Stay aware without judgment.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Build In Forgiveness</CardTitle>
                <CardDescription>
                  Life isn&apos;t about perfection. It&apos;s about balance and being kind to yourself.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Philosophy */}
          <div className="pt-16">
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="text-2xl">The Sokay Philosophy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Your body thrives when you eat well 90% of the time. The other 10%?
                  That&apos;s life—celebrations, cravings, moments of joy with ice cream or cake.
                </p>
                <p>
                  Sokay helps you stay mindful of these moments without guilt. Set a realistic
                  budget for your treats, track them honestly, and watch as you naturally build
                  healthier habits while still enjoying the foods you love.
                </p>
                <p className="font-medium text-foreground">
                  Remember: It&apos;s okay. You&apos;ve got this.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
