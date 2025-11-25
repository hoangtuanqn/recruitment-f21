import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import Swal from "sweetalert2";
import Auth from "~/api-requests/auth";
import Logo from "~/components/Logo";
import { useNavigate } from "react-router-dom";
import type { LoginRequestType } from "~/types/auth.types";
import axios from "axios";
const LoginPage = () => {
    const [info, setInfo] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setInfo({
            ...info,
            [e.target.name]: e.target.value,
        });
    const mutation = useMutation({
        mutationFn: async (data: LoginRequestType) => {
            const result = await Auth.login(data);
            return result.data;
        },
        onSuccess: () => {
            navigate("/");
            Swal.fire({
                title: "Good job!",
                text: "Login successfully!",
                icon: "success",
            });
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                console.log(error);

                Swal.fire({
                    title: "Faild!",
                    text: error.response?.data.message || "Incorrect login information!!",
                    icon: "error",
                });
            }
        },
    });
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate(info);
    };
    return (
        <div className={"mx-auto max-w-xl"}>
            <Card className="py-12 shadow-2xs">
                <CardHeader>
                    <div className="flex flex-col items-center">
                        <Logo />
                        <CardTitle className="text-center text-2xl">Login to your account</CardTitle>
                    </div>
                    <CardDescription className="text-center">
                        F-CODE - F21 - <b className="font-bold">NEW WAVE</b>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="example@gmail.com"
                                    onChange={handleOnchange}
                                    value={info.email}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={"xxxx"}
                                    name="password"
                                    onChange={handleOnchange}
                                    value={info.password}
                                    required
                                />
                            </Field>
                            <Field>
                                <Button type="submit" variant={"default"}>
                                    Login
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
