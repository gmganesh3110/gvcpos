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
interface UserRole {
  id: number;
  userRole: string;
  createdBy: string;
  activeStatus: number;
}
const limit = 8;
const UserRoles: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [userRoleData, setUserRoleData] = useState<UserRole[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [role, setRole] = useState<string>("");
  const [addForm, setAddForm] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const [status, setStatus] = useState<number>(0);
  const [editUserRole, setEditUserRole] = useState<string>("");
  const [editUserStatus, setEditUserStatus] = useState<string>("");
  const [editId, setEditId] = useState<number>(0);
  const [editLoader, setEditLoader] = useState<boolean>(false);
  const User = useSelector((state: any) => state.auth.user);
  const totalPages = Math.ceil(totalCount / limit);
  useEffect(() => {
    getAllUserRoles();
  }, [page]);
  const getAllUserRoles = async () => {
    try {
      setIsLoading(true);
      const res: any = await getAxios("/user-role/getall", {
        userRole: role,
        restuarent: User.restuarent,
        start: (page - 1) * limit,
        limit,
      });
      setUserRoleData(res.data[0]);
      setTotalCount(res.data[1][0].tot);
      setIsLoading(false);
      toast.success("User Roles Fetched Successfully");
    } catch (err: any) {
      toast.error(err?.message);
      console.log(err);
      setIsLoading(false);
    }
  };
  const handleEdit = async (id: number) => {
    setEditId(id);
    try {
      setEditForm(true);
      setEditLoader(true);
      const res: any = await getAxios("/user-role/getone/" + id, {
        restuarent: User.restuarent,
      });
      setEditUserRole(res.data[0][0].userRole);
      setEditUserStatus(res.data[0][0].activeStatus);
      setEditLoader(false);
    } catch (err) {
      setEditLoader(false);
      console.log(err);
    }
  };
  const handleDelete = async (id: number) => {
    await deleteAxios("/user-role/delete/" + id, {
      id,
      updatedBy: User.id,
      restuarent: User.restuarent,
    });
    toast.success("User Role Deleted Successfully");
    clearAllFields();
    getAllUserRoles();
  };
  const handleSearch = () => {
    getAllUserRoles();
  };
  const onAddFormClose = () => {
    setAddForm(false);
  };

  const handleUpdateUserRole = async () => {
    if (!editUserRole) {
      return;
    }
    setIsLoading(true);
    try {
      await putAxios("/user-role/update/" + editId, {
        userRole: editUserRole,
        status: editUserStatus,
        updatedBy: User.id,
        restuarent: User.restuarent,
      });
      toast.success("User Role Updated Successfully");
      clearAllFields();
      getAllUserRoles();
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUserRole = async () => {
    if (!userRole) {
      return;
    }
    try {
      await postAxios("/user-role/add", {
        userRole,
        status,
        createdBy: User.id,
        restuarent: User.restuarent,
      });
      toast.success("User Role Added Successfully");
      setAddForm(false);
      toast.success("User Role Added Successfully");
      clearAllFields();
      getAllUserRoles();
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const clearAllFields = () => {
    setUserRole("");
    setEditUserRole("");
    setEditUserStatus("");
    setEditUserStatus("");
    setEditForm(false);
    setEditId(0);
  };

  const onEditFormClose = () => {
    clearAllFields();
  };
  return (
    <div>
      <div className="flex flex-col">
        <div className="">
          <div className="p-6">
            {/* Title + Actions */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">User Roles</h2>
              <button
                onClick={() => setAddForm(true)}
                className="px-4 py-2 rounded-md bg-blue-700 text-white flex items-center gap-2 hover:bg-blue-600 cursor-pointer"
              >
                <FiPlus /> Add Role
              </button>
            </div>
            {/* Search Input */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Search user role..."
                className="border border-gray-300 rounded-md px-3 py-2 w-64"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 rounded-md bg-blue-700 text-white flex items-center gap-2 hover:bg-blue-600 cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        {/* TABLE */}
        {/* GRID VIEW */}
        {isLoading ? (
          <div className="flex justify-center items-center h-120">
            <Loader />
          </div>
        ) : (
          <div className="p-6">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {userRoleData.map((userRole: UserRole) => (
                <div
                  key={userRole.id}
                  className="border rounded-xl shadow-sm p-5 bg-white transition-all duration-300 hover:shadow-md"
                >
                  {/* Role Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {userRole.userRole}
                    </h3>
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(userRole.id)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-blue-500 transition"
                      >
                        <HiPencilAlt className="w-5 h-5 text-indigo-500 hover:text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(userRole.id)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-blue-600 transition"
                      >
                        <HiTrash className="w-5 h-5 text-blue-600 hover:text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      <span className="font-medium">ID:</span> {userRole.id}
                    </p>
                    <p>
                      <span className="font-medium">Created By:</span>{" "}
                      {userRole.createdBy}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      {userRole.activeStatus == 1 ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          Inactive
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
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
                  : "bg-white hover:bg-gray-50"
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
                        : "bg-white hover:bg-gray-50"
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
                  : "bg-white hover:bg-gray-50"
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
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center border-b px-4 py-2">
                <h3 className="font-semibold text-lg">Add User Role Form</h3>
                <button
                  onClick={onAddFormClose}
                  className="text-gray-500 hover:text-black cursor-pointer"
                >
                  &times;
                </button>
              </div>
              <div className="p-8 bg-gray-50 rounded-xl shadow-sm">
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Role Name
                  </label>
                  <input
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    type="text"
                    placeholder="Enter Role"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-8">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e: any) => setStatus(e.target.value)}
                    value={status}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onAddFormClose}
                    className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddUserRole}
                    className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-indigo-700 transition cursor-pointer"
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
            {editLoader ? (
              <div className="flex justify-center items-center h-120">
                <Loader />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center border-b px-4 py-2">
                  <h3 className="font-semibold text-lg">Edit User Role Form</h3>
                  <button
                    onClick={onEditFormClose}
                    className="text-gray-500 hover:text-black cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
                <div className="p-8 bg-gray-50 rounded-xl shadow-sm">
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Role Name
                    </label>
                    <input
                      type="text"
                      value={editUserRole}
                      onChange={(e) => setEditUserRole(e.target.value)}
                      placeholder="Enter Role"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="mb-8">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Status
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editUserStatus}
                      onChange={(e: any) => setEditUserStatus(e.target.value)}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onEditFormClose}
                      className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateUserRole}
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-indigo-700 transition cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default UserRoles;
