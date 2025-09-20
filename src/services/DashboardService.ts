import { getAxios } from "./AxiosService";

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  activeTables: number;
  pendingOrders: number;
  completedOrders: number;
  topSellingItem: string;
  customerSatisfaction: number;
  dailyGrowth: number;
  weeklyGrowth: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  items: string;
  amount: number;
  status: "Completed" | "Pending" | "Preparing" | "Cancelled";
  orderTime: string;
  tableNumber?: string;
  orderType: "DINEIN" | "TAKEAWAY" | "DELIVERY";
}

export interface TopSellingItem {
  name: string;
  quantity: number;
  revenue: number;
  growth: number;
}

type HourlySales = {
  hour: string;
  orders: number;
  revenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  topSellingItems: TopSellingItem[];
  hourlySales: HourlySales[];
}

class DashboardService {
  /**
   * Fetch dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await getAxios("/dashboard/stats");
      return response?.data || this.getMockStats();
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return this.getMockStats();
    }
  }

  /**
   * Fetch recent orders
   */
  async getRecentOrders(limit: number = 10): Promise<RecentOrder[]> {
    try {
      const response = await getAxios("/orders/recent", { limit });
      return response?.data || this.getMockRecentOrders();
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      return this.getMockRecentOrders();
    }
  }

  /**
   * Fetch top selling items
   */
  async getTopSellingItems(limit: number = 5): Promise<TopSellingItem[]> {
    try {
      const response = await getAxios("/items/top-selling", { limit });
      return response?.data || this.getMockTopSellingItems();
    } catch (error) {
      console.error("Error fetching top selling items:", error);
      return this.getMockTopSellingItems();
    }
  }

  /**
   * Fetch hourly sales data
   */
  async getHourlySales(): Promise<HourlySales[]> {
    try {
      const response = await getAxios("/analytics/hourly-sales");
      return response?.data || this.getMockHourlySales();
    } catch (error) {
      console.error("Error fetching hourly sales:", error);
      return this.getMockHourlySales();
    }
  }

  /**
   * Fetch all dashboard data
   */
  async getAllDashboardData(): Promise<DashboardData> {
    try {
      const [stats, recentOrders, topSellingItems, hourlySales] = await Promise.all([
        this.getDashboardStats(),
        this.getRecentOrders(),
        this.getTopSellingItems(),
        this.getHourlySales()
      ]);

      return {
        stats,
        recentOrders,
        topSellingItems,
        hourlySales
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return this.getMockDashboardData();
    }
  }

  /**
   * Mock data methods - replace with actual API calls
   */
  private getMockStats(): DashboardStats {
    return {
      totalOrders: 124,
      totalRevenue: 58320,
      averageOrderValue: 470,
      activeTables: 8,
      pendingOrders: 12,
      completedOrders: 112,
      topSellingItem: "Margherita Pizza",
      customerSatisfaction: 4.8,
      dailyGrowth: 12.5,
      weeklyGrowth: 8.3
    };
  }

  private getMockRecentOrders(): RecentOrder[] {
    return [
      { 
        id: "ORD123", 
        customer: "John Doe", 
        items: "Margherita Pizza, Coke", 
        amount: 450, 
        status: "Completed", 
        orderTime: "2 min ago", 
        tableNumber: "T5", 
        orderType: "DINEIN" 
      },
      { 
        id: "ORD124", 
        customer: "Jane Smith", 
        items: "Pasta Alfredo, Garlic Bread", 
        amount: 320, 
        status: "Preparing", 
        orderTime: "5 min ago", 
        tableNumber: "T12", 
        orderType: "DINEIN" 
      },
      { 
        id: "ORD125", 
        customer: "Rahul Kumar", 
        items: "Veg Burger, Fries", 
        amount: 180, 
        status: "Pending", 
        orderTime: "8 min ago", 
        orderType: "TAKEAWAY" 
      },
      { 
        id: "ORD126", 
        customer: "Emily Davis", 
        items: "Chicken Biryani, Raita", 
        amount: 550, 
        status: "Completed", 
        orderTime: "12 min ago", 
        tableNumber: "T8", 
        orderType: "DINEIN" 
      },
      { 
        id: "ORD127", 
        customer: "Mike Johnson", 
        items: "Caesar Salad, Soup", 
        amount: 280, 
        status: "Completed", 
        orderTime: "15 min ago", 
        orderType: "DELIVERY" 
      },
    ];
  }

  private getMockTopSellingItems(): TopSellingItem[] {
    return [
      { name: "Margherita Pizza", quantity: 45, revenue: 20250, growth: 15.2 },
      { name: "Chicken Biryani", quantity: 32, revenue: 17600, growth: 8.7 },
      { name: "Pasta Alfredo", quantity: 28, revenue: 8960, growth: -2.1 },
      { name: "Veg Burger", quantity: 25, revenue: 4500, growth: 12.3 },
      { name: "Caesar Salad", quantity: 20, revenue: 5600, growth: 5.8 }
    ];
  }

  private getMockHourlySales(): HourlySales[] {
    return [
      { hour: "10:00", orders: 8, revenue: 3200 },
      { hour: "11:00", orders: 12, revenue: 4800 },
      { hour: "12:00", orders: 18, revenue: 7200 },
      { hour: "13:00", orders: 22, revenue: 8800 },
      { hour: "14:00", orders: 15, revenue: 6000 },
      { hour: "15:00", orders: 10, revenue: 4000 },
      { hour: "16:00", orders: 6, revenue: 2400 },
      { hour: "17:00", orders: 8, revenue: 3200 },
      { hour: "18:00", orders: 14, revenue: 5600 },
      { hour: "19:00", orders: 20, revenue: 8000 },
      { hour: "20:00", orders: 16, revenue: 6400 },
      { hour: "21:00", orders: 12, revenue: 4800 }
    ];
  }

  private getMockDashboardData(): DashboardData {
    return {
      stats: this.getMockStats(),
      recentOrders: this.getMockRecentOrders(),
      topSellingItems: this.getMockTopSellingItems(),
      hourlySales: this.getMockHourlySales()
    };
  }
}

export default new DashboardService();
