import React, { useEffect, useState } from "react";
import { postAxios } from "../../services/AxiosService";
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
  createdBy: string;
  activeStatus: number;
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
  const [searchBlockId, setSearchBlockId] = useState<number >(0);
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
      const res: any = await postAxios("/blocks/getall", {
        status: 1,
        start: 0,
        limit: 10,
      });
      setBlockList(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const getAllTables = async () => {
    try {
      setIsLoading(true);
      const res: any = await postAxios("/tables/getall", {
        tableName: searchTable,
        blockId: searchBlockId,
        status: searchStatus,
        start: (page - 1) * limit,
        limit,
      });
      setTableData(res.data[0]);
      setTotalCount(res.data[1][0].tot);
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
      const res: any = await postAxios("/tables/getone", { id });
      const t = res.data[0][0];
      setFormBlockId(t.blockId);
      setTableName(t.tableName);
      setDescription(t.description);
      setCapacity(t.capacity);
      setStatus(t.activeStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await postAxios("/tables/delete", {
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
    await postAxios("/tables/update", {
      id: editId,
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
          className="px-4 py-2 rounded-md bg-orange-700 text-white flex items-center gap-2 hover:bg-orange-600"
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
          onClick={() => setPage(1)}
          className="px-4 py-2 rounded-md bg-orange-700 text-white hover:bg-orange-600"
        >
          Search
        </button>
      </div>

      {/* Table List */}
      {isLoading ? (
        <Loader />
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
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{t.id}</td>
                  <td className="p-3">{t.blockName}</td>
                  <td className="p-3">{t.tableName}</td>
                  <td className="p-3">{t.capacity}</td>
                  <td className="p-3">{t.description}</td>
                  <td className="p-3">
                    {t.activeStatus === 1 ? "Active" : "Inactive"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(t.id)}
                      className="p-2 bg-white rounded hover:bg-orange-500"
                    >
                      <HiPencilAlt className="text-indigo-500" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedId(t.id);
                        setShowConfirm(true);
                      }}
                      className="p-2 bg-white rounded hover:bg-red-600"
                    >
                      <HiTrash className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <div>
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalCount)} of {totalCount}
        </div>
        <div className="flex gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-orange-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
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
                className="px-4 py-2 bg-orange-500 text-white rounded"
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
                className="px-4 py-2 bg-red-600 text-white rounded"
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
