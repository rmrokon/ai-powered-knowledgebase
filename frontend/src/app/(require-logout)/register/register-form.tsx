"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { IRegister } from "@/lib/api/repositories/auth-repository"
import Spinner from "@/components/ui/spinner"
import Error from "@/components/ui/error"
import { useRegistraion } from "@/components/hooks/api/use-register"

const LoginSchema = z.object({
    firstName: z.string().nonempty({message: "First name is required"}),
    lastName: z.string().nonempty({message: "Last name is required"}),
    email: z.string().nonempty({message: 'Email is required'}),
    password: z.string().nonempty({message: 'Password is required'})
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
    const {mutateAsync, isPending} = useRegistraion();
    const {
        handleSubmit,
        formState: {errors},
        register
    } = useForm({
        resolver: zodResolver(LoginSchema),
        mode: 'all'
    })
    const handleRegister = async (values: IRegister) => {
        try{
            await mutateAsync({
                email: values.email,
                password: values.password,
                firstName: values?.firstName,
                lastName: values.lastName
            });
        }catch(error){
            console.error(error);
        }
    }
    if(isPending) return <Spinner />
  return (
    <form onSubmit={handleSubmit(handleRegister)} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold uppercase">Register</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="Mohammad" {...register("firstName")} />
          {!!errors.firstName && <Error>{errors.firstName.message}</Error>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Shakib" {...register("lastName")} />
          {!!errors.lastName && <Error>{errors.lastName.message}</Error>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
          {!!errors.email && <Error>{errors.email.message}</Error>}
        </div>
        <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {!!errors.password && <Error>{errors.password.message}</Error>}
        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </div>
      <div className="text-center text-sm">
       Already have an account?{" "}
        <Link href={"/login"} className="underline underline-offset-4">Log in</Link>
      </div>
    </form>
  )
}
