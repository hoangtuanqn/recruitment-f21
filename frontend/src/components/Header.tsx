import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { useAuth } from "~/hooks/use-auth";
import { LogOut } from "lucide-react";

const Header = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <header className="flex w-full items-center justify-center gap-5 rounded-md border border-gray-300 px-5">
            <div className="flex w-full items-center gap-5">
                <Link to="/" className="mr-8 flex items-center gap-0.5">
                    <Logo />
                    <span className="text-xl font-bold text-[#45ce7c]">F-CODE</span>
                </Link>
                <div className={`${location.pathname === "/" && `font-bold`}`}>
                    <Link to="/">Trang chủ</Link>
                </div>
                {user?.role !== "VIEWER" && (
                    <div className={`${location.pathname === "/logs" && `font-bold`}`}>
                        <Link to="/logs">Nhật ký hệ thống</Link>
                    </div>
                )}

                {user?.role === "ADMIN" && (
                    <>
                        <div className={`${location.pathname === "/accounts" && `font-bold`}`}>
                            <Link to="/accounts">Người dùng</Link>
                        </div>
                        <div className={`${location.pathname === "/templates" && `font-bold`}`}>
                            <Link to="/templates">Thiết lập template</Link>
                        </div>
                    </>
                )}
            </div>
            {user ? (
                <>
                    <Button variant={"outline"} className="inline">
                        Welcome: {user.fullName} - {user.role}
                    </Button>
                    <Button variant={"destructive"} onClick={logout}>
                        <LogOut />
                    </Button>
                </>
            ) : (
                <Link to="/login">
                    <Button variant={"outline"} className="inline">
                        Đăng nhập
                    </Button>
                </Link>
            )}
        </header>
    );
};

export default Header;
