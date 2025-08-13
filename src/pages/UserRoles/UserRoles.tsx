import React, { useEffect, useState } from "react";
import { postAxios } from "../../services/AxiosService";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
interface UserRole {
  id: number;
  userRole: string;
  createdBy: string;
  activeStatus: number;
}
const limit = 5;
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const User = useSelector((state: any) => state.auth.user);
  const totalPages = Math.ceil(totalCount / limit);
  useEffect(() => {
    getAllUserRoles();
  }, [page, limit]);
  const getAllUserRoles = async () => {
    try {
      setIsLoading(true);
      const res: any = await postAxios("/user-role/getall", {
        userRole:role,
        start: (page - 1) * limit,
        limit,
      });
      setUserRoleData(res.data[0]);
      setTotalCount(res.data[1][0].tot);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  const handleEdit = async (id: number) => {
    setEditId(id);
    try {
      setEditForm(true);
      setIsLoading(true);
      const res: any = await postAxios("/user-role/getone", {
        id,
      });

      setEditUserRole(res.data[0][0].userRole);
      setEditUserStatus(res.data[0][0].activeStatus);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };
  const handleDelete = async (id: number) => {
    await postAxios("/user-role/delete", {
      id,
      updatedBy: User.id,
    });
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

    await postAxios("/user-role/update", {
      id: editId,
      userRole: editUserRole,
      status: editUserStatus,
      updatedBy: User.id,
    });
    setEditForm(false);
    getAllUserRoles();
    setEditId(0);
  };

  const handleAddUserRole = async () => {
    if (!userRole) {
      return;
    }

    await postAxios("/user-role/add", {
      userRole,
      status,
      createdBy: User.id,
    });
    setAddForm(false);
    getAllUserRoles();
  };
  const onEditFormClose = () => {
    setEditForm(false);
    setEditId(0);
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
                className="px-4 py-2 rounded-md bg-orange-700 text-white flex items-center gap-2 hover:bg-orange-600 cursor-pointer"
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
                className="px-4 py-2 rounded-md bg-orange-700 text-white flex items-center gap-2 hover:bg-orange-600 cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        {/* TABLE */}
        {isLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto pb-4 ">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden border rounded-lg border-gray-300">
                <table className="table-auto min-w-full rounded-xl">
                  <thead>
                    <tr className="orange-500">
                      <th className="p-5 text-left text-sm font-semibold text-gray-900">
                        Id
                      </th>
                      <th className="p-5 text-left text-sm font-semibold text-gray-900">
                        User Role
                      </th>
                      <th className="p-5 text-left text-sm font-semibold text-gray-900">
                        Created By
                      </th>
                      <th className="p-5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="p-5 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {userRoleData.map((userRole: UserRole) => (
                      <tr
                        key={userRole.id}
                        className="orange-500  transition-all duration-500 hover:bg-gray-50"
                      >
                        <td className="p-5 text-sm font-medium text-gray-900">
                          {userRole.id}
                        </td>
                        <td className="p-5 text-sm font-medium text-gray-900">
                          {userRole.userRole}
                        </td>
                        <td className="p-5 text-sm font-medium text-gray-900">
                          {userRole.createdBy}
                        </td>
                        <td className="p-5 text-sm font-medium text-gray-900">
                          <div className="py-1.5 px-2.5 bg-emerald-50 rounded-full flex justify-center w-20 items-center gap-1">
                            <svg
                              width="5"
                              height="6"
                              viewBox="0 0 5 6"
                              fill="none"
                            >
                              <circle
                                cx="2.5"
                                cy="3"
                                r="2.5"
                                fill="#059669"
                              ></circle>
                            </svg>
                            {userRole.activeStatus == 1 ? (
                              <span className="font-medium text-xs text-green-600">
                                Active
                              </span>
                            ) : (
                              <span className="font-medium text-xs text-emerald-600">
                                Inactive
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="flex p-5 gap-2">
                          {/* Edit */}
                          <button
                            onClick={() => handleEdit(userRole.id)}
                            className="p-2 rounded-full bg-white transition-all duration-200 hover:bg-orange-500 cursor-pointer"
                          >
                            <HiPencilAlt className="w-5 h-5 text-indigo-500 hover:text-white" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => {
                              setSelectedId(userRole.id);
                              setShowConfirm(true);
                            }}
                            className="p-2 rounded-full bg-white transition-all duration-200 hover:bg-red-600 cursor-pointer"
                          >
                            <HiTrash className="w-5 h-5 text-red-600 hover:text-white" />
                          </button>

                          {showConfirm && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
                              <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                  Are you sure?
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                  Do you really want to delete this record? This
                                  action cannot be undone.
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, totalCount)} of {totalCount} results
          </div>
          <nav className="inline-flex shadow-sm" aria-label="Pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-3 py-2 border text-sm font-medium cursor-pointer rounded-l-md ${
                page === 1
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-2 border-t border-b text-sm cursor-pointer font-medium ${
                  page === i + 1
                    ? "bg-orange-500 text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-3 py-2 border text-sm font-medium cursor-pointer rounded-r-md ${
                page === totalPages
                  ? "bg-gray-200 text-gray-500"
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
                    className="px-6 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-indigo-700 transition cursor-pointer"
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
                    className="px-6 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-indigo-700 transition cursor-pointer"
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
export default UserRoles;
