import { HttpClient } from "../http-client";
import { IUser } from "./user-repository";

export type IRegister = {
    password: string;
} & Omit<IUser, 'id' |'createdAt'>;


export interface ILogin {
    email: string;
    password: string;
}

export interface IAuth {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}

interface IAuthApi {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}

interface IUserApi {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
}

export class AuthRepository {
    constructor(private client: HttpClient) {}

    async login(body: ILogin): Promise<IAuth>{
        const res = await this.client.post<IAuthApi>('/credentials/login/', body);
        const authDTO = {
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            user: res.user
        };
        return authDTO;
    }

    async register(body: IRegister): Promise<IUser>{
        const res = await this.client.post<IUserApi>('/credentials', body)
        const registerDTO = {
            id: res.id,
            firstName: res.firstName,
            lastName: res.lastName,
            email: res.email,
            createdAt: res.createdAt
        }
        return registerDTO;
    }
}