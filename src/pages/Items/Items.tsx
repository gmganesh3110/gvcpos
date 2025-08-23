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
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);

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
      setEditImage(item.image);
      setEditPreview(item.image);
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
    const base64Image = await fileToBase64(editImage!);
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
      image: base64Image,
    });
    setEditForm(false);
    getAllItems();
    setEditId(0);
  };
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // convert to Base64 string
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddItem = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("available", available ? "1" : "0");
    formData.append("categoryId", categoryId.toString());
    formData.append("type", type);
    formData.append("activeStatus", "1");
    formData.append("createdBy", User.id.toString());
    const base64Image = await fileToBase64(image!);
    // Only append if image exists
    if (image) {
      formData.append("image", base64Image);
    }
    try {
      await postAxios("/items/add", formData);
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
        <div className="flex justify-center items-center h-120">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 p-8">
          {itemData.map((item: any) => (
            <div
              key={item.id}
              className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col group"
            >
              {/* Image Preview */}
              <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-50 rounded-t-3xl overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}

                {/* Badge on image */}
                <span className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  #{item.id}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col gap-3">
                <h3 className="text-lg font-bold text-gray-900  group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </h3>

                <div className="flex justify-between items-center">
                  <p className="text-xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text">
                    ₹{item?.price}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 font-medium shadow-sm">
                    {categories.find((c) => c.id === item.categoryId)
                      ?.category || "-"}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center px-5 py-4 border-t bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-3xl">
                {item.activeStatus == 1 ? (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                    ● Active
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                    ● Inactive
                  </span>
                )}

                <div className="flex gap-3">
                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="p-2.5 rounded-full bg-orange-100 hover:bg-orange-500 transition-all shadow-sm"
                  >
                    <HiPencilAlt className="w-4 h-4 text-orange-600 group-hover:text-white" />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => {
                      setSelectedId(item.id);
                      setShowConfirm(true);
                    }}
                    className="p-2.5 rounded-full bg-red-100 hover:bg-red-500 transition-all shadow-sm"
                  >
                    <HiTrash className="w-4 h-4 text-red-600 group-hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                      ? "bg-orange-500 text-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-h-[95%] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="font-semibold text-xl">Add Item Form</h3>
              <button
                onClick={onAddFormClose}
                className="text-gray-500 hover:text-black cursor-pointer text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="p-8 bg-gray-50 rounded-b-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
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
                </div>

                {/* Right Column */}
                <div>
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

                  {/* Image Upload */}
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setImage(file);
                          setPreview(URL.createObjectURL(file)); // preview
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                           file:bg-orange-500 file:text-white hover:file:bg-orange-600"
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
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-8">
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
                  className="px-6 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-h-[95%] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="font-semibold text-xl">Edit Item Form</h3>
              <button
                onClick={onEditFormClose}
                className="text-gray-500 hover:text-black cursor-pointer text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="p-8 bg-gray-50 rounded-b-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Name*
                    </label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
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
                </div>

                {/* Right Column */}
                <div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Category*
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editCategoryId}
                      onChange={(e) =>
                        setEditCategoryId(Number(e.target.value))
                      }
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

                  {/* Image Upload */}
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setEditImage(file);
                          setEditPreview(URL.createObjectURL(file)); // preview
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                           file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                    />

                    {/* Preview */}
                    {editPreview && (
                      <div className="mt-4">
                        <img
                          src={editPreview!}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border shadow"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={onEditFormClose}
                  className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleUpdateItem}
                  className="px-6 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Item Form */}
    </div>
  );
};

export default Items;
