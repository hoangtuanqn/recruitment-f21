import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowBigLeft, ArrowBigRight, NotebookPen } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Candidate from "~/api-requests/candidates";
import Loading from "~/components/Loading";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { useAuth } from "~/hooks/use-auth";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import Template from "~/api-requests/template";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
const columns = ["Student Code", "First Name", "Last Name", "Major", "Infomation", "Semester", "Action"];
const ListCandidate = () => {
    const queryClient = useQueryClient();
    const [limit, setLimit] = useState(20);
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["candidate", page, limit],
        queryFn: async () => {
            const result = await Candidate.getAll(page, limit);
            return result.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const candidates = data?.result.data;
    const meta = data?.result.meta;
    const candidateNotReceivedMail = candidates?.filter((item) => !item.isSendMail);

    const { user } = useAuth();
    const handleSelectAll = () => {
        if (selected.length !== candidateNotReceivedMail?.length || 0) {
            setSelected(candidateNotReceivedMail?.map((item) => item.id) || []);
        } else {
            setSelected([]);
        }
    };
    const handleSelected = (id: string) => {
        const idx = selected.findIndex((data) => data === id);
        if (idx === -1) {
            const selectedNew = [...selected, id];
            setSelected(selectedNew);
        } else {
            setSelected(selected.filter((item) => item !== id));
        }
    };
    const mutation = useMutation({
        mutationFn: async (data: string[]) => {
            const result = await Candidate.confirmSendMail(data);
            return result.data;
        },
        onSuccess: () => {
            setSelected([]);
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            refetch();
            Swal.fire({
                title: "Good job!",
                text: "Confirm successfully!",
                icon: "success",
            });
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                Swal.fire({
                    title: "Faild!",
                    text: error?.response?.data.message ?? "Confirm Failled!",
                    icon: "error",
                });
            }
        },
    });
    const handleSendedEmail = () => {
        if (confirm("Bạn có chắc chắn chưa? Sau khi xác nhận, bạn không thể chuyển trạng thái được nữa?")) {
            mutation.mutate(selected);
        }
    };
    const handleChangePage = (page: number) => {
        if (page < 1 || page > (meta?.totalPages || 0)) {
            return;
        }
        setPage(page);
        setSelected([]);
    };
    const { data: globalStatusData, isLoading: isStatusLoading } = useQuery({
        queryKey: ["globalStatus"],
        queryFn: async () => {
            const result = await Template.getStatus();
            return result.data.result;
        },
        staleTime: 1000 * 60 * 5,
    });
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
    const handleToggleGlobalStatus = (newChecked: boolean) => {
        if (newChecked) {
            if (!confirm("Bạn đã test trước khi kích hoạt send mail chưa?")) {
                return;
            }
        }
        changeStatusMutate(newChecked);
    };
    const isActivated = globalStatusData ?? false;
    if (isLoading || isStatusLoading) return <Loading />;

    return (
        <>
            {user?.role === "VIEWER" && (
                <p className="mb-2 text-center text-xs font-bold text-red-500 italic">
                    Bạn đang ở vai trò VIEWER, nên không thể xem thông tin nhạy cảm của ứng viên.
                </p>
            )}
            <div className="mt-10 mb-2 text-right text-sm">
                Trang {page}/{meta?.totalPages}
            </div>
            <div className="flex justify-between">
                <div className="flex gap-2">
                    {user?.role !== "VIEWER" && (
                        <>
                            <Button
                                className="bg-blue-500 text-xs text-white italic"
                                variant={"outline"}
                                onClick={handleSendedEmail}
                                disabled={selected.length === 0}
                            >
                                Xác nhận đã gửi email ({selected.length})
                            </Button>

                            <Link
                                to={`${import.meta.env.VITE_API_URL}/candidate/export-excel?page=${page}&limit=${limit}`}
                                target="_blank"
                            >
                                <Button className="text-xs italic">Export excel ({candidates?.length || 0})</Button>
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex gap-1">
                    <Select defaultValue={String(limit)} onValueChange={(value) => setLimit(+value)}>
                        <SelectTrigger className="mr-5 w-[180px]" defaultValue={limit}>
                            <SelectValue placeholder="Record number" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Record</SelectLabel>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                                {(meta?.total || 0) > 100 && (
                                    <SelectItem value="1000000">Full ({meta?.total})</SelectItem>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button
                        variant={"outline"}
                        className="border"
                        disabled={!meta?.hasPrevPage}
                        onClick={() => handleChangePage(page - 1)}
                    >
                        <ArrowBigLeft />
                    </Button>
                    <Button
                        variant={"outline"}
                        className="border"
                        disabled={!meta?.hasNextPage}
                        onClick={() => handleChangePage(page + 1)}
                    >
                        <ArrowBigRight />
                    </Button>
                </div>
            </div>
            {user?.role === "ADMIN" && (
                <div className="my-5 flex items-center justify-center space-x-2">
                    <Switch
                        id="global-mail-switch"
                        checked={isActivated}
                        onCheckedChange={handleToggleGlobalStatus}
                        disabled={isChangingStatus}
                    />
                    <Label
                        htmlFor="global-mail-switch"
                        className={isChangingStatus ? "opacity-50 transition-opacity" : ""}
                    >
                        {isChangingStatus
                            ? "Đang cập nhật trạng thái..."
                            : "Kích hoạt gửi mail tự động (Tự động gửi khi có dữ liệu mới)"}
                    </Label>
                </div>
            )}

            <div className="relative mt-5 flex h-full w-full flex-col overflow-auto rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr className="">
                            <th className="border-blue-gray-100 bg-blue-gray-50 border-b p-4">
                                <Checkbox
                                    className="cursor-pointer"
                                    onClick={handleSelectAll}
                                    checked={
                                        selected.length > 0 && selected.length === candidateNotReceivedMail?.length
                                    }
                                    disabled={candidateNotReceivedMail?.length === 0}
                                />
                            </th>
                            {columns.map((column) => (
                                <th className="border-blue-gray-100 bg-blue-gray-50 border-b p-4">
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
                        {candidates?.map((item) => (
                            <tr>
                                <td className="border-blue-gray-50 border-b p-4">
                                    {!item.isSendMail && (
                                        <Checkbox
                                            className="cursor-pointer"
                                            onClick={() => handleSelected(item.id)}
                                            checked={selected.findIndex((data) => data === item.id) !== -1}
                                        />
                                    )}
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.studentCode}
                                    </p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.firstName}
                                    </p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.lastName}
                                    </p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.major}
                                    </p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        <ul>
                                            <li>Mail: {item.email || "Đã ẩn"}</li>
                                            <li>Phone: {item.phone || "Đã ẩn"}</li>
                                            <li>
                                                Tình trạng:{" "}
                                                {item.isSendMail ? (
                                                    <span className="text-green-600">Đã gửi mail</span>
                                                ) : (
                                                    <span className="text-yellow-600">Chờ gửi mail</span>
                                                )}
                                            </li>
                                        </ul>
                                    </p>
                                </td>

                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.semester}
                                    </p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4 text-center">
                                    {/* <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.semester}
                                    </p> */}
                                    <Button
                                        variant={"link"}
                                        className="rounded-xl border"
                                        onClick={() => alert("Để cho đẹp thôi, hehe!")}
                                    >
                                        <NotebookPen />
                                    </Button>
                                    {item.note && <p className="mt-1 text-xs text-emerald-500">Có ghi chú</p>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListCandidate;
