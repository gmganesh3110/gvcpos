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

interface TableData {
  id: number;
  tableName: string;
  description: string;
  capacity: number;
  blockName: string; // from join
  createdBy: string;
  activeStatus: number;
  block: string;
}

interface Block {
  id: number;
  blockName: string;
}

const limit = 5;

const Tables: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [blockList, setBlockList] = useState<Block[]>([]);
  const [searchBlockId, setSearchBlockId] = useState<number>(0);
  const [searchStatus, setSearchStatus] = useState<number>(1);
  const [searchTable, setSearchTable] = useState<string>("");

  // Add/Edit form states
  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formBlockId, setFormBlockId] = useState<number | "">("");
  const [tableName, setTableName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState<number>(1);
  const [status, setStatus] = useState<number>(1);

  const [editId, setEditId] = useState(0);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const User = useSelector((state: any) => state.auth.user);
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    getAllTables();
  }, [page, searchBlockId, searchTable, searchStatus]);

  useEffect(() => {
    getBlockList();
  }, []);

  const getBlockList = async () => {
    try {
      const res: any = await getAxios("/blocks/getall", {
        restuarent: User.restuarent,
        status: 1,
        start: 0,
        limit: 10,
      });
      setBlockList(res.data[0]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blocks. Please try again.");
    }
  };

  const getAllTables = async () => {
    try {
      setIsLoading(true);
      const res: any = await getAxios("/tables/getall", {
        tableName: searchTable,
        block: searchBlockId,
        restuarent: User.restuarent,
        status: searchStatus,
        start: (page - 1) * limit,
        limit,
      });
      setTableData(res.data[0]);
      setTotalCount(res.data[1][0].tot);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tables. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id: number) => {
    setEditId(id);
    try {
      setEditForm(true);
      setIsLoading(true);
      const res: any = await getAxios("/tables/getone/" + id);
      setFormBlockId(res.data[0][0].block.id);
      setTableName(res.data[0][0].tableName);
      setDescription(res.data[0][0].description);
      setCapacity(res.data[0][0].capacity);
      setStatus(res.data[0][0].activeStatus);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch table details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAxios("/tables/delete/", {
        id,
        updatedBy: User.id,
        restuarent: User.restuarent,
      });
      toast.success("Table deleted successfully!");
      getAllTables();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete table. Please try again.");
    }
  };

  const handleAddTable = async () => {
    if (!formBlockId || !tableName) {
      toast.error("Block and table name are required!");
      return;
    }
    try {
      await postAxios("/tables/add", {
        block: formBlockId,
        tableName,
        description,
        capacity,
        activeStatus: status,
        createdBy: User.id,
        restuarent: User.restuarent,
      });
      toast.success("Table added successfully!");
      closeForm();
      getAllTables();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to add table. Please try again.");
    }
  };

  const handleUpdateTable = async () => {
    if (!formBlockId || !tableName) {
      toast.error("Block and table name are required!");
      return;
    }
    try {
      await putAxios("/tables/update/" + editId, {
        block: formBlockId,
        tableName,
        description,
        capacity,
        activeStatus: status,
        updatedBy: User.id,
        restuarent: User.restuarent,
      });
      toast.success("Table updated successfully!");
      closeForm();
      getAllTables();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update table. Please try again.");
    }
  };

  const closeForm = () => {
    setAddForm(false);
    setEditForm(false);
    setFormBlockId("");
    setTableName("");
    setDescription("");
    setCapacity(1);
    setStatus(1);
    setEditId(0);
  };

  return (
    <div className="flex flex-col p-6 w-[100%]">
      {/* Title + Actions */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Tables</h2>
        <button
          onClick={() => setAddForm(true)}
          className="px-4 py-2 rounded-md bg-blue-700 text-white flex items-center gap-2 hover:bg-blue-600"
        >
          <FiPlus /> Add Table
        </button>
      </div>

      {/* Search */}

      <div className="flex gap-2 mb-4">
        <div>
          <input
            type="text"
            placeholder="Search Name"
            className="border rounded-md px-3 py-2"
            value={searchTable}
            onChange={(e) => setSearchTable(e.target.value)}
          />
        </div>
        <select
          className="border rounded-md px-3 py-2"
          value={searchBlockId}
          onChange={(e) =>
            setSearchBlockId(e.target.value ? Number(e.target.value) : 0)
          }
        >
          <option value="">All Blocks</option>
          {blockList.map((b) => (
            <option key={b.id} value={b.id}>
              {b.blockName}
            </option>
          ))}
        </select>

        <select
          className="border rounded-md px-3 py-2"
          value={searchStatus}
          onChange={(e:any) => setSearchStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>

        <button
          onClick={() => getAllTables()}
          className="px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* GRID VIEW */}
      {isLoading ? (
        <div className="flex justify-center items-center h-120">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {tableData.map((table: TableData) => (
            <div
              key={table.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Header with Table Icon */}
              <div className="relative w-full h-32 bg-gradient-to-br from-green-50 to-emerald-100 rounded-t-xl flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-green-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-700">Table</span>
                </div>

                {/* ID Badge */}
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md shadow">
                  #{table.id}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col gap-2">
                <h3 className="text-base font-semibold text-gray-800">
                  {table.tableName}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                  </svg>
                  <span>{table.blockName}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>Capacity: {table.capacity}</span>
                </div>

                {table.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {table.description}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50 rounded-b-xl">
                {table.activeStatus === 1 ? (
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
                    onClick={() => handleEdit(table.id)}
                    className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <HiPencilAlt className="w-4 h-4 text-white" />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => {
                      setSelectedId(table.id);
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
      {/* Add/Edit Form */}
      {(addForm || editForm) && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-30">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {addForm ? "Add Table" : "Edit Table"}
            </h3>

            <label className="block mb-2">Block</label>
            <select
              value={formBlockId}
              onChange={(e) =>
                setFormBlockId(e.target.value ? Number(e.target.value) : "")
              }
              className="border rounded w-full mb-3 px-3 py-2"
            >
              <option value="">Select Block</option>
              {blockList.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.blockName}
                </option>
              ))}
            </select>

            <label className="block mb-2">Table Name</label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="border rounded w-full mb-3 px-3 py-2"
            />

            <label className="block mb-2">Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="border rounded w-full mb-3 px-3 py-2"
            />

            <label className="block mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded w-full mb-3 px-3 py-2"
            />

            <label className="block mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="border rounded w-full mb-3 px-3 py-2"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeForm}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addForm ? handleAddTable : handleUpdateTable}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {addForm ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="mb-4 font-semibold">Delete Table?</h3>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedId) handleDelete(selectedId);
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
