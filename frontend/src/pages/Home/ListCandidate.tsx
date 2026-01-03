import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowBigLeft, ArrowBigRight, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Candidate from "~/api-requests/candidates";
import Loading from "~/components/Loading";
import { Button } from "~/components/ui/button";
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
import { ViewResume } from "~/components/ViewResume";
const columns = ["Mã SV / Kỳ", "Họ tên", "Thông tin", "Điểm & Trạng thái", "Action"];

const ListCandidate = () => {
    const queryClient = useQueryClient();
    const [limit, setLimit] = useState(20);
    const [, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const { data, isLoading } = useQuery({
        queryKey: ["candidate", page, limit],
        queryFn: async () => {
            const result = await Candidate.getAll(page, limit);
            return result.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const candidates = data?.result.data;
    const meta = data?.result.meta;

    const { user } = useAuth();

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
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [dataResume, setDataResume] = useState({
        studentCode: "",
        urlResume: "",
        scores: [] as { score: number }[],
    });
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
                <div className="flex justify-center">
                    <div className="my-5 inline-flex items-center justify-center space-x-2 rounded-xl border p-4">
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
                            {isChangingStatus ? "Đang cập nhật trạng thái..." : "Gửi mail báo kết quả"}
                        </Label>
                    </div>
                </div>
            )}
            <div className="relative mt-5 flex h-full w-full flex-col overflow-auto rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr className="">
                            {/* <th className="border-blue-gray-100 bg-blue-gray-50 border-b p-4">
                                <Checkbox
                                    className="cursor-pointer"
                                    onClick={handleSelectAll}
                                    checked={
                                        selected.length > 0 && selected.length === candidateNotReceivedMail?.length
                                    }
                                    disabled={candidateNotReceivedMail?.length === 0}
                                />
                            </th> */}
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
                                {/* <td className="border-blue-gray-50 border-b p-4">
                                    {!item.isSendMail && (
                                        <Checkbox
                                            className="cursor-pointer"
                                            onClick={() => handleSelected(item.id)}
                                            checked={selected.findIndex((data) => data === item.id) !== -1}
                                        />
                                    )}
                                </td> */}
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 text-sm font-semibold">{item.studentCode}</p>
                                    <p className="text-xs text-gray-500">Kỳ {item.semester}</p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <div className="text-sm">
                                        <p className="text-blue-gray-900 font-semibold">
                                            {item.firstName} {item.lastName}
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-600">Ngành: {item.major}</p>
                                    </div>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <div className="text-sm">
                                        <ul className="mt-1 space-y-0.5">
                                            <li className="text-xs">Mail: {item.email || "Đã ẩn"}</li>
                                            <li className="text-xs">Phone: {item.phone || "Đã ẩn"}</li>
                                            <li className="text-xs">
                                                Gửi mail:{" "}
                                                {!item.scoreResults?.[0]?.result ? (
                                                    <span className="font-medium text-red-600">Không gửi</span>
                                                ) : item.isSendMail ? (
                                                    <span className="font-medium text-green-600">Đã gửi</span>
                                                ) : (
                                                    <span className="font-medium text-yellow-600">Chờ</span>
                                                )}
                                            </li>
                                            {item.scoreResults.map((sr) => (
                                                <li className="text-xs">
                                                    Kết quả{" "}
                                                    {sr.round == "ROUND_1"
                                                        ? "Vòng 1"
                                                        : sr.round == "ROUND_2"
                                                          ? "Vòng 2"
                                                          : "Vòng 3"}
                                                    :{" "}
                                                    {sr.result === "PENDING" ? (
                                                        <span className="font-medium text-yellow-600">Chờ chấm</span>
                                                    ) : sr.result === "PASSED" ? (
                                                        <span className="font-medium text-green-600">Passed</span>
                                                    ) : sr.result === "FAILED" ? (
                                                        <span className="font-medium text-red-600">Failed</span>
                                                    ) : (
                                                        <span className="font-medium text-red-600">Failed</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    {item.scoreResults && item.scoreResults.length > 0 ? (
                                        <div className="text-sm">
                                            <div className="space-y-1">
                                                {item.scoreResults.map((sr) => (
                                                    <div key={sr.id} className="text-xs">
                                                        <span className="font-medium">
                                                            Điểm {sr.round === "ROUND_1" ? "V1" : "V2"}:
                                                        </span>
                                                        <span className="ml-1 font-semibold">
                                                            {sr.score.map((s: { score: number }) => (
                                                                <span
                                                                    className={`mr-1 ${s.score < 50 ? `text-red-600` : `text-green-600`}`}
                                                                >
                                                                    {s.score}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                                            Chưa nộp
                                        </span>
                                    )}
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <div className="flex flex-col gap-2">
                                        {item.scoreResults?.[0]?.score?.length > 0 && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-fit justify-start gap-2"
                                                    onClick={() => {
                                                        setIsOpenModal(true);
                                                        setDataResume({
                                                            urlResume: `/resume/${item.studentCode}/first_submit.pdf`,
                                                            scores: item.scoreResults?.[0]?.score || [],
                                                            studentCode: item.studentCode,
                                                        });
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="text-xs">Résumé lần đầu</span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-fit justify-start gap-2"
                                                    onClick={() => {
                                                        setIsOpenModal(true);
                                                        setDataResume({
                                                            urlResume: `/resume/${item.studentCode}/last_submit.pdf`,
                                                            scores: item.scoreResults?.[0]?.score || [],
                                                            studentCode: item.studentCode,
                                                        });
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="text-xs">Résumé lần cuối</span>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ViewResume
                studentCode={dataResume.studentCode}
                url={dataResume.urlResume}
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                scores={dataResume.scores}
            />
        </>
    );
};

export default ListCandidate;
