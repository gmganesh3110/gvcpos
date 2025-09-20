import React, { useEffect, useState } from "react";
import { getAxios, postAxios, putAxios } from "../../services/AxiosService";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: string;
  image: any;
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
  const [searchCategory, setSearchCategory] = useState<string>("");
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
  const [image, setImage] = useState<String | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<String | string | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);

  const User = useSelector((state: any) => state.auth.user);
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    getAllItems();
  }, [page, searchName, searchStatus, searchCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const getAllItems = async () => {
    try {
      setIsLoading(true);
      const res: any = await getAxios("/items/getall", {
        status: searchStatus || undefined,
        name: searchName,
        category: searchCategory || undefined,
        restuarent: User.restuarent,
        start: (page - 1) * limit,
        limit,
      });
      setItemData(res.data[0]);
      setTotalCount(res.data[1][0].tot);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch items. Please try again.");
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res: any = await getAxios("/items/categories/getall", {
        restuarent: User.restuarent,
      });
      setCategories(res.data[0]);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch categories. Please try again.");
    }
  };

  const handleEdit = async (id: number) => {
    setEditId(id);
    try {
      setEditForm(true);
      setIsLoading(true);
      const res: any = await getAxios("/items/getone/" + id);
      setEditName(res.data[0][0].name);
      setEditDescription(res.data[0][0].description);
      setEditPrice(res.data[0][0].price);
      setEditAvailable(res.data[0][0].available);
      setEditCategoryId(res.data[0][0].category.id);
      setEditType(res.data[0][0].type);
      setEditStatus(res.data[0][0].activeStatus);
      setEditImage(res.data[0][0].image);
      setEditPreview(res.data[0][0].image);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error("Failed to fetch item details. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await postAxios("/items/delete", {
        id,
        updatedBy: User.id,
        restuarent: User.restuarent,
      });
      toast.success("Item deleted successfully!");
      getAllItems();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete item. Please try again.");
    }
  };

  const handleSearch = () => {
    setPage(1);
    getAllItems();
  };

  const clearFilters = () => {
    setSearchName("");
    setSearchStatus("");
    setSearchCategory("");
    setPage(1);
  };

  const onAddFormClose = () => {
    setAddForm(false);
    setName("");
    setDescription("");
    setPrice(0);
    setAvailable(true);
    setCategoryId(0);
    setType("");
    setImage(null);
    setPreview(null);
    setEditImage(null);
    setEditPreview(null);
  };

  const handleUpdateItem = async () => {
    if (!editName) {
      toast.error("Item name is required!");
      return;
    }
    try {
      await putAxios("/items/update/" + editId, {
        name: editName,
        description: editDescription,
        price: editPrice,
        available: editAvailable,
        categoryId: editCategoryId,
        type: editType,
        activeStatus: editStatus,
        updatedBy: User.id,
        restuarent: User.restuarent,
        image: editImage,
      });
      toast.success("Item updated successfully!");
      setEditForm(false);
      getAllItems();
      setEditId(0);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update item. Please try again.");
    }
  };

  const handleAddItem = async () => {
    if (!name) {
      toast.error("Item name is required!");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category!");
      return;
    }
    if (!type) {
      toast.error("Item type is required!");
      return;
    }
    
    let obj = {
      name,
      description,
      price,
      available,
      category: categoryId,
      type,
      activeStatus: 1,
      createdBy: User.id,
      restuarent: User.restuarent,
      image,
    };
    try {
      await postAxios("/items/add", obj);
      toast.success("Item added successfully!");
      setAddForm(false);
      getAllItems();
      setName("");
      setDescription("");
      setPrice(0);
      setAvailable(true);
      setCategoryId(0);
      setType("");
    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "Failed to add item. Please try again.");
    }
  };

  const onEditFormClose = () => {
    setEditForm(false);
    setEditId(0);
  };
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
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image. Please try again.");
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
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-[100%]">
      <div className="p-6">
        {/* Title + Actions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Items</h2>
          <button
            onClick={() => setAddForm(true)}
            className="px-4 py-2 rounded-md bg-blue-700 text-white flex items-center gap-2 hover:bg-blue-600 cursor-pointer"
          >
            <FiPlus /> Add Item
          </button>
        </div>

        {/* Search Input */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div>
            <input
              type="text"
              placeholder="Search item"
              className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64"
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
          <div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-md bg-blue-700 text-white flex items-center gap-2 hover:bg-blue-600 cursor-pointer"
          >
            Search
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-md bg-gray-500 text-white flex items-center gap-2 hover:bg-gray-600 cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <div className="flex justify-center items-center h-120">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
          {itemData.map((item: Item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-gray-100 rounded-t-xl flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}

                {/* ID Badge */}
                <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md shadow">
                  #{item.id}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col gap-2">
                <h3 className="text-base font-semibold text-gray-800">
                  {item.name}
                </h3>

                <p className="text-lg font-bold text-blue-600">
                  ₹{item?.price}
                </p>

                <span className="inline-block text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                  {item?.category}
                </span>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50 rounded-b-xl">
                {item.activeStatus == 1 ? (
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
                    onClick={() => handleEdit(item.id)}
                    className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <HiPencilAlt className="w-4 h-4 text-white" />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => {
                      setSelectedId(item.id);
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
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
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
                  className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editForm && isLoading && <Loader />}
      {editForm && !isLoading && (
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
                  className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition cursor-pointer"
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
