import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import Swal from "sweetalert2";
import Template from "~/api-requests/template"; 
import Logo from "~/components/Logo";
import { Link, useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import axios from "axios";
import { Trash2, Plus, Eye } from "lucide-react";

type TemplateInfoType = {
    name: string;
    subject: string;
    status: "1" | "0";
    round: "ROUND_1" | "ROUND_2" | "ROUND_3";
    result: "PASSED" | "FAILED";
};

type TemplateParameter = {
    key: string;
    value: string;
    defaultValue: string;
};

const AddTemplate = () => {
    const [templateInfo, setTemplateInfo] = useState<TemplateInfoType>({
        name: "",
        subject: "",
        status: "1",
        round: "ROUND_1",
        result: "PASSED",
    });

    const [templateFile, setTemplateFile] = useState<File | null>(null);
    const [parameters, setParameters] = useState<TemplateParameter[]>([]);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setTemplateInfo({
            ...templateInfo,
            [e.target.name]: e.target.value,
        });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setTemplateFile(e.target.files[0]);
        } else {
            setTemplateFile(null);
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setTemplateInfo((prev) => ({
            ...prev,
            // status: value as "1" | "0",
            [name]: value,
        }));
    };

    // --- Parameter Handlers ---
    const handleAddParameter = () => {
        setParameters((prev) => [...prev, { key: "", value: "@@fullName", defaultValue: "" }]);
    };

    const handleParameterChange = (index: number, field: keyof TemplateParameter, value: string) => {
        setParameters((prev) => prev.map((param, i) => (i === index ? { ...param, [field]: value } : param)));
    };

    const handleRemoveParameter = (index: number) => {
        setParameters((prev) => prev.filter((_, i) => i !== index));
    };


    const mutation = useMutation({
        mutationFn: async () => {
            if (!templateFile) {
                throw new Error("Vui lòng chọn file template.");
            }

            const formData = new FormData();
            formData.append("name", templateInfo.name);
            formData.append("subject", templateInfo.subject);
            formData.append("round", templateInfo.round);
            formData.append("result", templateInfo.result);
            formData.append("status", templateInfo.status);
            formData.append("file", templateFile);
            formData.append("parameters", JSON.stringify(parameters));

            const result = await Template.create(formData);
            // for (const pair of formData.entries()) {
            //     console.log(`${pair[0]}: ${pair[1]}`);
            // }
            return result.data;
        },
        onSuccess: () => {
            navigate("/templates");
            Swal.fire({
                title: "Thành công!",
                text: "Thêm template thành công!",
                icon: "success",
            });
        },
        onError: (error) => {
            let errorMessage = "Đã xảy ra lỗi không xác định!!";
            if (axios.isAxiosError(error) && error.response?.data.message) {
                errorMessage = error.response.data.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            Swal.fire({
                title: "Thất bại!",
                text: errorMessage,
                icon: "error",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!templateFile) {
            Swal.fire({
                title: "Lỗi!",
                text: "Vui lòng upload file template.",
                icon: "warning",
            });
            return;
        }

        mutation.mutate();
    };

    return (
        <div className={"mx-auto"}>
            <Card className="py-8">
                <CardHeader>
                    <div className="flex flex-col items-center">
                        <Logo />
                        <CardTitle className="text-center text-2xl">Thêm Template Mới</CardTitle>
                    </div>
                    <CardDescription className="text-center">
                        F-CODE - F21 - <b className="font-bold">NEW WAVE</b>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Tên gợi nhớ</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Recruitment F21"
                                    onChange={handleInputChange}
                                    value={templateInfo.name}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                                <Input
                                    id="subject"
                                    type="text"
                                    name="subject"
                                    placeholder="[F-CODE] - THÔNG BÁO THAM GIA DISCORD"
                                    onChange={handleInputChange}
                                    value={templateInfo.subject}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="file">Upload template</FieldLabel>
                                <Input id="file" type="file" name="file" onChange={handleFileChange} required />
                                {templateFile && (
                                    <p className="mt-1 text-sm text-green-600">Đã chọn: **{templateFile.name}**</p>
                                )}
                                <Link
                                    target="_blank"
                                    to={`${import.meta.env.VITE_API_URL}/templates/example.html`}
                                    className="flex items-center gap-1 text-sm text-gray-500 italic"
                                >
                                    <Eye size={15} /> Xem template mẫu
                                </Link>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="round_select">Vòng</FieldLabel>
                                <Select
                                    defaultValue={templateInfo.round}
                                    name="round"
                                    onValueChange={(value) => handleSelectChange("round", value)}
                                >
                                    <SelectTrigger className="w-full" id="round_select">
                                        <SelectValue placeholder="Chọn vòng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Chọn vòng</SelectLabel>
                                            <SelectItem value="ROUND_1">Vòng 1</SelectItem>
                                            <SelectItem value="ROUND_2">Vòng 2</SelectItem>
                                            <SelectItem value="ROUND_3">Vòng 3</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="status_select">Trạng thái</FieldLabel>
                                <Select
                                    defaultValue={templateInfo.status}
                                    name="status"
                                    onValueChange={(value) => handleSelectChange("status", value)}
                                >
                                    <SelectTrigger className="w-full" id="status_select">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Trạng thái</SelectLabel>
                                            <SelectItem value="1">Hoạt động</SelectItem>
                                            <SelectItem value="0">Tạm dừng</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="result_select">Kết quả</FieldLabel>
                                <Select
                                    defaultValue={templateInfo.result}
                                    name="result"
                                    onValueChange={(value) => handleSelectChange("result", value)}
                                >
                                    <SelectTrigger className="w-full" id="result_select">
                                        <SelectValue placeholder="Chọn kết quả" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Kết quả</SelectLabel>
                                            <SelectItem value="PASSED">Pass</SelectItem>
                                            <SelectItem value="FAILED">Fail</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <h4 className="mt-4 text-lg font-semibold">Cấu hình tham số Template</h4>
                            {parameters.map((param, index) => (
                                <div key={index} className="relative mb-3 space-y-2 rounded-md border p-4">
                                    <h5 className="text-sm font-medium">Tham số {index + 1}</h5>

                                    <Field className="flex-1">
                                        <FieldLabel htmlFor={`key_${index}`}>Tên tham số (trong template)</FieldLabel>
                                        <Input
                                            id={`key_${index}`}
                                            type="text"
                                            name="key"
                                            placeholder="{{name}}"
                                            value={param.key}
                                            onChange={(e) => handleParameterChange(index, "key", e.target.value)}
                                            required
                                        />
                                        {/* <p className="mt-1 text-xs text-gray-500">Ví dụ: `{{ customerName }}`</p> */}
                                    </Field>

                                    <Field className="mt-4 flex-1">
                                        <FieldLabel htmlFor={`value_${index}`}>Ánh xạ giá trị</FieldLabel>
                                        <Select
                                            value={param.value}
                                            onValueChange={(value) => {
                                                handleParameterChange(index, "value", value);
                                                if (value !== "other") {
                                                    handleParameterChange(index, "defaultValue", "");
                                                }
                                            }}
                                        >
                                            <SelectTrigger id={`value_${index}`}>
                                                <SelectValue placeholder="Chọn giá trị ánh xạ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Giá trị động</SelectLabel>
                                                    <SelectItem value="@@fullName">Họ và tên</SelectItem>
                                                    <SelectItem value="@@phone">Phone</SelectItem>
                                                    <SelectItem value="@@email">Email</SelectItem>
                                                    <SelectItem value="other">Giá trị cố định</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>

                                    {param.value === "other" && (
                                        <Field className="mt-4 flex-1">
                                            <FieldLabel htmlFor={`default_${index}`}>Nhập giá trị</FieldLabel>
                                            <Input
                                                id={`default_${index}`}
                                                type="text"
                                                name="defaultValue"
                                                placeholder="Giá trị mặc định của tham số này"
                                                value={param.defaultValue}
                                                onChange={(e) =>
                                                    handleParameterChange(index, "defaultValue", e.target.value)
                                                }
                                                required
                                            />
                                        </Field>
                                    )}

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveParameter(index)}
                                        className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddParameter}
                                className="mt-2 flex w-full items-center justify-center"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Thêm tham số
                            </Button>

                            <Field className="mt-6">
                                <Button
                                    type="submit"
                                    variant={"default"}
                                    className="w-full"
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending ? "Đang thêm..." : "Thêm Template"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddTemplate;
