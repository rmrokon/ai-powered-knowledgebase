import { api } from "@/lib/api/tanstack-adapter";

export default function useQueryClient(){
    return api.useQueryClient();
}