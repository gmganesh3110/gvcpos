import React, { useState } from "react";
import { FaSearch, FaBarcode, FaPlus, FaStar, FaHeart, FaClock } from "react-icons/fa";

interface Item {
  id: number;
  name: string;
  price: number;
  image?: string;
  categoryId: number;
  isPopular?: boolean;
  isFavorite?: boolean;
}

interface ItemGridProps {
  items: Item[];
  loading: boolean;
  onItemAdd: (item: Item) => void;
  onCategorySelect: (categoryId: number) => void;
  selectedCategory: number | null;
  categories: any[];
}

const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  loading,
  onItemAdd,
  onCategorySelect,
  selectedCategory,
  categories
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "popular">("name");

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "popular":
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const popularItems = items.filter(item => item.isPopular);
  const favoriteItems = items.filter(item => item.isFavorite);

  return (
    <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col">
      {/* Header with Search and Controls */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-colors duration-200">
            <FaBarcode className="text-lg" />
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => onCategorySelect(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === "grid"
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === "list"
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="popular">Sort by Popularity</option>
          </select>
        </div>
      </div>

      {/* Items Display */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Popular Items Section */}
            {searchTerm === "" && popularItems.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  Popular Items
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {popularItems.slice(0, 4).map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onAdd={onItemAdd}
                      viewMode="grid"
                      isPopular={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Items */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaClock className="text-blue-500" />
                Menu Items ({sortedItems.length})
              </h3>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-4 gap-3">
                  {sortedItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onAdd={onItemAdd}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onAdd={onItemAdd}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface ItemCardProps {
  item: Item;
  onAdd: (item: Item) => void;
  viewMode: "grid" | "list";
  isPopular?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onAdd, viewMode, isPopular }) => {
  if (viewMode === "list") {
    return (
      <div
        onClick={() => onAdd(item)}
        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer"
      >
        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-lg">🍽️</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 text-sm mb-1">{item.name}</h4>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">₹{item.price}</span>
            {isPopular && <FaStar className="text-yellow-500 text-xs" />}
            {item.isFavorite && <FaHeart className="text-red-500 text-xs" />}
          </div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors duration-200">
          <FaPlus className="text-sm" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => onAdd(item)}
      className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="relative h-24 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-3xl">🍽️</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-700">
          ₹{item.price}
        </div>
        {isPopular && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            <FaStar className="inline mr-1" />
            Popular
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">{item.name}</h4>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">₹{item.price}</span>
          <button className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-lg transition-colors duration-200">
            <FaPlus className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemGrid;
