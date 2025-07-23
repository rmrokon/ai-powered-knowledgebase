// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="space-y-12">
//         {/* Hero Section */}
//         <div className="text-center space-y-6">
//           <div className="flex justify-center">
//             <Image
//               className="dark:invert"
//               src="/next.svg"
//               alt="Next.js logo"
//               width={180}
//               height={38}
//               priority
//             />
//           </div>
//           <div className="space-y-4">
//             <h1 className="text-4xl font-bold text-foreground sm:text-6xl">
//               Welcome to KnowledgeBase
//             </h1>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Your central hub for articles, insights, and knowledge sharing.
//               Discover, create, and organize content that matters.
//             </p>
//           </div>
//           <div className="flex gap-4 justify-center">
//             <Button asChild size="lg">
//               <Link href="/articles">Browse Articles</Link>
//             </Button>
//             <Button variant="outline" asChild size="lg">
//               <Link href="/login">Get Started</Link>
//             </Button>
//           </div>
//         </div>

//         {/* Features Section */}
//         <div className="grid gap-6 md:grid-cols-3">
//           <Card>
//             <CardHeader>
//               <CardTitle>📚 Rich Content</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground">
//                 Create and manage articles with rich text content, tags, and organization features.
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>🏷️ Smart Tagging</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground">
//                 Organize your content with intelligent tagging system for easy discovery and categorization.
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>🔍 Powerful Search</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground">
//                 Find exactly what you're looking for with our advanced search and filtering capabilities.
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Getting Started */}
//         <div className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
//           <h2 className="text-2xl font-semibold text-foreground">Ready to get started?</h2>
//           <p className="text-muted-foreground">
//             Join our community and start sharing your knowledge today.
//           </p>
//           <div className="flex gap-4 justify-center">
//             <Button asChild>
//               <Link href="/register">Create Account</Link>
//             </Button>
//             <Button variant="ghost" asChild>
//               <Link href="/login">Sign In</Link>
//             </Button>
//           </div>
//         </div>
//         </div>
//       </div>
//   );
// }
