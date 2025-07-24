import { CredentialRouter } from "./credentials";
import { ArticleRouter } from "./articles";
import { TagRouter } from "./tags";

export const ROUTES = {
    "/credentials": CredentialRouter,
    "/articles": ArticleRouter,
    "/tags": TagRouter
}