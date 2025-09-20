import React, { useEffect, useState } from "react";
import {
  deleteAxios,
  getAxios,
  postAxios,
  putAxios,
} from "../../services/AxiosService";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  userRole: string;
  activeStatus: number;
  createdBy?: string;
  createdAt?: string;
  image?: string;
}

interface GetAllUsersDto {
  start: number;
  limit: number;
  restuarent: number;
  userRole: number;
  email: string;
  name: string;
}
const limit = 5;
const Users: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [userData, setUserData] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [addForm, setAddForm] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Filter states
  const [filterUserRole, setFilterUserRole] = useState<number>(0);
  const [filterEmail, setFilterEmail] = useState<string>("");
  const [filterName, setFilterName] = useState<string>("");
  const [availableUserRoles, setAvailableUserRoles] = useState<
    { id: number; userRole: string }[]
  >([]);

  // Form states for adding user
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<number>(1);

  // Form states for editing user
  const [editId, setEditId] = useState<number>(0);
  const [editUsername, setEditUsername] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");
  const [editFirstName, setEditFirstName] = useState<string>("");
  const [editLastName, setEditLastName] = useState<string>("");
  const [editMobileNumber, setEditMobileNumber] = useState<string>("");
  const [editUserRole, setEditUserRole] = useState<string>("");
  const [editPassword, setEditPassword] = useState<string>("");
  const [editUserStatus, setEditUserStatus] = useState<number>(1);

  // Image upload states
  const [image, setImage] = useState<String | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<String | string | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);

  const User = useSelector((state: any) => state.auth.user);
  const totalPages = Math.ceil(totalCount / limit);
  useEffect(() => {
    getAllUsers();
    getAvailableUserRoles();
  }, [page, limit]);
  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const body: GetAllUsersDto = {
        start: (page - 1) * limit,
        limit,
        restuarent: User.restuarent,
        userRole: filterUserRole,
        email: filterEmail,
        name: filterName,
      };
      const res: any = await getAxios("/users/getall", body);
      setUserData(res.data[0]);
      setTotalCount(res.data[1][0].tot);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch users. Please try again.");
      setIsLoading(false);
    }
  };

  const getAvailableUserRoles = async () => {
    try {
      const res: any = await getAxios("/user-role/getall", {
        start: 0,
        limit: 1000,
        status: 1,
        restuarent: User.restuarent,
      });
      const roles = res.data[0].map((role: any) => {
        return {
          id: role.id,
          userRole: role.userRole,
        };
      });
      setAvailableUserRoles(roles);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch user roles. Please try again.");
    }
  };
  const handleEdit = async (id: number) => {
    setEditId(id);
    try {
      setEditForm(true);
      setIsLoading(true);
      const res: any = await getAxios("/users/getone/" + id, {
        id,
        restuarent: User.restuarent,
      });
      const user = res.data[0][0];
      setEditUsername(user.username);
      setEditEmail(user.email);
      setEditFirstName(user.firstName);
      setEditLastName(user.lastName);
      setEditMobileNumber(user.mobileNumber);
      setEditUserRole(user.userroleid);
      setEditUserStatus(user.activeStatus);
      setEditImage(user.image || null);
      setEditPreview(user.image || null);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteAxios("/users/delete/" + id, {
        id,
        updatedBy: User.id,
        restuarent: User.restuarent,
      });
      toast.success("User deleted successfully!");
      getAllUsers();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete user. Please try again.");
    }
  };
  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    getAllUsers();
  };

  const onAddFormClose = () => {
    setAddForm(false);
  };

  const handleUpdateUser = async () => {
    if (
      !editUsername ||
      !editEmail ||
      !editFirstName ||
      !editLastName ||
      !editMobileNumber ||
      !editUserRole
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await putAxios("/users/update/" + editId, {
        id: editId,
        username: editUsername,
        email: editEmail,
        firstName: editFirstName,
        lastName: editLastName,
        mobileNumber: editMobileNumber,
        userRole: editUserRole,
        password: editPassword,
        status: editUserStatus,
        image: editImage,
        updatedBy: User.id,
        restuarent: User.restuarent,
      });
      toast.success("User updated successfully!");
      setEditForm(false);
      getAllUsers();
      setEditId(0);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update user. Please try again.");
    }
  };

  const handleAddUser = async () => {
    if (
      !username ||
      !email ||
      !firstName ||
      !lastName ||
      !mobileNumber ||
      !userRole ||
      !password
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await postAxios("/users/add", {
        username,
        email,
        firstName,
        lastName,
        mobileNumber,
        userRole,
        password,
        status,
        image,
        createdBy: User.id,
        restuarent: User.restuarent,
      });
      toast.success("User added successfully!");
      setAddForm(false);
      // Reset form
      setUsername("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setMobileNumber("");
      setUserRole("");
      setPassword("");
      setStatus(1);
      setImage(null);
      setPreview(null);
      getAllUsers();
    } catch (err) {
      console.log(err);
      toast.error("Failed to add user. Please try again.");
    }
  };
  const onEditFormClose = () => {
    setEditForm(false);
    setEditId(0);
    // Reset edit form
    setEditUsername("");
    setEditEmail("");
    setEditFirstName("");
    setEditLastName("");
    setEditMobileNumber("");
    setEditUserRole("");
    setEditPassword("");
    setEditUserStatus(1);
    setEditImage(null);
    setEditPreview(null);
  };

  // Image upload functions
  const handleUploadImage = async (file: File) => {
    try {
      if (!file) return;
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res: any = await postAxios("/s3/image", formData, {
        "Content-Type": "multipart/form-data",
      });
      setImage(res.data);
      setPreview(res.data);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadEditImage = async (file: File) => {
    try {
      if (!file) return;
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res: any = await postAxios("/s3/image", formData, {
        "Content-Type": "multipart/form-data",
      });
      setEditImage(res.data);
      setEditPreview(res.data);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="">
          <div className="p-6">
            {/* Title + Actions */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Users</h2>
              <button
                onClick={() => setAddForm(true)}
                className="px-4 py-2 rounded-md bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600 cursor-pointer"
              >
                <FiPlus /> Add User
              </button>
            </div>
            {/* Search and Filter Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* General Search */}
                {/* User Role Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Role
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterUserRole}
                    onChange={(e: any) => setFilterUserRole(e.target.value)}
                  >
                    <option value="">Select a user role...</option>
                    {availableUserRoles.map((role, index) => (
                      <option key={index} value={role.id}>
                        {role.userRole}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Filter by email..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                  />
                </div>

                {/* Name Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by name..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Search
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
            </div>
          </div>
        </div>
        {/* GRID VIEW */}
        {isLoading ? (
          <div className="flex justify-center items-center h-120">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {userData.map((user: User) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-100 rounded-t-xl flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-16 h-16 mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">No Image</span>
                    </div>
                  )}

                  {/* ID Badge */}
                  <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md shadow">
                    #{user.id}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <h3 className="text-base font-semibold text-gray-800">
                    {user.firstName} {user.lastName}
                  </h3>
                  
                  <p className="text-sm text-gray-600">
                    @{user.username}
                  </p>

                  <p className="text-sm text-gray-600">
                    {user.email}
                  </p>

                  <p className="text-sm text-gray-600">
                    {user.mobileNumber}
                  </p>

                  <span className="inline-block text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    {user.userRole}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50 rounded-b-xl">
                  {user.activeStatus == 1 ? (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">
                      ● Active
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                      ● Inactive
                    </span>
                  )}

                  <div className="flex gap-2">
                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <HiPencilAlt className="w-4 h-4 text-white" />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => {
                        setSelectedId(user.id);
                        setShowConfirm(true);
                      }}
                      className="p-2 rounded-md bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <HiTrash className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Are you sure?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Do you really want to delete this user? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedId(null);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedId) {
                      handleDelete(selectedId);
                    }
                    setShowConfirm(false);
                    setSelectedId(null);
                  }}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4 px-6">
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, totalCount)} of {totalCount} results
          </div>

          <nav className="inline-flex shadow-sm" aria-label="Pagination">
            {/* Previous */}
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-3 py-2 border text-sm font-medium rounded-l-md ${
                page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-blue-50 text-blue-600"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {(() => {
              const pages: (number | string)[] = [];
              const showRange = 2; // how many pages around current

              if (totalPages <= 7) {
                // show all if small
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1); // first page

                if (page > showRange + 2) pages.push("..."); // left dots

                for (
                  let i = Math.max(2, page - showRange);
                  i <= Math.min(totalPages - 1, page + showRange);
                  i++
                ) {
                  pages.push(i);
                }

                if (page < totalPages - (showRange + 1)) pages.push("..."); // right dots

                pages.push(totalPages); // last page
              }

              return pages.map((p, i) =>
                p === "..." ? (
                  <span
                    key={i}
                    className="px-3 py-2 border-t border-b text-sm text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={i}
                    onClick={() => setPage(p as number)}
                    className={`px-3 py-2 border-t border-b text-sm font-medium ${
                      page === p
                        ? "bg-blue-500 text-white"
                        : "bg-white hover:bg-blue-50 text-blue-600"
                    }`}
                  >
                    {p}
                  </button>
                )
              );
            })()}

            {/* Next */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-3 py-2 border text-sm font-medium rounded-r-md ${
                page === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-blue-50 text-blue-600"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      </div>
      {addForm && (
        <div className="">
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-4xl"
              style={{ width: "90%", height: "70%" }}
            >
              <div className="flex justify-between items-center border-b px-4 py-2">
                <h3 className="font-semibold text-lg">Add User Form</h3>
                <button
                  onClick={onAddFormClose}
                  className="text-gray-500 hover:text-black cursor-pointer"
                >
                  &times;
                </button>
              </div>
              <div
                className="p-4 bg-gray-50 rounded-xl shadow-sm overflow-y-auto"
                style={{ height: "calc(100% - 60px)" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      Username *
                    </label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      placeholder="Enter Username"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      Email *
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Enter Email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      First Name *
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                      placeholder="Enter First Name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      Last Name *
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      type="text"
                      placeholder="Enter Last Name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      Mobile Number *
                    </label>
                    <input
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      type="tel"
                      placeholder="Enter Mobile Number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      User Role *
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e: any) => setUserRole(e.target.value)}
                      value={userRole}
                    >
                      <option value="">Select a user role...</option>
                      {availableUserRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.userRole}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Password *
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter Password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e: any) => setStatus(e.target.value)}
                    value={status}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Upload Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadImage(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 
             file:rounded-lg file:border-0 file:text-sm file:font-semibold 
             file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  />

                  {/* Preview */}
                  {preview && (
                    <div className="mt-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border shadow"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={onAddFormClose}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddUser}
                    className="px-5 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {editForm && (
        <div className="">
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-4xl"
              style={{ width: "90%", height: "70%" }}
            >
              <div className="flex justify-between items-center border-b px-4 py-2">
                <h3 className="font-semibold text-lg">Edit User Form</h3>
                <button
                  onClick={onEditFormClose}
                  className="text-gray-500 hover:text-black cursor-pointer"
                >
                  &times;
                </button>
              </div>
              <div
                className="p-4 bg-gray-50 rounded-xl shadow-sm overflow-y-auto"
                style={{ height: "calc(100% - 60px)" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      placeholder="Enter Username"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="Enter Email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      placeholder="Enter First Name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      placeholder="Enter Last Name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={editMobileNumber}
                      onChange={(e) => setEditMobileNumber(e.target.value)}
                      placeholder="Enter Mobile Number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      User Role *
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editUserRole}
                      onChange={(e: any) => setEditUserRole(e.target.value)}
                    >
                      <option value="">Select a user role...</option>
                      {availableUserRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.userRole}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editUserStatus}
                    onChange={(e: any) => setEditUserStatus(e.target.value)}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Upload Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadEditImage(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 
             file:rounded-lg file:border-0 file:text-sm file:font-semibold 
             file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  />

                  {/* Preview */}
                  {editPreview && (
                    <div className="mt-4">
                      <img
                        src={editPreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border shadow"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={onEditFormClose}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateUser}
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Users;
