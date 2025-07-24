import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Search, Tags, Sparkles, ArrowRight, BookOpen, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">KnowledgeBase</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Your AI-Powered
              <span className="text-primary block">Knowledge Hub</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create, organize, and discover knowledge with intelligent tagging,
              powerful search, and AI-powered article summaries.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/register" className="flex items-center gap-2">
                Start Writing
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Everything you need to manage knowledge
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to help you create, organize, and share knowledge effortlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <Card className="border-border/50 hover:border-primary/20 transition-colors">
            <CardContent className="p-6 text-center space-y-4">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <FileText className="size-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Rich Article Editor</h4>
              <p className="text-muted-foreground">
                Create beautiful articles with our intuitive editor. Support for rich text,
                formatting, and seamless publishing.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-border/50 hover:border-primary/20 transition-colors">
            <CardContent className="p-6 text-center space-y-4">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Tags className="size-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Smart Tagging</h4>
              <p className="text-muted-foreground">
                Organize your content with intelligent tagging. Create new tags on-the-fly
                and filter articles effortlessly.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-border/50 hover:border-primary/20 transition-colors">
            <CardContent className="p-6 text-center space-y-4">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Search className="size-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Powerful Search</h4>
              <p className="text-muted-foreground">
                Find what you need instantly. Search through titles, content, and tags
                with lightning-fast results.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="border-border/50 hover:border-primary/20 transition-colors">
            <CardContent className="p-6 text-center space-y-4">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Sparkles className="size-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">AI Summaries</h4>
              <p className="text-muted-foreground">
                Get instant AI-powered summaries of your articles. Perfect for quick
                reviews and knowledge extraction.
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="border-border/50 hover:border-primary/20 transition-colors">
            <CardContent className="p-6 text-center space-y-4">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Users className="size-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Personal Workspace</h4>
              <p className="text-muted-foreground">
                Your own private knowledge space. Manage your articles, drafts,
                and published content in one place.
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="border-border/50 hover:border-primary/20 transition-colors">
            <CardContent className="p-6 text-center space-y-4">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="size-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Lightning Fast</h4>
              <p className="text-muted-foreground">
                Built for speed and performance. Enjoy smooth interactions and
                instant loading across all features.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-4xl font-bold text-foreground">
              Ready to organize your knowledge?
            </h3>
            <p className="text-xl text-muted-foreground">
              Join thousands of users who are already building their personal knowledge base.
            </p>
            <Button size="lg" className="text-lg px-12 py-6" asChild>
              <Link href="/register" className="flex items-center gap-2">
                Create Your Account
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="size-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">KnowledgeBase</span>
            </div>
            <p className="text-muted-foreground text-center">
              © 2024 KnowledgeBase. Built with ❤️ for knowledge enthusiasts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}