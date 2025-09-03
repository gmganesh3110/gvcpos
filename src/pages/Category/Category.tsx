import React, { useEffect, useState } from "react";
import { deleteAxios, getAxios, postAxios, putAxios } from "../../services/AxiosService";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";

interface Category {
  id: number;
  category: string;
  description: string;
  type: string;
  createdBy: {
    id: number;
    firstName: string;
  };
  createdAt: string;
  updatedBy: {
    id: number;
    firstName: string;
  };
  updatedAt: string;
  activeStatus: number;
}

const limit = 5;

const CategoryManagement: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [addForm, setAddForm] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<number>(1);
  const [editCategory, setEditCategory] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editType, setEditType] = useState<string>("");
  const [editStatus, setEditStatus] = useState<number>(1);
  const [editId, setEditId] = useState<number>(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const User = useSelector((state: any) => state.auth.user);
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    getAllCategories();
  }, [page, searchCategory, searchType, searchStatus]);

  const getAllCategories = async () => {
    try {
      setIsLoading(true);
      const res: any = await getAxios("/categories/getall", {
        status: searchStatus || undefined,
        category: searchCategory,
        type: searchType,
        start: (page - 1) * limit,
        limit,
      });
      setCategoryData(res.data.data);
      setTotalCount(res.data.total);
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
      const res: any = await getAxios("/categories/getone/"+id);
      setEditCategory(res.data.category);
      setEditDescription(res.data.description);
      setEditType(res.data.type);
      setEditStatus(res.data.activeStatus);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteAxios("/categories/delete/"+id, {
      id,
      updatedBy: User.id,
    });
    getAllCategories();
  };

  const handleSearch = () => {
    setPage(1);
    getAllCategories();
  };

  const onAddFormClose = () => {
    setAddForm(false);
    setCategory("");
    setDescription("");
    setType("");
    setStatus(1);
  };

  const handleUpdateCategory = async () => {
    if (!editCategory) return;

    await putAxios("/categories/update/"+editId, {
      category: editCategory,
      description: editDescription,
      type: editType,
      activeStatus: editStatus,
      updatedBy: User.id,
    });
    setEditForm(false);
    getAllCategories();
    setEditId(0);
  };

  const handleAddCategory = async () => {
    if (!category) return;
    try {
      await postAxios("/categories/add", {
        category,
        description,
        type,
        activeStatus: status,
        createdBy: User.id,
      });
      setAddForm(false);
      getAllCategories();
      setCategory("");
      setDescription("");
      setType("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const onEditFormClose = () => {
    setEditForm(false);
    setEditId(0);
  };

  return (
    <div className="flex flex-col w-[100%]">
      <div className="p-6">
        {/* Title + Actions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Category Management</h2>
          <button
            onClick={() => setAddForm(true)}
            className="px-4 py-2 rounded-md bg-blue-700 text-white flex items-center gap-2 hover:bg-blue-600 cursor-pointer"
          >
            <FiPlus /> Add Category
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 mb-4">
          <div>
            <input
              type="text"
              placeholder="Search category"
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Search type"
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            />
          </div>
          <div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-md bg-blue-700 text-white flex items-center gap-2 hover:bg-blue-600 cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <div className="flex justify-center items-center h-120">
          <Loader />
        </div>
      ) : (
        <div className="overflow-x-auto pb-4 px-6">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border rounded-lg border-gray-300">
              <table className="table-auto min-w-full rounded-xl">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Id
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Type
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
                  {categoryData.map((cat: Category) => (
                    <tr
                      key={cat.id}
                      className="transition-all duration-500 hover:bg-gray-50"
                    >
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {cat.id}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {cat.category}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {cat.description}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {cat.type}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {cat.createdBy.firstName}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        <div className="py-1.5 px-2.5 bg-emerald-50 rounded-full flex justify-center w-20 items-center gap-1">
                          <svg
                            width="5"
                            height="6"
                            viewBox="0 0 5 6"
                            fill="none"
                          >
                            <circle cx="2.5" cy="3" r="2.5" fill="#059669" />
                          </svg>
                          {cat.activeStatus == 1 ? (
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
                          onClick={() => handleEdit(cat.id)}
                          className="p-2 rounded-full bg-white transition-all duration-200 hover:bg-blue-500 cursor-pointer"
                        >
                          <HiPencilAlt className="w-5 h-5 text-indigo-500 hover:text-white" />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => {
                            setSelectedId(cat.id);
                            setShowConfirm(true);
                          }}
                          className="p-2 rounded-full bg-white transition-all duration-200 hover:bg-blue-600 cursor-pointer"
                        >
                          <HiTrash className="w-5 h-5 text-blue-600 hover:text-white" />
                        </button>
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

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Do you really want to delete this category? This action cannot be
              undone.
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
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Form */}
      {addForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h3 className="font-semibold text-lg">Add Category Form</h3>
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
                  Category Name*
                </label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  type="text"
                  placeholder="Enter Category Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Type
                </label>
                <input
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  type="text"
                  placeholder="Enter Type"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-8">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setStatus(Number(e.target.value))}
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
                  onClick={handleAddCategory}
                  className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-indigo-700 transition cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Form */}
      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h3 className="font-semibold text-lg">Edit Category Form</h3>
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
                  Category Name*
                </label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="Enter Category Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter Description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Type
                </label>
                <input
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  type="text"
                  placeholder="Enter Type"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-8">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editStatus}
                  onChange={(e) => setEditStatus(Number(e.target.value))}
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
                  onClick={handleUpdateCategory}
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-indigo-700 transition cursor-pointer"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
