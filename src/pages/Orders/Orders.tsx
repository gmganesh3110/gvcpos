

const Orders = () => {
  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="typography_h1">Order Management</h2>
          <button className="button_primary flex items-center">
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            New Order
          </button>
        </div>
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-text-secondary"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  fill-rule="evenodd"
                ></path>
              </svg>
            </span>
            <input
              className="input pl-10"
              placeholder="Search by table, order number, or status"
              type="text"
            />
          </div>
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
            <a
              className="bg-white text-primary-color shadow-sm whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm"
              href="#"
            >
              All Orders
            </a>
            <a
              className="text-text-secondary hover:bg-white/60 hover:text-text-primary whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm"
              href="#"
            >
              New
            </a>
            <a
              className="text-text-secondary hover:bg-white/60 hover:text-text-primary whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm"
              href="#"
            >
              Cooking
            </a>
            <a
              className="text-text-secondary hover:bg-white/60 hover:text-text-primary whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm"
              href="#"
            >
              Ready
            </a>
            <a
              className="text-text-secondary hover:bg-white/60 hover:text-text-primary whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm"
              href="#"
            >
              Served
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">Table 1</h3>
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
                00:15:32
              </span>
            </div>
            <div className="flex items-center justify-center my-4 p-4 rounded-lg bg-teal-50 status-update">
              <div className="text-center">
                <p className="text-lg font-bold text-teal-700">Eating</p>
                <p className="text-sm text-teal-600">Order #12345</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div
                  className="bg-teal-500 h-1.5 rounded-full"
                  style={{width: "80%"}}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0110 13v-2.26A4.97 4.97 0 0112.93 7h0a4.97 4.97 0 012.93 3.74A6.97 6.97 0 0017 16c0 .34.024.673.07 1h-4.14zM2.07 17a6.97 6.97 0 001.5-4.33A5 5 0 015 13v-2.26A4.97 4.97 0 012.07 7h0a4.97 4.97 0 01-2.93 3.74A6.97 6.97 0 00-1 16c0 .34-.024.673-.07 1h4.14z"></path>
                </svg>
                4 Guests
              </span>
              <span className="font-semibold text-gray-800">$85.50</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 status-cooking">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">Table 2</h3>
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
                00:08:19
              </span>
            </div>
            <div className="flex items-center justify-center my-4 p-4 rounded-lg bg-amber-50">
              <div className="text-center">
                <p className="text-lg font-bold text-amber-700">Cooking</p>
                <p className="text-sm text-amber-600">Order #12346</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div
                  className="bg-amber-500 h-1.5 rounded-full"
                   style={{width: "45%"}}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0110 13v-2.26A4.97 4.97 0 0112.93 7h0a4.97 4.97 0 012.93 3.74A6.97 6.97 0 0017 16c0 .34.024.673.07 1h-4.14zM2.07 17a6.97 6.97 0 001.5-4.33A5 5 0 015 13v-2.26A4.97 4.97 0 012.07 7h0a4.97 4.97 0 01-2.93 3.74A6.97 6.97 0 00-1 16c0 .34-.024.673-.07 1h4.14z"></path>
                </svg>
                2 Guests
              </span>
              <span className="font-semibold text-gray-800">$42.00</span>
            </div>
          </div>
          <div className="bg-orange-50 border-2 border-dashed border-orange-300 rounded-xl shadow-sm p-4 flex flex-col justify-center items-center cursor-pointer hover:bg-orange-100 hover:border-orange-400 transition-colors duration-300">
            <h3 className="text-lg font-bold text-orange-800">Table 3</h3>
            <p className="text-sm text-orange-600">6 Seats</p>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white border-2 border-dashed border-orange-300">
                <svg
                  className="h-6 w-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4v16m8-8H4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
              <p className="text-sm font-semibold text-orange-700 mt-2">
                New Order
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">Table 4</h3>
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
                00:25:10
              </span>
            </div>
            <div className="flex items-center justify-center my-4 p-4 rounded-lg bg-blue-50 status-ready">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">Ready</p>
                <p className="text-sm text-blue-500">Order #12348</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{width: "100%"}}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0110 13v-2.26A4.97 4.97 0 0112.93 7h0a4.97 4.97 0 012.93 3.74A6.97 6.97 0 0017 16c0 .34.024.673.07 1h-4.14zM2.07 17a6.97 6.97 0 001.5-4.33A5 5 0 015 13v-2.26A4.97 4.97 0 012.07 7h0a4.97 4.97 0 01-2.93 3.74A6.97 6.97 0 00-1 16c0 .34-.024.673-.07 1h4.14z"></path>
                </svg>
                4 Guests
              </span>
              <span className="font-semibold text-gray-800">$112.75</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 status-cooking">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">Table 5</h3>
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
                00:02:45
              </span>
            </div>
            <div className="flex items-center justify-center my-4 p-4 rounded-lg bg-amber-50">
              <div className="text-center">
                <p className="text-lg font-bold text-amber-700">Cooking</p>
                <p className="text-sm text-amber-600">Order #12349</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div
                  className="bg-amber-500 h-1.5 rounded-full"
                   style={{width: "25%"}}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0110 13v-2.26A4.97 4.97 0 0112.93 7h0a4.97 4.97 0 012.93 3.74A6.97 6.97 0 0017 16c0 .34.024.673.07 1h-4.14zM2.07 17a6.97 6.97 0 001.5-4.33A5 5 0 015 13v-2.26A4.97 4.97 0 012.07 7h0a4.97 4.97 0 01-2.93 3.74A6.97 6.97 0 00-1 16c0 .34-.024.673-.07 1h4.14z"></path>
                </svg>
                2 Guests
              </span>
              <span className="font-semibold text-gray-800">$55.25</span>
            </div>
          </div>
          <div className="bg-orange-50 border-2 border-dashed border-orange-300 rounded-xl shadow-sm p-4 flex flex-col justify-center items-center cursor-pointer hover:bg-orange-100 hover:border-orange-400 transition-colors duration-300">
            <h3 className="text-lg font-bold text-orange-800">Table 6</h3>
            <p className="text-sm text-orange-600">8 Seats</p>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white border-2 border-dashed border-orange-300">
                <svg
                  className="h-6 w-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4v16m8-8H4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
              <p className="text-sm font-semibold text-orange-700 mt-2">
                New Order
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">Table 7</h3>
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
                00:18:05
              </span>
            </div>
            <div className="flex items-center justify-center my-4 p-4 rounded-lg bg-teal-50 status-update">
              <div className="text-center">
                <p className="text-lg font-bold text-teal-700">Eating</p>
                <p className="text-sm text-teal-600">Order #12351</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div
                  className="bg-teal-500 h-1.5 rounded-full"
                 style={{width: "90%"}}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0110 13v-2.26A4.97 4.97 0 0112.93 7h0a4.97 4.97 0 012.93 3.74A6.97 6.97 0 0017 16c0 .34.024.673.07 1h-4.14zM2.07 17a6.97 6.97 0 001.5-4.33A5 5 0 015 13v-2.26A4.97 4.97 0 012.07 7h0a4.97 4.97 0 01-2.93 3.74A6.97 6.97 0 00-1 16c0 .34-.024.673-.07 1h4.14z"></path>
                </svg>
                3 Guests
              </span>
              <span className="font-semibold text-gray-800">$68.00</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 status-ready">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">Takeaway 1</h3>
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
                00:05:50
              </span>
            </div>
            <div className="flex items-center justify-center my-4 p-4 rounded-lg bg-blue-50">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">Ready</p>
                <p className="text-sm text-blue-500">Order #12352</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                   style={{width: "100%"}}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M2.003 5.884L10 2l7.997 3.884A2 2 0 0119 7.828V12a2 2 0 01-2 2h-2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2H5a2 2 0 01-2-2V7.828a2 2 0 011.003-1.944zM11 16v-2h2v2h2V7.828L10 4.116 5 7.828V16h2v-2h2v2h2z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
                Online
              </span>
              <span className="font-semibold text-gray-800">$25.50</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;
