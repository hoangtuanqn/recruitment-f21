import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/Login";
import CreatePage from "./pages/Create";
import LogPage from "./pages/Logs";
import AccountPage from "./pages/Accounts";
import TemplatesPage from "./pages/Templates";
import AddTemplate from "./pages/AddTemplate";
import EditTemplate from "./pages/EditTemplate";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/logs" element={<LogPage />} />
                <Route path="/accounts" element={<AccountPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/add-template" element={<AddTemplate />} />
                <Route path="/template/:id" element={<EditTemplate />} />
            </Route>

            {/* <Route element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>

            <Route path="concerts">
                <Route index element={<ConcertsHome />} />
                <Route path=":city" element={<City />} />
                <Route path="trending" element={<Trending />} />
            </Route> */}
        </Routes>
    );
};

export default App;
