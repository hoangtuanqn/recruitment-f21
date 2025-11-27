import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bug, Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Template from "~/api-requests/template";

import Loading from "~/components/Loading";
import { TemplatePopup } from "~/components/TemplatePopup";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import type { TemplateType } from "~/types/template.types";

interface StatusResponse {
    result: boolean;
}

const columns = ["Tên gợi nhớ", "Subject", "Tham số", "Trạng thái", "Action"];
const TemplatesPage = () => {
    const [open, setOpen] = useState(false);
    const [itemTest, setItemTest] = useState<TemplateType>();

    const queryClient = useQueryClient();

    const { data, isLoading: isTemplatesLoading } = useQuery({
        queryKey: ["templates"],
        queryFn: async () => {
            const result = await Template.getAll();
            return result.data;
        },
    });

    const { data: globalStatusData, isLoading: isStatusLoading } = useQuery({
        queryKey: ["globalStatus"],
        queryFn: async () => {
            const result = await Template.getStatus();
            return result.data.result;
        },
        staleTime: 1000 * 60 * 5,
    });

    const isActivated = globalStatusData ?? false;

    const { mutate: changeStatusMutate, isPending: isChangingStatus } = useMutation({
        mutationFn: async (newStatus: boolean) => {
            await Template.changeStatus(newStatus);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["globalStatus"] });
            console.log("Trạng thái kích hoạt gửi mail tự động đã được thay đổi thành công.");
        },
        onError: (error) => {
            console.error("Lỗi khi thay đổi trạng thái:", error);
        },
    });

    const accounts = data?.result;

    if (isTemplatesLoading || isStatusLoading) return <Loading />;

    const handleTest = (item: TemplateType) => {
        setOpen(true);
        setItemTest(item);
        console.log(item);
    };

    const handleToggleGlobalStatus = (newChecked: boolean) => {
        if (newChecked) {
            if (!confirm("Bạn đã test trước khi kích hoạt send mail chưa?")) {
                return;
            }
        }
        changeStatusMutate(newChecked);
    };

    return (
        <>
            {itemTest && <TemplatePopup open={open} setOpen={setOpen} itemTest={itemTest} />}
            <div className="my-5 flex items-center justify-center space-x-2">
                <Switch
                    id="global-mail-switch"
                    checked={isActivated}
                    onCheckedChange={handleToggleGlobalStatus}
                    disabled={isChangingStatus}
                />
                <Label htmlFor="global-mail-switch" className={isChangingStatus ? "opacity-50 transition-opacity" : ""}>
                    {isChangingStatus ? "Đang cập nhật trạng thái..." : "Kích hoạt gửi mail tự động"}
                </Label>
            </div>
            <Link to="/add-template">
                <Button variant={"default"}>Thêm template</Button>
            </Link>
            <div className="relative mt-5 flex h-full w-full flex-col overflow-auto rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr className="">
                            {columns.map((column) => (
                                <th key={column} className="border-blue-gray-100 bg-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-none font-bold antialiased">
                                        {column}
                                    </p>
                                </th>
                            ))}

                            <th className="border-blue-gray-100 bg-blue-gray-50 border-b p-4">
                                <p className="text-blue-gray-900 block font-sans text-sm leading-none font-normal antialiased opacity-70"></p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts?.map((item) => (
                            <tr key={item.id}>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.name}
                                    </p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.subject}
                                    </p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.values?.length || 0} prams
                                    </p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.status ? (
                                            <span className="font-bold text-green-500">Hoạt động</span>
                                        ) : (
                                            <span className="text-gray-400">Đang tắt</span>
                                        )}
                                    </p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block flex gap-2 font-sans text-sm leading-normal font-normal antialiased">
                                        <Link
                                            target="_blank"
                                            to={`${import.meta.env.VITE_API_URL}/templates/${item.pathName}`}
                                        >
                                            <Button>
                                                <Eye />
                                            </Button>
                                        </Link>

                                        <Button onClick={() => handleTest(item)}>
                                            <Bug />
                                            Test
                                        </Button>
                                        <Link to={`/template/${item.id}`}>
                                            <Button variant={"outline"}>
                                                <Pencil />
                                                Edit
                                            </Button>
                                        </Link>
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TemplatesPage;
