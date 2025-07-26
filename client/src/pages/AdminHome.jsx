const AdminHome = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          👋 Welcome, {user?.username || "User"}!
        </h1>
        <p className="text-gray-600 text-lg">
          Use the sidebar or dashboard options to explore the library, borrow
          books, and manage your activity.
        </p>
      </div>
    </div>
  );
};

export default AdminHome;
