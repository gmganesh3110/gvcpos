import React, { useEffect, useState } from "react";
import { deleteAxios, getAxios, postAxios, putAxios } from "../../services/AxiosService";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface Block {
  id: number;
  blockName: string;
  description: string;
  createdBy: string;
  activeStatus: number;
}

const limit = 5;

const BlockPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [blockData, setBlockData] = useState<Block[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchBlock, setSearchBlock] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [addForm, setAddForm] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [blockName, setBlockName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<number>(1);
  const [editBlockName, setEditBlockName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editStatus, setEditStatus] = useState<number>(1);
  const [editId, setEditId] = useState<number>(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const User = useSelector((state: any) => state.auth.user);
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    getAllBlocks();
  }, [page, searchBlock, searchStatus]);

  const getAllBlocks = async () => {
    try {
      setIsLoading(true);
      const res: any = await getAxios("/blocks/getall", {
        status: searchStatus || undefined,
        blockName: searchBlock,
        restuarent: User.restuarent,
        start: (page - 1) * limit,
        limit,
      });
      setBlockData(res.data[0]);
      setTotalCount(res.data[1][0].tot);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch blocks. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEdit = async (id: number) => {
    setEditId(id);
    try {
      setEditForm(true);
      setIsLoading(true);
      const res: any = await getAxios("/blocks/getone/" + id);
      setEditBlockName(res.data[0][0].blockName);
      setEditDescription(res.data[0][0].description);
      setEditStatus(res.data[0][0].activeStatus);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error("Failed to fetch block details. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteAxios("/blocks/delete/" + id, {
        id,
        updatedBy: User.id,
        restuarent: User.restuarent,
      });
      toast.success("Block deleted successfully!");
      getAllBlocks();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete block. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    getAllBlocks();
  };

  const onAddFormClose = () => {
    setAddForm(false);
    setBlockName("");
    setDescription("");
    setStatus(1);
  };

  const handleUpdateBlock = async () => {
    if (!editBlockName) {
      toast.error("Block name is required!");
      return;
    }

    try {
      await putAxios("/blocks/update/" + editId, {
        id: editId,
        blockName: editBlockName,
        description: editDescription,
        activeStatus: editStatus,
        updatedBy: User.id,
        restuarent: User.restuarent,
      });
      toast.success("Block updated successfully!");
      setEditForm(false);
      getAllBlocks();
      setEditId(0);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update block. Please try again.");
    }
  };

  const handleAddBlock = async () => {
    if (!blockName) {
      toast.error("Block name is required!");
      return;
    }
    try {
      await postAxios("/blocks/add", {
        blockName,
        description,
        activeStatus: status,
        createdBy: User.id,
        restuarent: User.restuarent,
      });
      toast.success("Block added successfully!");
      setAddForm(false);
      getAllBlocks();
      setBlockName("");
      setDescription("");
    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "Failed to add block. Please try again.");
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
          <h2 className="text-xl font-bold">Blocks/Tables</h2>
          <button
            onClick={() => setAddForm(true)}
            className="px-4 py-2 rounded-md bg-blue-700 text-white flex items-center gap-2 hover:bg-blue-600 cursor-pointer"
          >
            <FiPlus /> Add Block/Table
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 mb-4">
          <div>
            <input
              type="text"
              placeholder="Search block"
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
              value={searchBlock}
              onChange={(e) => setSearchBlock(e.target.value)}
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

      {/* GRID VIEW */}
      {isLoading ? (
        <div className="flex justify-center items-center h-120">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {blockData.map((block: Block) => (
            <div
              key={block.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Header with Icon */}
              <div className="relative w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-xl flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-blue-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-blue-700">Block/Floor</span>
                </div>

                {/* ID Badge */}
                <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md shadow">
                  #{block.id}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col gap-2">
                <h3 className="text-base font-semibold text-gray-800">
                  {block.blockName}
                </h3>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {block.description || "No description available"}
                </p>

                <p className="text-xs text-gray-500">
                  Created by: {block.createdBy}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50 rounded-b-xl">
                {block.activeStatus == 1 ? (
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
                    onClick={() => handleEdit(block.id)}
                    className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <HiPencilAlt className="w-4 h-4 text-white" />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => {
                      setSelectedId(block.id);
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
              Do you really want to delete this block? This action cannot be
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

      {/* Add Block Form */}
      {addForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h3 className="font-semibold text-lg">Add Block Form</h3>
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
                  Block Name
                </label>
                <input
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  type="text"
                  placeholder="Enter Block Name"
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
                  onClick={handleAddBlock}
                  className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-700 transition cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Block Form */}
      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h3 className="font-semibold text-lg">Edit Block Form</h3>
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
                  Block Name
                </label>
                <input
                  type="text"
                  value={editBlockName}
                  onChange={(e) => setEditBlockName(e.target.value)}
                  placeholder="Enter Block Name"
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
                  onClick={handleUpdateBlock}
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-700 transition cursor-pointer"
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

export default BlockPage;
