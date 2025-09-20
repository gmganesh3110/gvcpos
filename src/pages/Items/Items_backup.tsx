import React, { useEffect, useState } from "react";
import { getAxios, postAxios, putAxios } from "../../services/AxiosService";
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

const limit = 4;

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
  const [image, setImage] = useState<String | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<String | string | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);

  const User = useSelector((state: any) => state.auth.user);
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    getAllItems();
  }, [page, searchName, searchStatus]);


  useEffect(() => {
    fetchCategories();
  }, []);

  const getAllItems = async () => {
    try {
      setIsLoading(true);
      const res: any = await getAxios("/items/getall", {
        status: searchStatus || undefined,
        name: searchName,
        restuarent: User.restuarent,
        start: (page - 1) * limit,
        limit,
      });
      setItemData(res.data.data);
      setTotalCount(res.data.total);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res: any = await getAxios("/items/categories/getall", {
        restuarent: User.restuarent,
      });
      console.log("Categories response:", res.data);
      setCategories(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  const handleEdit = async (id: number) => {
    setEditId(id);
    try {
      setEditForm(true);
      setIsLoading(true);
      const res: any = await getAxios("/items/getone/" + id);
      setEditName(res.data.name);
      setEditDescription(res.data.description);
      setEditPrice(res.data.price);
      setEditAvailable(res.data.available);
      setEditCategoryId(res.data.category.id);
      setEditType(res.data.type);
      setEditStatus(res.data.activeStatus);
      setEditImage(res.data.image);
      setEditPreview(res.data.image);
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
      restuarent: User.restuarent,
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

    setEditForm(false);
    getAllItems();
    setEditId(0);
  };

  const handleAddItem = async () => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Title + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Items Management</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your restaurant items and inventory</p>
              </div>
              <button
                onClick={() => setAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add New Item
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search items by name..."
                      className="block w-full pl-4 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : itemData.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No items found</h3>
            <p className="mt-2 text-sm text-gray-500">Get started by creating a new item.</p>
            <div className="mt-6">
              <button
                onClick={() => setAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add New Item
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {itemData.map((item: Item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
              >
                {/* Image Section */}
                <div className="relative aspect-w-16 aspect-h-12 bg-gray-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {item.activeStatus === 1 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* ID Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      #{item.id}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                      {item.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description || 'No description available'}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{item.price?.toFixed(2) || '0.00'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.category || 'Uncategorized'}
                    </span>
                  </div>

                  {item.type && (
                    <div className="mb-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                        {item.type}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions Section */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="inline-flex items-center p-2 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      title="Edit item"
                    >
                      <HiPencilAlt className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedId(item.id);
                        setShowConfirm(true);
                      }}
                      className="inline-flex items-center p-2 border border-transparent rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      title="Delete item"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                <span className="font-medium">{Math.min(page * limit, totalCount)}</span> of{" "}
                <span className="font-medium">{totalCount}</span> results
              </div>

              <nav className="flex items-center space-x-1" aria-label="Pagination">
                {/* Previous */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {(() => {
                  const pages: (number | string)[] = [];
                  const showRange = 2;

                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (page > showRange + 2) pages.push("...");
                    for (
                      let i = Math.max(2, page - showRange);
                      i <= Math.min(totalPages - 1, page + showRange);
                      i++
                    ) {
                      pages.push(i);
                    }
                    if (page < totalPages - (showRange + 1)) pages.push("...");
                    pages.push(totalPages);
                  }

                  return pages.map((p, i) =>
                    p === "..." ? (
                      <span
                        key={i}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={i}
                        onClick={() => setPage(p as number)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                          page === p
                            ? "z-10 bg-blue-600 text-white border border-blue-600"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
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
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    page === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => {
              setShowConfirm(false);
              setSelectedId(null);
            }}></div>
            
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Delete Item
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this item? This action cannot be undone and will permanently remove the item from your inventory.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedId) {
                      handleDelete(selectedId);
                    }
                    setShowConfirm(false);
                    setSelectedId(null);
                  }}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedId(null);
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Form */}
      {addForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onAddFormClose}></div>
            
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
              {/* Header */}
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">Add New Item</h3>
                    <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new item to your inventory</p>
                  </div>
                  <button
                    onClick={onAddFormClose}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  Add Item
                </button>
                <button
                  type="button"
                  onClick={onAddFormClose}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editForm && isLoading && <Loader />}
      {editForm && !isLoading && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onEditFormClose}></div>
            
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
              {/* Header */}
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">Edit Item</h3>
                    <p className="text-sm text-gray-500 mt-1">Update the item details in your inventory</p>
                  </div>
                  <button
                    onClick={onEditFormClose}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleUpdateItem}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  Update Item
                </button>
                <button
                  type="button"
                  onClick={onEditFormClose}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
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
