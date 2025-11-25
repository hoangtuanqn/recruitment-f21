import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "~/components/Header";
import Loading from "~/components/Loading";
import publicApi from "~/lib/axios-instance";
import { setUser } from "~/stores/userSlice";

const MainLayout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const res = await publicApi.post("/auth/me");
                const user = res.data.result;
                dispatch(setUser(user));
            } catch {
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [dispatch, navigate]);
    if (isLoading) return <Loading />;
    return (
        <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-5 py-6">
            <section className="bg-white shadow-xs">
                <div>
                    <Header />
                </div>
            </section>
            <section className="mt-20">
                <Outlet />
            </section>
            <section>footer</section>
        </section>
    );
};

export default MainLayout;
