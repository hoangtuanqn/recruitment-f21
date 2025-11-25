import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "~/stores";
// import { useNavigate } from "react-router-dom";
import type { UserType } from "~/types/user.types";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "~/lib/local-storage";
import { setUser } from "~/stores/userSlice";
import publicApi from "~/lib/axios-instance";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";

export function useAuth() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigate();
    // const navigate = useNavigate();
    let user: UserType | null = JSON.parse(getLocalStorage("user") || "null") as UserType | null;
    user = useSelector((state: RootState) => state.user.user);

    // ✅ Hàm login
    const login = (user: UserType) => {
        setLocalStorage("user", JSON.stringify(user));
        dispatch(setUser(user));
    };

    const updateProfile = (payload: Partial<UserType>) => {
        dispatch(
            setUser({
                ...user,
                ...payload,
            } as UserType),
        );
    };

    const logoutUser = useMutation({
        mutationFn: async () => {
            await publicApi.post("/auth/logout");
        },
        onSettled: () => {
            dispatch(setUser(null)); // Xoá user khỏi Redux
            if (typeof window !== "undefined") {
                removeLocalStorage("user"); // Xoá user khỏi localStorage
            }
            navigation("/login");
            Swal.fire({
                title: "Good job!",
                text: "Logout successfully!",
                icon: "success",
            });
        },
        onError: () => {
            // toast.error("Có lỗi khi đăng xuất!");
        },
    });

    return {
        user,
        updateProfile,
        login,
        logout: () => logoutUser.mutate(),
    };
}
