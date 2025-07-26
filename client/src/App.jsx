import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AddBook from "./pages/AddBook";
import BookList from "./pages/BookList";
import AdminIssuedBooks from "./pages/AdminIssuedBook";
import AdminUserList from "./pages/AdminUserList";
import AdminStats from "./pages/AdminStats";
import UserDashboard from "./pages/UserDashBoard";
import UserBorrowedBooks from "./pages/UserBorrowedBooks";
import UserExploreBooks from "./pages/UserExploreBooks";
import UserCart from "./pages/UserCart";
import AdminHome from "./pages/AdminHome";
import UserHome from "./pages/UserHome";
import LandingPage from "./pages/LandingPage";
import AdminFines from "./pages/AdminFines";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import UserFines from "./pages/UserFines";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="books" element={<BookList />} />
        <Route path="books/new" element={<AddBook />} />
        <Route path="issued-books" element={<AdminIssuedBooks />} />
        <Route path="users" element={<AdminUserList />} />
        <Route path="stats" element={<AdminStats />} />
        <Route path="fines" element={<AdminFines />} />
      </Route>

      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["customer"]}>
              <UserDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<UserHome />} />
        <Route path="borrowed-books" element={<UserBorrowedBooks />} />
        <Route path="explore-books" element={<UserExploreBooks />} />
        <Route path="cart" element={<UserCart />} />
        <Route path="fines" element={<UserFines />} />
      </Route>
    </Routes>
  );
}

export default App;
