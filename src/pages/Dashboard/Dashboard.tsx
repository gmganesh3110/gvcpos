import { useState, useEffect } from "react";
import { 
  FaChartLine, 
  FaUtensils, 
  FaDollarSign, 
  FaShoppingCart,
  FaEye,
  FaPlus,
  FaFileAlt,
  FaBox,
  FaUserCog,
  FaArrowUp,
  FaFire,
  FaStar,
  FaThumbsUp
} from "react-icons/fa";
import { useSelector } from "react-redux";
import moment from "moment";
import DashboardService from "../../services/DashboardService";
import type { 
  DashboardStats, 
  RecentOrder
} from "../../services/DashboardService";

type TopSellingItem = {
  name: string;
  quantity: number;
  revenue: number;
  growth: number;
};

type HourlySales = {
  hour: string;
  orders: number;
  revenue: number;
};
import StatCard from "../../components/Dashboard/StatCard";
import QuickActionButton from "../../components/Dashboard/QuickActionButton";
import HourlySalesChart from "../../components/Dashboard/HourlySalesChart";
import TopSellingItems from "../../components/Dashboard/TopSellingItems";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    activeTables: 0,
    pendingOrders: 0,
    completedOrders: 0,
    topSellingItem: "",
    customerSatisfaction: 0,
    dailyGrowth: 0,
    weeklyGrowth: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topSellingItems, setTopSellingItems] = useState<TopSellingItem[]>([]);
  const [hourlySales, setHourlySales] = useState<HourlySales[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const user = useSelector((state: any) => state.auth.user);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await DashboardService.getAllDashboardData();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setTopSellingItems(data.topSellingItems);
        setHourlySales(data.hourlySales);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      case "Preparing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pending": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case "DINEIN": return "🍽️";
      case "TAKEAWAY": return "🥡";
      case "DELIVERY": return "🚚";
      default: return "📦";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Restaurant Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Welcome back, {user?.name || "Admin"}! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-sm font-medium text-gray-700">{moment(lastUpdated).format("HH:mm:ss")}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Orders Today"
          value={stats.totalOrders}
          icon={<FaShoppingCart className="text-xl" />}
          growth={stats.dailyGrowth}
          growthLabel="vs yesterday"
          color="blue"
        />
        
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<FaDollarSign className="text-xl" />}
          growth={stats.weeklyGrowth}
          growthLabel="vs last week"
          color="green"
        />
        
        <StatCard
          title="Avg Order Value"
          value={`₹${stats.averageOrderValue}`}
          icon={<FaChartLine className="text-xl" />}
          growth={5.2}
          growthLabel="vs yesterday"
          color="purple"
        />
        
        <StatCard
          title="Active Tables"
          value={`${stats.activeTables}/20`}
          icon={<FaUtensils className="text-xl" />}
          color="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Customer Satisfaction */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Customer Satisfaction</h3>
            <FaStar className="text-yellow-500 text-xl" />
          </div>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-800 mr-3">{stats.customerSatisfaction}</div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`text-sm ${i < Math.floor(stats.customerSatisfaction) ? 'text-yellow-500' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Based on 47 reviews today</p>
        </div>

        {/* Top Selling Item */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Top Seller</h3>
            <FaFire className="text-red-500 text-xl" />
          </div>
          <div className="text-xl font-bold text-gray-800 mb-2">{stats.topSellingItem}</div>
          <div className="flex items-center">
            <FaArrowUp className="text-green-500 text-sm mr-1" />
            <span className="text-green-500 text-sm font-medium">+15.2%</span>
            <span className="text-gray-500 text-sm ml-1">this week</span>
          </div>
        </div>

        {/* Order Completion Rate */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Completion Rate</h3>
            <FaThumbsUp className="text-green-500 text-xl" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {Math.round((stats.completedOrders / stats.totalOrders) * 100)}%
          </div>
          <p className="text-gray-500 text-sm">{stats.completedOrders} of {stats.totalOrders} orders completed</p>
        </div>
      </div>

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <HourlySalesChart data={hourlySales} />
        <TopSellingItems data={topSellingItems} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <QuickActionButton
            icon={<FaPlus />}
            label="New Order"
            color="blue"
          />
          <QuickActionButton
            icon={<FaBox />}
            label="Inventory"
            color="green"
          />
          <QuickActionButton
            icon={<FaFileAlt />}
            label="Reports"
            color="purple"
          />
          <QuickActionButton
            icon={<FaDollarSign />}
            label="Expenses"
            color="orange"
          />
          <QuickActionButton
            icon={<FaUserCog />}
            label="Users"
            color="red"
          />
          <QuickActionButton
            icon={<FaChartLine />}
            label="Analytics"
            color="indigo"
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Live Updates
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300 flex items-center gap-2">
              <FaEye className="text-sm" />
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-gray-600 font-medium">Order ID</th>
                <th className="p-4 text-left text-gray-600 font-medium">Customer</th>
                <th className="p-4 text-left text-gray-600 font-medium">Items</th>
                <th className="p-4 text-left text-gray-600 font-medium">Amount</th>
                <th className="p-4 text-left text-gray-600 font-medium">Status</th>
                <th className="p-4 text-left text-gray-600 font-medium">Time</th>
                <th className="p-4 text-left text-gray-600 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-4 text-gray-700 font-medium">{order.id}</td>
                  <td className="p-4 text-gray-700">{order.customer}</td>
                  <td className="p-4 text-gray-700 max-w-xs truncate">{order.items}</td>
                  <td className="p-4 text-gray-700 font-semibold">₹{order.amount}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{order.orderTime}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getOrderTypeIcon(order.orderType)}</span>
                      <span className="text-sm text-gray-600">{order.orderType}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
