import React, { useEffect, useState } from "react";
import { getAxios, postAxios } from "../../services/AxiosService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface MenuItem {
  menuId: number;
  menuName: string;
  menuPath: string;
  menuIcon: string;
  menuSequence: number;
  checked: boolean;
  submenu: SubmenuItem[];
}

interface SubmenuItem {
  submenuId: number;
  submenuName: string;
  submenuPath: string;
  submenuIcon: string;
  submenuSequence: number;
  checked: boolean;
}

const UserRolePermissions: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [userRoleData, setUserRoleData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRoleId, setUserRoleId] = useState<number>(0);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const User = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    getAllUserRoles();
  }, []);

  useEffect(() => {
    if (userRoleId > 0) {
      getAllMenuSubmenu();
    } else {
      setMenuData([]);
      setHasChanges(false);
    }
  }, [userRoleId]);

  const getAllMenuSubmenu = async () => {
    try {
      setIsLoading(true);
      const res: any = await getAxios("/user-role-permission/getmenusubmenu", {
        roleId: userRoleId,
        restuarent: User.restuarent,
      });

      const flatData = res.data[0] || [];

      // Group by menuId → build hierarchy
      const menuMap = new Map();

      flatData.forEach((item: any) => {
        const menuId = item.menuId;

        if (!menuMap.has(menuId)) {
          menuMap.set(menuId, {
            menuId: item.menuId,
            menuName: item.menuName,
            menuPath: item.menuPath,
            menuIcon: item.menuIcon,
            menuSequence: item.menuSequence,
            checked: false,
            submenu: new Map(),
          });
        }

        if (item.subMenuId) {
          const menu = menuMap.get(menuId);
          if (!menu.submenu.has(item.subMenuId)) {
            menu.submenu.set(item.subMenuId, {
              submenuId: item.subMenuId,
              submenuName: item.subMenuName,
              submenuPath: item.subMenuPath,
              submenuIcon: item.subMenuIcon,
              submenuSequence: item.subMenuSequence,
              checked: false,
            });
          }
        }
      });

      const transformedData: MenuItem[] = Array.from(menuMap.values()).map(
        (menu: any) => ({
          menuId: menu.menuId,
          menuName: menu.menuName,
          menuPath: menu.menuPath,
          menuIcon: menu.menuIcon,
          menuSequence: menu.menuSequence,
          checked: false,
          submenu: Array.from(menu.submenu.values()).sort(
            (a: any, b: any) => a.submenuSequence - b.submenuSequence
          ) as SubmenuItem[],
        })
      );

      transformedData.sort((a, b) => a.menuSequence - b.menuSequence);

      setMenuData(transformedData);
      setHasChanges(false);
    } catch (error) {
      console.error("Error fetching menu submenu data:", error);
      toast.error("Error fetching menu data");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllUserRoles = async () => {
    try {
      setIsLoading(true);
      const res: any = await getAxios("/user-role/getall", {
        restuarent: User.restuarent,
        start: 0,
        limit: 1000,
      });
      setUserRoleData(res.data[0]);
      setIsLoading(false);
    } catch (err: any) {
      toast.error(err?.message);
      console.log(err);
      setIsLoading(false);
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const roleId = parseInt(event.target.value);
    const selectedRole = userRoleData.find((role: any) => role.id === roleId);

    setUserRoleId(roleId);
    setSelectedRoleName(selectedRole ? selectedRole.userRole : "");
    setHasChanges(false);
  };

  const handleMenuCheck = (menuId: number) => {
    const updatedData = menuData.map((menu) => {
      if (menu.menuId === menuId) {
        const newChecked = !menu.checked;
        const updatedSubmenu = menu.submenu.map((submenu) => ({
          ...submenu,
          checked: newChecked,
        }));

        return {
          ...menu,
          checked: newChecked,
          submenu: updatedSubmenu,
        };
      }
      return menu;
    });

    setMenuData(updatedData);
    setHasChanges(true);
  };

  const handleSubmenuCheck = (menuId: number, submenuId: number) => {
    const updatedData = menuData.map((menu) => {
      if (menu.menuId === menuId) {
        const updatedSubmenu = menu.submenu.map((submenu) => {
          if (submenu.submenuId === submenuId) {
            return { ...submenu, checked: !submenu.checked };
          }
          return submenu;
        });

        const menuChecked = updatedSubmenu.some((submenu) => submenu.checked);

        return { ...menu, checked: menuChecked, submenu: updatedSubmenu };
      }
      return menu;
    });

    setMenuData(updatedData);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!userRoleId) {
      toast.error("Please select a user role first");
      return;
    }

    try {
      setSaving(true);

      const permissionsToSave: any = [];

      menuData.forEach((menu) => {
        menu.submenu.forEach((submenu) => {
          if (submenu.checked) {
            permissionsToSave.push({
              userRoleId: userRoleId,
              menuId: menu.menuId,
              subMenuId: submenu.submenuId,
              createdBy: User.id,
              updatedBy: User.id,
              activeStatus: 1,
              restuarent: User.restuarent,
            });
          }
        });
      });

      await postAxios("/user-role-permission/save", {
        permissionsToSave,
      });

      toast.success("Permissions saved successfully!");
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Error saving permissions");
    } finally {
      setSaving(false);
    }
  };

  const renderSubmenus = (menu: MenuItem) => {
    return menu.submenu.map((submenu) => (
      <div key={submenu.submenuId} className="ml-6 mt-3">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={submenu.checked}
            onChange={() => handleSubmenuCheck(menu.menuId, submenu.submenuId)}
            className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="font-medium text-gray-700">
            {submenu.submenuName}
          </span>
        </label>
      </div>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        User Role Permissions
      </h2>

      {/* User Role Selection */}
      <div className="mb-6">
        <label
          htmlFor="userRole"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select User Role
        </label>
        <select
          id="userRole"
          value={userRoleId || ""}
          onChange={handleRoleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        >
          <option value="">Select a user role...</option>
          {userRoleData.map((role: any) => (
            <option key={role.id} value={role.id}>
              {role.userRole}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {/* Permission Tree */}
      {!isLoading && userRoleId > 0 && menuData.length > 0 && (
        <>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">
              Permissions for: {selectedRoleName}
            </h3>
            <p className="text-sm text-blue-600">
              Select the permissions you want to grant to this user role
            </p>
          </div>

          <div className="space-y-4">
            {menuData.map((menu) => (
              <div
                key={menu.menuId}
                className="border border-gray-200 rounded-lg p-4"
              >
                <label className="inline-flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={menu.checked}
                    onChange={() => handleMenuCheck(menu.menuId)}
                    className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-lg font-semibold text-gray-800">
                    {menu.menuName}
                  </span>
                </label>
                {renderSubmenus(menu)}
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`px-8 py-3 rounded-md text-white font-medium ${
                hasChanges && !saving
                  ? "bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {saving ? "Saving..." : "Save Permissions"}
            </button>
            {hasChanges && (
              <p className="mt-2 text-sm text-orange-600">
                You have unsaved changes
              </p>
            )}
          </div>
        </>
      )}

      {/* No Role Selected */}
      {!isLoading && userRoleId === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🔐</div>
          <p className="text-lg">
            Please select a user role to manage permissions
          </p>
        </div>
      )}

      {/* No Data */}
      {!isLoading && userRoleId > 0 && menuData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg">
            No menu data available for the selected role
          </p>
        </div>
      )}
    </div>
  );
};

export default UserRolePermissions;
