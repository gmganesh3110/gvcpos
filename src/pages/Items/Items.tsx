import React, { useEffect, useState } from "react";
import { postAxios } from "../../services/AxiosService";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  categoryId: number;
  type: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  activeStatus: number;
}

interface Category {
  id: number;
  category: string;
}

const limit = 5;

const Items: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [itemData, setItemData] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchName, setSearchName] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [addForm, setAddForm] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [available, setAvailable] = useState<boolean>(true);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editAvailable, setEditAvailable] = useState<boolean>(true);
  const [editCategoryId, setEditCategoryId] = useState<number>(0);
  const [editType, setEditType] = useState<string>("");
  const [editStatus, setEditStatus] = useState<number>(1);
  const [editId, setEditId] = useState<number>(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const User = useSelector((state: any) => state.auth.user);
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    getAllItems();
    fetchCategories();
  }, [page, searchName, searchStatus]);

  const getAllItems = async () => {
    try {
      setIsLoading(true);
      const res: any = await postAxios("/items/getall", {
        status: searchStatus || undefined,
        name: searchName,
        start: (page - 1) * limit,
        limit,
      });
      setItemData(res.data[0]);
      setTotalCount(res.data[1][0].tot);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res: any = await postAxios("/categories/getall", {
        activeStatus: 1,
        start: 0,
        limit: 50,
      });
      setCategories(res.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (id: number) => {
    setEditId(id);
    try {
      setEditForm(true);
      setIsLoading(true);
      const res: any = await postAxios("/items/getone", { id });
      const item = res.data[0][0];
      setEditName(item.name);
      setEditDescription(item.description);
      setEditPrice(item.price);
      setEditAvailable(item.available);
      setEditCategoryId(item.categoryId);
      setEditType(item.type);
      setEditStatus(item.activeStatus);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const handleDelete = async (id: number) => {
    await postAxios("/items/delete", {
      id,
      updatedBy: User.id,
    });
    getAllItems();
  };

  const handleSearch = () => {
    setPage(1);
    getAllItems();
  };

  const onAddFormClose = () => {
    setAddForm(false);
    setName("");
    setDescription("");
    setPrice(0);
    setAvailable(true);
    setCategoryId(0);
    setType("");
  };

  const handleUpdateItem = async () => {
    if (!editName) return;

    await postAxios("/items/update", {
      id: editId,
      name: editName,
      description: editDescription,
      price: editPrice,
      available: editAvailable,
      categoryId: editCategoryId,
      type: editType,
      activeStatus: editStatus,
      updatedBy: User.id,
    });
    setEditForm(false);
    getAllItems();
    setEditId(0);
  };

  const handleAddItem = async () => {
    if (!name || !categoryId) return;
    try {
      await postAxios("/items/add", {
        name,
        description,
        price,
        available,
        categoryId,
        type,
        activeStatus: 1,
        createdBy: User.id,
      });
      setAddForm(false);
      getAllItems();
      setName("");
      setDescription("");
      setPrice(0);
      setAvailable(true);
      setCategoryId(0);
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
          <h2 className="text-xl font-bold">Items</h2>
          <button
            onClick={() => setAddForm(true)}
            className="px-4 py-2 rounded-md bg-orange-700 text-white flex items-center gap-2 hover:bg-orange-600 cursor-pointer"
          >
            <FiPlus /> Add Item
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 mb-4">
          <div>
            <input
              type="text"
              placeholder="Search item"
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
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
            className="px-4 py-2 rounded-md bg-orange-700 text-white flex items-center gap-2 hover:bg-orange-600 cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <Loader />
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
                      Name
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Type
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
                  {itemData.map((item: Item) => (
                    <tr
                      key={item.id}
                      className="transition-all duration-500 hover:bg-gray-50"
                    >
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {item.description || "-"}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        ${item?.price}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {categories.find(c => c.id === item.categoryId)?.category || "-"}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {item?.type}
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
                          {item.activeStatus == 1 ? (
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
                          onClick={() => handleEdit(item.id)}
                          className="p-2 rounded-full bg-white transition-all duration-200 hover:bg-orange-500 cursor-pointer"
                        >
                          <HiPencilAlt className="w-5 h-5 text-indigo-500 hover:text-white" />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => {
                            setSelectedId(item.id);
                            setShowConfirm(true);
                          }}
                          className="p-2 rounded-full bg-white transition-all duration-200 hover:bg-red-600 cursor-pointer"
                        >
                          <HiTrash className="w-5 h-5 text-red-600 hover:text-white" />
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

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Do you really want to delete this item? This action cannot be
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
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Form */}
      {addForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h3 className="font-semibold text-lg">Add Item Form</h3>
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
                  Name*
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Enter Item Name"
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
                  Price*
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  placeholder="Enter Price"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Category*
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Type*
                </label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Enter Type"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Available
                </label>
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
                  onClick={handleAddItem}
                  className="px-6 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-indigo-700 transition cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Form */}
      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h3 className="font-semibold text-lg">Edit Item Form</h3>
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
                  Name*
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter Item Name"
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
                  Price*
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                  placeholder="Enter Price"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Category*
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(Number(e.target.value))}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Type*
                </label>
                <input
                  type="text"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  placeholder="Enter Type"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  checked={editAvailable}
                  onChange={(e) => setEditAvailable(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Available
                </label>
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
                  onClick={handleUpdateItem}
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-indigo-700 transition cursor-pointer"
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

export default Items; 