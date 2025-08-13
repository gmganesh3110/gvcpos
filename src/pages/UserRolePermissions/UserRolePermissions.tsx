import React, { useState } from "react";
import { HiOutlineCheckCircle } from "react-icons/hi";

const sampleData = [
  {
    menuId: 1,
    menuName: "Dashboard",
    checked: false,
    submenu: [
      {
        submenuId: 101,
        submenuName: "View",
        checked: false,
        updatedActions: [
          { action: "ADD", checked: false },
          { action: "EDIT", checked: false },
          { action: "DELETE", checked: false },
        ],
      },
      {
        submenuId: 102,
        submenuName: "Settings",
        checked: false,
        updatedActions: [
          { action: "VIEW", checked: false },
          { action: "EDIT", checked: false },
        ],
      },
    ],
  },
  {
    menuId: 2,
    menuName: "User",
    checked: false,
    submenu: [
      {
        submenuId: 201,
        submenuName: "Manage Users",
        checked: false,
        updatedActions: [
          { action: "ADD", checked: false },
          { action: "EDIT", checked: false },
          { action: "DELETE", checked: false },
        ],
      },
    ],
  },
];

const PermissionTree = () => {
  const [menuData, setMenuData] = useState(sampleData);
  const [canUpdate, setCanUpdate] = useState(false);

  const handleMainCheck = (menu) => {
    const temp = menuData.map((m) => {
      if (m.menuId === menu.menuId) {
        const updatedSub = m.submenu.map((s) => ({
          ...s,
          checked: !m.checked,
        }));
        return {
          ...m,
          checked: !m.checked,
          submenu: updatedSub,
        };
      }
      return m;
    });
    setMenuData(temp);
    checkPendingUpdate(temp);
  };

  const handleSubCheck = (menu, submenu) => {
    const temp = menuData.map((m) => {
      if (m.menuId === menu.menuId) {
        const updatedSub = m.submenu.map((s) =>
          s.submenuId === submenu.submenuId ? { ...s, checked: !s.checked } : s
        );
        return {
          ...m,
          submenu: updatedSub,
          checked: updatedSub.some((s) => s.checked),
        };
      }
      return m;
    });
    setMenuData(temp);
    checkPendingUpdate(temp);
  };

  const handleActionCheck = (menu, submenu, actionItem) => {
    const temp = menuData.map((m) => {
      if (m.menuId === menu.menuId) {
        const updatedSub = m.submenu.map((s) => {
          if (s.submenuId === submenu.submenuId) {
            const act = s.updatedActions.map((a) =>
              a.action === actionItem.action
                ? { ...a, checked: !a.checked }
                : a
            );
            return { ...s, updatedActions: act };
          }
          return s;
        });
        return { ...m, submenu: updatedSub };
      }
      return m;
    });
    setMenuData(temp);
    checkPendingUpdate(temp);
  };

  const checkPendingUpdate = (data) => {
    const checkedAny = data.some((m) =>
      m.submenu.some((s) => s.checked)
    );
    setCanUpdate(checkedAny);
  };

  const renderSubmenu = (menu, submenuList) => {
    return submenuList.map((sub) => (
      <div key={sub.submenuId} className="ml-5 mt-2">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={sub.checked}
            onChange={() => handleSubCheck(menu, sub)}
            className="w-4 h-4 text-orange-500 border-gray-300 rounded"
          />
          <span>{sub.submenuName}</span>
        </label>
        {/* actions */}
        <div className="ml-8 mt-1 space-y-1">
          {sub.updatedActions.map((action) => (
            <label
              key={action.action}
              className="inline-flex items-center gap-2 mr-4"
            >
              <input
                type="checkbox"
                checked={action.checked}
                onChange={() => handleActionCheck(menu, sub, action)}
                className="w-4 h-4 text-indigo-500 border-gray-300 rounded"
                disabled={!menu.checked || !sub.checked}
              />
              <span className="text-xs text-gray-600">{action.action}</span>
            </label>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Permission Tree Sample</h3>

      {/* Render Menus */}
      {menuData.map((menu) => (
        <div key={menu.menuId} className="my-3">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={menu.checked}
              onChange={() => handleMainCheck(menu)}
              className="w-5 h-5 text-orange-500 border-gray-300 rounded"
            />
            <span className="font-semibold">{menu.menuName}</span>
          </label>
          {renderSubmenu(menu, menu.submenu)}
        </div>
      ))}

      <div className="mt-6 text-center">
        <button
          disabled={!canUpdate}
          className={`px-6 py-2 rounded-md text-white ${
            canUpdate
              ? "bg-orange-500 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default PermissionTree;
