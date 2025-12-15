// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Candidate from "~/api-requests/candidates";
// import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";

export function ViewResume({
    url,
    isOpenModal,
    setIsOpenModal,
    scores,
    // studentCode,
}: {
    url: string;
    isOpenModal: boolean;
    setIsOpenModal: (open: boolean) => void;
    scores?: { score: number }[];
    studentCode: string;
}) {
    // const queryClient = useQueryClient();

    // const mutation = useMutation({
    //     mutationFn: async (data: { studentCode: string; status: "PASSED" | "FAILED" }) => {
    //         const result = await Candidate.changeStatus(data.studentCode, data.status);
    //         return result.data;
    //     },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ["candidate"] });
    //         queryClient.invalidateQueries({ queryKey: ["stats"] });
    //         setIsOpenModal(false);
    //         Swal.fire({
    //             title: "Success!",
    //             text: "Status updated successfully!",
    //             icon: "success",
    //         });
    //     },
    //     onError: (error) => {
    //         if (axios.isAxiosError(error)) {
    //             Swal.fire({
    //                 title: "Error!",
    //                 text: error?.response?.data.message ?? "Failed to update status!",
    //                 icon: "error",
    //             });
    //         }
    //     },
    // });

    // const handleStatusChange = (status: "PASSED" | "FAILED") => {
    //     mutation.mutate({ studentCode, status });
    // };
    return (
        <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
            <DialogContent className="min-h-[90%] sm:max-w-[90%]">
                <div className="flex h-full flex-col gap-4">
                    {/* <div className="flex gap-2">
                        <Button
                            className="bg-green-600 text-white hover:bg-green-700"
                            onClick={() => handleStatusChange("PASSED")}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Processing..." : "Pass"}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleStatusChange("FAILED")}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Processing..." : "Fail"}
                        </Button>
                    </div> */}
                    <div>
                        <span>Điểm: </span>
                        <span className="ml-1 font-semibold">
                            {scores?.map((s: { score: number }) => (
                                <span className={`mr-1 ${s.score < 50 ? `text-red-600` : `text-green-600`}`}>
                                    {s.score}
                                </span>
                            ))}
                        </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <iframe src={url} title="PDF Viewer" width="100%" height="100%" style={{ border: "none" }} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
