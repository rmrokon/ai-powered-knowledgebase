"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useLogin } from "@/components/hooks/api/use-login"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ILogin } from "@/lib/api/repositories/auth-repository"
import Spinner from "@/components/ui/spinner"
import Error from "@/components/ui/error"

const LoginSchema = z.object({
    email: z.string().nonempty({message: 'Email is required'}),
    password: z.string().nonempty({message: 'Password is required'})
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
    const {mutateAsync, isPending} = useLogin();
    const {
        handleSubmit,
        formState: {errors},
        register
    } = useForm({
        resolver: zodResolver(LoginSchema),
        mode: 'all'
    })
    const handleLogin = async (values: ILogin) => {
        try{
            await mutateAsync({
                email: values.email,
                password: values.password
            });
        }catch(error){
            console.error(error);
        }
    }
    if(isPending) return <Spinner />
  return (
    <form onSubmit={handleSubmit(handleLogin)} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">WELCOME BACK</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
          {!!errors.email && <Error>{errors.email.message}</Error>}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link href={'#'} className="ml-auto text-sm underline-offset-4 hover:underline">Forgot your password?</Link>
          </div>
          <Input id="password" type="password" {...register("password")} />
          {!!errors.password && <Error>{errors.password.message}</Error>}
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href={"/register"} className="underline underline-offset-4">Sign up</Link>
      </div>
    </form>
  )
}
