import React, { useEffect, useState } from "react";
import { postAxios } from "../../services/AxiosService";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PaymentMode } from "../../constants/Paymodes";
import moment from "moment";
interface ExpenseItem {
  id: number;
  expenseItem: string;
  description: string;
  createdBy: string;
  activeStatus: number;
}

interface ExpensePo {
  id: number;
  billNo: string;
  date: string;
  createdBy: string;
  totalAmount: number;
  paymentMethod: string;
}

interface RowItem {
  item: string;
  qty: number;
  price: number;
  amount: number;
}
const limit = 5;
const Expenses: React.FC = () => {
  const today = new Date();
  const [page, setPage] = useState<number>(1);
  const [expenseData, setExpenseData] = useState<ExpensePo[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [addForm, setAddForm] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editBillNo, setEditBillNo] = useState("");
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [editPaymentMethod, setEditPaymentMethod] = useState("");
  const [editRows, setEditRows] = useState<RowItem[]>([]);
  const [editTotalAmount, setEditTotalAmount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [rows, setRows] = useState<RowItem[]>([
    { item: "", qty: 1, price: 0, amount: 0 },
  ]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [billNo, setBillNo] = useState<string>("");
  const User = useSelector((state: any) => state.auth.user);
  const totalPages = Math.ceil(totalCount / limit);
  const [searchBillNo, setSearchBillNo] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | null>(today);
  const [toDate, setToDate] = useState<Date | null>(today);
  useEffect(() => {
    getAllExpensePos();
  }, [page, searchBillNo, fromDate, toDate]);
  const getAllExpensePos = async () => {
    try {
      setIsLoading(true);
      const res: any = await postAxios("/expensepos/getall", {
        billNo: searchBillNo,
        fromDate: moment(fromDate).format("YYYY-MM-DD"),
        toDate: moment(toDate).format("YYYY-MM-DD"),
        start: (page - 1) * limit,
        limit,
      });
      setExpenseData(res.data[0]);
      setTotalCount(res.data[1][0].tot);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  const getAllExpenseItems = async () => {
    try {
      setIsLoading(true);
      const res: any = await postAxios("/expenseitems/getall", {
        start: 0,
        limit: 100,
        status: 1,
      });
      setExpenseItems(res.data[0] || []);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllExpenseItems();
  }, []);
  const handleEdit = async (id: number) => {
    try {
      setEditForm(true);
      setIsLoading(true);

      const res: any = await postAxios("/expensepos/getone", { id });
      const items = res.data[0];

      if (items && items.length > 0) {
        const first = items[0];

        // fill edit form states
        setEditBillNo(first.billNo);
        setEditDate(new Date(first.date));
        setEditPaymentMethod(first.paymentMethod || "");
        setEditTotalAmount(first.totalAmount);

        // map rows
        const mappedRows = items.map((it: any) => ({
          item: it.itemId,
          qty: it.quantity,
          price: it.price,
          amount: it.amount,
          expensePoitemId: it.expensePoitemId,
        }));
        setEditRows(mappedRows);
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    await postAxios("/expensepos/delete", {
      id,
      updatedBy: User.id,
    });
    getAllExpensePos();
  };
  const handleSearch = () => {
    setPage(1);
    getAllExpensePos();
  };
  const onAddFormClose = () => {
    setAddForm(false);
    setRows([{ item: "", qty: 1, price: 0, amount: 0 }]);
    setPaymentMethod("");
    setBillNo("");
  };
  const onEditFormClose = () => {
    setEditForm(false);
  };
  const handleRowChange = (index: number, field: keyof RowItem, value: any) => {
    const updated: any = [...rows];

    // update the editable field
    if (field !== "amount") {
      updated[index][field] = value;
    }
    // recalculate amount whenever qty or price changes
    if (field === "qty" || field === "price") {
      const qty = Number(updated[index].qty) || 0;
      const price = Number(updated[index].price) || 0;
      updated[index].amount = qty * price;
    }
    setRows(updated);
  };
  const addRow = () =>
    setRows([...rows, { item: "", qty: 1, price: 0, amount: 0 }]);
  const removeRow = (index: number) =>
    setRows(rows.filter((_, i) => i !== index));
  const totalAmount = rows.reduce((sum, row) => sum + row.qty * row.price, 0);
  const handleSubmit = async () => {
    console.log({
      date,
      billNo,
      rows,
      paymentMethod,
      totalAmount,
    });
    await postAxios("/expensepos/create", {
      date: moment(date).format("YYYY-MM-DD"),
      billNo,
      expenseItems: rows,
      paymentMethod,
      totalAmount,
      createdBy: User.id,
    });
    onAddFormClose();
    getAllExpensePos();
  };
  return (
    <div className="flex flex-col w-[100%]">
      <div className="p-6">
        {/* Title + Actions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Expenses List</h2>
          <button
            onClick={() => setAddForm(true)}
            className="px-4 py-2 rounded-md bg-orange-700 text-white flex items-center gap-2 hover:bg-orange-600 cursor-pointer"
          >
            <FiPlus /> Add Expense
          </button>
        </div>
        {/* Search Input */}
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Order Id */}
            <input
              type="text"
              placeholder="Search Bill No"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              value={searchBillNo!}
              onChange={(e) => setSearchBillNo(e.target.value)}
            />

            {/* From Date */}
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              placeholderText="From Date"
            />

            {/* To Date */}
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              placeholderText="To Date"
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-md bg-orange-700 text-white flex items-center justify-center gap-2 hover:bg-orange-600 w-full"
            >
              Search
            </button>
          </div>
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
                      Date
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Bill No
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Total Amount
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Payment Method
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Created By
                    </th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {expenseData.map((expense: ExpensePo) => (
                    <tr
                      key={expense.id}
                      className="transition-all duration-500 hover:bg-gray-50"
                    >
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {expense.id}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {moment(expense.date).format("MM/DD/YYYY")}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {expense.billNo}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {expense.totalAmount}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {expense.paymentMethod}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900">
                        {expense.createdBy}
                      </td>
                      <td className="flex p-5 gap-2">
                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(expense.id)}
                          className="p-2 rounded-full bg-white transition-all duration-200 hover:bg-orange-500 cursor-pointer"
                        >
                          <HiPencilAlt className="w-5 h-5 text-indigo-500 hover:text-white" />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => {
                            setSelectedId(expense.id);
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
              Do you really want to delete this expense item? This action cannot
              be undone.
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
      {/* Add Block Form */}
      {addForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl p-8 border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h3 className="font-bold text-2xl text-gray-800 flex items-center gap-2">
                ✨ Add Expense
              </h3>
              <button
                onClick={onAddFormClose}
                className="text-gray-500 hover:text-red-500 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            {/* Date & Bill Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Date
                </label>
                <DatePicker
                  selected={date}
                  onChange={(d: Date | null) => setDate(d)}
                  className="border rounded-xl px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  dateFormat="DD/MM/yyyy"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Bill No
                </label>
                <input
                  type="text"
                  value={billNo}
                  onChange={(e) => setBillNo(e.target.value)}
                  placeholder="Enter bill number"
                  className="border rounded-xl px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100">
                  <tr>
                    <th className="p-3 text-left text-gray-700 font-semibold">
                      Expense Item
                    </th>
                    <th className="p-3 text-center text-gray-700 font-semibold">
                      Quantity
                    </th>
                    <th className="p-3 text-center text-gray-700 font-semibold">
                      Price
                    </th>
                    <th className="p-3 text-center text-gray-700 font-semibold">
                      Amount
                    </th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-t ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="p-3">
                        <select
                          value={row.item}
                          onChange={(e) =>
                            handleRowChange(idx, "item", e.target.value)
                          }
                          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select Expense Item</option>
                          {expenseItems.map((item: any) => (
                            <option key={item.id} value={item.id}>
                              {item.expenseItem}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="1"
                          value={row.qty}
                          onChange={(e) =>
                            handleRowChange(idx, "qty", Number(e.target.value))
                          }
                          className="border rounded-lg px-3 py-2 w-24 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="0"
                          value={row.price}
                          onChange={(e) =>
                            handleRowChange(
                              idx,
                              "price",
                              Number(e.target.value)
                            )
                          }
                          className="border rounded-lg px-3 py-2 w-28 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="p-3 text-center font-semibold text-gray-800">
                        ₹{row.qty * row.price}
                      </td>
                      <td className="p-3 text-center">
                        {rows.length > 1 && (
                          <button
                            onClick={() => removeRow(idx)}
                            className="text-red-500 hover:text-red-700 font-bold text-lg"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={addRow}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow hover:opacity-90 transition"
              >
                + Add Row
              </button>
            </div>
            {/* Paymode + Total */}
            <div className="flex flex-col md:flex-row justify-between items-center border-t pt-6 gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-gray-700 font-semibold mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Payment Method</option>
                  <option value={PaymentMode.ONLINE}>Online</option>
                  <option value={PaymentMode.CASH}>Cash</option>
                  <option value={PaymentMode.CARD}>Card</option>
                  <option value={PaymentMode.UPI}>UPI</option>
                </select>
              </div>
              <div className="text-right bg-indigo-50 px-6 py-3 rounded-xl shadow-sm">
                <h4 className="font-bold text-xl text-indigo-700">
                  Total: ₹{totalAmount.toFixed(2)}
                </h4>
              </div>
            </div>
            {/* Footer buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={onAddFormClose}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow hover:opacity-90 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Block Form */}
      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl p-8 border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h3 className="font-bold text-2xl text-gray-800 flex items-center gap-2">
                ✨ View Expense
              </h3>
              <button
                onClick={onEditFormClose}
                className="text-gray-500 hover:text-red-500 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            {/* Date & Bill Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Date
                </label>
                <DatePicker
                  selected={editDate}
                  onChange={(d: Date | null) => setEditDate(d)}
                  className="border rounded-xl px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Bill No
                </label>
                <input
                  type="text"
                  value={editBillNo}
                  onChange={(e) => setEditBillNo(e.target.value)}
                  placeholder="Enter bill number"
                  className="border rounded-xl px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100">
                  <tr>
                    <th className="p-3 text-left text-gray-700 font-semibold">
                      Expense Item
                    </th>
                    <th className="p-3 text-center text-gray-700 font-semibold">
                      Quantity
                    </th>
                    <th className="p-3 text-center text-gray-700 font-semibold">
                      Price
                    </th>
                    <th className="p-3 text-center text-gray-700 font-semibold">
                      Amount
                    </th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {editRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-t ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="p-3">
                        <select
                          value={row.item}
                          onChange={(e) =>
                            handleRowChange(idx, "item", e.target.value)
                          }
                          className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select Expense Item</option>
                          {expenseItems.map((item: any) => (
                            <option key={item.id} value={item.id}>
                              {item.expenseItem}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="1"
                          value={row.qty}
                          onChange={(e) =>
                            handleRowChange(idx, "qty", Number(e.target.value))
                          }
                          className="border rounded-lg px-3 py-2 w-24 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="0"
                          value={row.price}
                          onChange={(e) =>
                            handleRowChange(
                              idx,
                              "price",
                              Number(e.target.value)
                            )
                          }
                          className="border rounded-lg px-3 py-2 w-28 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="p-3 text-center font-semibold text-gray-800">
                        ₹{row.qty * row.price}
                      </td>
                      {/* <td className="p-3 text-center">
                        {rows.length > 1 && (
                          <button
                            onClick={() => removeRow(idx)}
                            className="text-red-500 hover:text-red-700 font-bold text-lg"
                          >
                            ✕
                          </button>
                        )}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <button
                onClick={addRow}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow hover:opacity-90 transition"
              >
                + Add Row
              </button> */}
            </div>
            {/* Paymode + Total */}
            <div className="flex flex-col md:flex-row justify-between items-center border-t pt-6 gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-gray-700 font-semibold mb-1">
                  Payment Method
                </label>
                <select
                  value={editPaymentMethod}
                  onChange={(e) => setEditPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Payment Method</option>
                  <option value={PaymentMode.ONLINE}>Online</option>
                  <option value={PaymentMode.CASH}>Cash</option>
                  <option value={PaymentMode.CARD}>Card</option>
                  <option value={PaymentMode.UPI}>UPI</option>
                </select>
              </div>
              <div className="text-right bg-indigo-50 px-6 py-3 rounded-xl shadow-sm">
                <h4 className="font-bold text-xl text-indigo-700">
                  Total: ₹{editTotalAmount.toFixed(2)}
                </h4>
              </div>
            </div>
            {/* Footer buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={onEditFormClose}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm transition"
              >
                Close
              </button>
              {/* <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow hover:opacity-90 transition"
              >
                Submit
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Expenses;
