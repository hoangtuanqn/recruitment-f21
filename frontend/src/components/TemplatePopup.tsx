import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { SetStateAction } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import Template from "~/api-requests/template";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { TemplateType } from "~/types/template.types";

interface TestFormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

export function TemplatePopup({
    open,
    setOpen,
    itemTest,
}: {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    itemTest: TemplateType;
}) {
    const [formData, setFormData] = useState<TestFormData>({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const mutation = useMutation({
        mutationFn: async (data: TestFormData) => {
            if (!data.email) {
                throw new Error("Địa chỉ Email kiểm thử là bắt buộc.");
            }

            const result = await Template.testSendMail(itemTest.id, data);

            return result.data;
        },
        onSuccess: () => {
            Swal.fire({
                title: "Thành công!",
                text: `Đã gửi email kiểm thử cho ${formData.email} thành công!`,
                icon: "success",
            });
            setOpen(false);
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Kiểm thử send mail: {itemTest.name}</DialogTitle>
                        <DialogDescription>
                            Vui lòng nhập đầy đủ thông tin bên dưới để kiểm tra template.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="first-name" className="text-right">
                                First Name
                            </Label>
                            <Input
                                id="first-name"
                                name="firstName"
                                placeholder="Nhập tên"
                                className="col-span-3"
                                onChange={handleInputChange}
                                value={formData.firstName}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="last-name" className="text-right">
                                Last Name
                            </Label>
                            <Input
                                id="last-name"
                                name="lastName"
                                placeholder="Nhập họ"
                                className="col-span-3"
                                onChange={handleInputChange}
                                value={formData.lastName}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="Nhập số điện thoại"
                                className="col-span-3"
                                onChange={handleInputChange}
                                value={formData.phone}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email *
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Nhập địa chỉ email"
                                className="col-span-3"
                                required
                                onChange={handleInputChange}
                                value={formData.email}
                            />
                        </div>
                        <span>
                            Email gửi đang dùng email chính thức của CLB. Chỉ nên điền email cá nhân, ko điền bừa.
                        </span>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={mutation.isPending}
                                onClick={() => setOpen(false)}
                            >
                                Hủy
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={mutation.isPending} onClick={() => mutation.mutate(formData)}>
                            {mutation.isPending ? "Đang gửi..." : "Kiểm tra"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
