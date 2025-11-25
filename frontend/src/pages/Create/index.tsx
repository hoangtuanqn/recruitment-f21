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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import type { RegisterRequestType } from "~/types/auth.types";
import axios from "axios";
const CreatePage = () => {
    const [info, setInfo] = useState({
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
        role: "VIEWER",
    });
    const navigate = useNavigate();
    const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setInfo({
            ...info,
            [e.target.name]: e.target.value,
        });
    console.log(info);

    const mutation = useMutation({
        mutationFn: async (info: RegisterRequestType) => {
            const result = await Auth.create(info);
            return result.data;
        },
        onSuccess: () => {
            navigate("/accounts");
            Swal.fire({
                title: "Good job!",
                text: "Create account successfully!!",
                icon: "success",
            });
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
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
                        <CardTitle className="text-center text-2xl">Create account</CardTitle>
                    </div>
                    <CardDescription className="text-center">
                        F-CODE - F21 - <b className="font-bold">NEW WAVE</b>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
                                <Input
                                    id="full_name"
                                    type="text"
                                    name="full_name"
                                    placeholder="Nguyễn Văn A"
                                    onChange={handleOnchange}
                                    value={info.full_name}
                                    required
                                />
                            </Field>
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
                                <FieldLabel htmlFor="confirm_password">Confirm Password</FieldLabel>
                                <Input
                                    id="confirm_password"
                                    type="password"
                                    placeholder={"xxxx"}
                                    name="confirm_password"
                                    onChange={handleOnchange}
                                    value={info.confirm_password}
                                    required
                                />
                            </Field>
                            <Field>
                                {/* 1. Sửa htmlFor cho FieldLabel */}
                                <FieldLabel htmlFor="role_select">Role</FieldLabel>

                                {/* 2. Đưa logic thay đổi (onChange) vào props onValueChange của <Select> */}
                                <Select
                                    defaultValue={info.role}
                                    name="role"
                                    onValueChange={(value) => setInfo({ ...info, role: value })}
                                >
                                    <SelectTrigger className="w-[180px]" id="role_select">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Role</SelectLabel>
                                            <SelectItem value="VIEWER">Viewer</SelectItem>
                                            <SelectItem value="EDITOR">Editor</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <Button type="submit" variant={"default"}>
                                    Tạo người dùng
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreatePage;
