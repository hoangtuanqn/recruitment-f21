import { useQuery } from "@tanstack/react-query";
import Candidate from "~/api-requests/candidates";
import Loading from "./Loading";
import { Helper } from "~/lib/helper";

const Stats = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            const result = await Candidate.stats();

            return result.data.result;
        },
        staleTime: 5 * 60 * 1000,
    });
    if (isLoading) return <Loading />;
    console.log(data?.lastUpdatedCandidate);

    return (
        <>
            <section className="mb-5 grid grid-cols-4 gap-2">
                <div className="shadown-xs rounded-xl border border-gray-500 px-4 py-3">
                    <h4 className="text-xs text-gray-500">Tổng ứng viên</h4>
                    <span className="mt-2 inline-block text-4xl font-bold">
                        {data?.totalCandidates} <span className="text-lg">/500</span>
                    </span>
                    {data?.totalCandidates || 0 < 500 ? (
                        <span className="mt-2 block text-xs font-bold text-red-400">Chưa đạt KPI</span>
                    ) : (
                        <span className="mt-2 block text-xs font-bold text-green-400">Đạt API</span>
                    )}
                </div>
                <div className="shadown-xs rounded-xl border border-gray-500 px-4 py-3">
                    <h4 className="text-xs font-bold text-yellow-500">Cần gửi mail</h4>
                    <span className="mt-2 inline-block text-4xl font-bold text-yellow-500">
                        {" "}
                        {data?.notReceivedMailCount}
                    </span>
                </div>
                <div className="shadown-xs rounded-xl border border-gray-500 px-4 py-3">
                    <h4 className="text-xs text-gray-500">Đã gửi mail</h4>
                    <span className="mt-2 inline-block text-4xl font-bold"> {data?.receivedMailCount}</span>
                </div>
                <div className="shadown-xs rounded-xl border border-gray-500 px-4 py-3">
                    <h4 className="text-xs text-gray-500">Ứng viên hôm nay</h4>
                    <span className="mt-2 inline-block text-4xl font-bold">{data?.candidatesCreatedToday}</span>
                </div>
            </section>
            <h3 className="mt-10 ml-1 text-center text-lg font-bold">
                DỮ LIỆU CẬP NHẬT LẦN CUỐI:{" "}
                <span className="text-gray-600/80 italic">
                    {Helper.formatTimeAgo(data?.lastUpdatedCandidate || "")}
                </span>
            </h3>
        </>
    );
};

export default Stats;
