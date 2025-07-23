import { UserRepository } from "./user-repository";
import { AxiosHttpClient } from "../axios-http-client";
import { AuthRepository } from "./auth-repository";
import { ArticleRepository } from "./article-repository";
import { TagRepository } from "./tag-repository";

const httpClient = new AxiosHttpClient();

export const userRepository = new UserRepository(httpClient);
export const authRepository = new AuthRepository(httpClient);
export const articleRepository = new ArticleRepository(httpClient);
export const tagRepository = new TagRepository(httpClient);
