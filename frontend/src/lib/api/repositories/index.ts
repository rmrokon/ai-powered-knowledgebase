import { UserRepository } from "./user-repository";
import { AxiosHttpClient } from "../axios-http-client";
import { AuthRepository } from "./auth-repository";


const httpClient = new AxiosHttpClient();

export const userRepository = new UserRepository(httpClient);
export const authRepository = new AuthRepository(httpClient);
