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

interface TableData {
  id: number;
  tableName: string;
  description: string;
  capacity: number;
  blockName: string; // from join
  createdBy: {
    id: number;
    firstName: string;
    lastName: string;
  };
  activeStatus: number;
  block: {
    id: number;
    blockName: string;
  };
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
  const [searchStatus, setSearchStatus] = useState<string>("");
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
        start: 0,
        limit: 10,
      });
      setBlockList(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getAllTables = async () => {
    try {
      setIsLoading(true);
      const res: any = await getAxios("/tables/getall", {
        tableName: searchTable,
        blockId: searchBlockId,
        status: searchStatus,
        start: (page - 1) * limit,
        limit,
      });
      setTableData(res.data.data);
      setTotalCount(res.data.total);
    } catch (err) {
      console.error(err);
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
      setFormBlockId(res.data.block.id);
      setTableName(res.data.tableName);
      setDescription(res.data.description);
      setCapacity(res.data.capacity);
      setStatus(res.data.activeStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteAxios("/tables/delete", {
      id,
      updatedBy: User.id,
    });
    getAllTables();
  };

  const handleAddTable = async () => {
    if (!formBlockId || !tableName) return;
    try {
      await postAxios("/tables/add", {
        blockId: formBlockId,
        tableName,
        description,
        capacity,
        activeStatus: status,
        createdBy: User.id,
      });
      closeForm();
      getAllTables();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateTable = async () => {
    if (!formBlockId || !tableName) return;
    await putAxios("/tables/update/" + editId, {
      blockId: formBlockId,
      tableName,
      description,
      capacity,
      activeStatus: status,
      updatedBy: User.id,
    });
    closeForm();
    getAllTables();
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
          onChange={(e) => setSearchStatus(e.target.value)}
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

      {/* Table List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-120">
          <Loader />
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="table-auto min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">ID</th>
                <th className="p-3">Block</th>
                <th className="p-3">Table Name</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Description</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((t: TableData) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3 text-center">{t.id}</td>
                  <td className="p-3 text-center">{t.block.blockName}</td>
                  <td className="p-3 text-center">{t.tableName}</td>
                  <td className="p-3 text-center">{t.capacity}</td>
                  <td className="p-3 text-center">{t.description}</td>
                  <td className="p-3 text-center">
                    {t.activeStatus === 1 ? "Active" : "Inactive"}
                  </td>
                  <td className="p-3 flex gap-2 text-center">
                    <div className="text-center">
                      <button
                        onClick={() => handleEdit(t.id)}
                        className="p-2 bg-white rounded hover:bg-blue-500"
                      >
                        <HiPencilAlt className="text-indigo-500" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedId(t.id);
                          setShowConfirm(true);
                        }}
                        className="p-2 bg-white rounded hover:bg-blue-600"
                      >
                        <HiTrash className="text-blue-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
