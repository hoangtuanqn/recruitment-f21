import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Auth from "~/api-requests/auth";

import Loading from "~/components/Loading";
import { Button } from "~/components/ui/button";
import { Helper } from "~/lib/helper";

const columns = ["Full Name", "Email", "Role", "Recently accessed"];
const AccountPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["accounts"],

        queryFn: async () => {
            const result = await Auth.getAll();
            return result.data;
        },
    });

    const accounts = data?.result;

    if (isLoading) return <Loading />;

    return (
        <>
            <Link to="/create">
                <Button variant={"default"}>Thêm người dùng</Button>
            </Link>
            <div className="relative mt-5 flex h-full w-full flex-col overflow-auto rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr className="">
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
                        {accounts?.map((item) => (
                            <tr>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.fullName}
                                    </p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.email}
                                    </p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {item.role}
                                    </p>
                                </td>
                                <td className="border-blue-gray-50 border-b p-4">
                                    <p className="text-blue-gray-900 block font-sans text-sm leading-normal font-normal antialiased">
                                        {Helper.formatTimeAgo(item.updatedAt)}
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

export default AccountPage;
