import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ArticleCardProps {
    id: string;
    title: string;
    excerpt: string;
    tags?: { tag: Tag }[];
    createdAt: string;
    user?: User;
    status?: string;
    slug?: string;
    className?: string;
}

export default function ArticleCard({
    id,
    title,
    excerpt,
    tags,
    createdAt,
    user,
    status,
    slug,
    className,
}: ArticleCardProps){
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'PUBLISHED':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'DRAFT':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'ARCHIVED':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        }
    };

    return (
        <Link href={`/articles/${slug || id}`} className="block">
            <Card className={cn(
                "h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-border/50 hover:border-primary/20",
                className
            )}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                            {title}
                        </CardTitle>
                        {status && (
                            <Badge variant="secondary" className={cn("text-xs", getStatusColor(status))}>
                                {status}
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {user && (
                            <div className="flex items-center gap-1">
                                <User className="size-3" />
                                <span>{user.firstName} {user.lastName}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            <span>{formatDate(createdAt)}</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
                        {excerpt}
                    </p>

                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {tags.slice(0, 3).map((tagWrapper) => (
                                <Badge
                                    key={tagWrapper.tag.id}
                                    variant="outline"
                                    className="text-xs px-2 py-0.5 bg-secondary/50 hover:bg-secondary transition-colors"
                                    style={tagWrapper.tag.color ? {
                                        borderColor: tagWrapper.tag.color + '40',
                                        color: tagWrapper.tag.color
                                    } : {}}
                                >
                                    {tagWrapper.tag.name}
                                </Badge>
                            ))}
                            {tags.length > 3 && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5 bg-muted">
                                    +{tags.length - 3} more
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}