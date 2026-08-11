
import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Bike,
  Route,
  MapPinned,
  Package,
  Users,
  IdCard,
  Wrench,
  Award,
  ClipboardCheck,
  Layers,
  CreditCard,
  History,
  Image,
  Banknote,
  Briefcase,
  Headset,
  ShieldCheck,
  ChevronRight,
  X,
} from "lucide-react";

// Sidebar width
const WIDTH = "w-72"; // ~288px similar to screenshot

function Item({ to, icon: Icon, label, onClick, nested }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          nested ? "ml-1" : ""
        } ${
          isActive
            ? "bg-orange-50 text-orange-600"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <Icon
              className={`h-[18px] w-[18px] shrink-0 ${
                isActive
                  ? "text-orange-600"
                  : "text-gray-400 group-hover:text-gray-600"
              }`}
              strokeWidth={2}
            />
          )}
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function Group({ label, icon: Icon, children, isOpen, onToggle }) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 ${
          isOpen ? "bg-gray-50 text-gray-900" : ""
        }`}
      >
        <span className="flex items-center gap-3">
          {Icon && (
            <Icon
              className="h-[18px] w-[18px] shrink-0 text-gray-400"
              strokeWidth={2}
            />
          )}
          {label}
        </span>
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="mt-1 ml-4 space-y-0.5 border-l border-gray-200 pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const [openGroups, setOpenGroups] = useState({});
  const role = localStorage.getItem("role");

  const toggle = (key) => setOpenGroups((s) => ({ ...s, [key]: !s[key] }));

  const sections = useMemo(
    () => [
      {
        key: "main",
        items: [
          { label: "Dashboard", to: "/dashboard/home", icon: LayoutDashboard },
        ],
      },
      {
        key: "booking",
        groups: [
          {
            key: "cab-bookings",
            label: "Cab Bookings",
            icon: Car,
            children: [
              { label: "Car Booking", to: "/dashboard/cab-booking", icon: Car },
              {
                label: "Auto Booking",
                to: "/dashboard/auto-booking",
                icon: Bike,
              },
            ],
          },
        ],
      },
      {
        key: "intercity",
        groups: [
          {
            key: "intercity-bookings",
            label: "Intercity",
            icon: Route,
            children: [
              {
                label: "Intercity Booking",
                to: "/dashboard/intercity-booking",
                icon: Route,
              },
              {
                label: "Reserved Booking",
                to: "/dashboard/reserved-booking",
                icon: MapPinned,
              },
            ],
          },
        ],
      },
      {
        key: "rental",
        items: [
          {
            label: "Rental Package",
            to: "/dashboard/rental-package",
            icon: Package,
          },
        ],
      },
      {
        key: "customers",
        items: [
          { label: "Customers", to: "/dashboard/customers", icon: Users },
        ],
      },
      {
        key: "driver",
        groups: [
          {
            key: "driver-mgmt",
            label: "Driver",
            icon: IdCard,
            children: [
              { label: "Drivers", to: "/dashboard/driver", icon: IdCard },
              {
                label: "Driver Vehicles",
                to: "/dashboard/driver-vehicles",
                icon: Car,
              },
              {
                label: "Driver Subscription",
                to: "/dashboard/driver-subscription",
                icon: Award,
              },
            ],
          },
        ],
      },
      {
        key: "onboarding",
        items: [
          {
            label: "On Boarding",
            to: "/dashboard/onboarding",
            icon: ClipboardCheck,
          },
        ],
      },
      {
        key: "vehicle",
        groups: [
          {
            key: "vehicle-details",
            label: "Vehicle Details",
            icon: Wrench,
            children: [
              { label: "Brand", to: "/dashboard/vehicle-brand", icon: Layers },
              { label: "Model", to: "/dashboard/vehicle-model", icon: Layers },
              { label: "Type", to: "/dashboard/vehicle-type", icon: Layers },
              { label: "Vehicle", to: "/dashboard/vehicles", icon: Car },
            ],
          },
        ],
      },
      {
        key: "subscription",
        groups: [
          {
            key: "subs",
            label: "Subscriptions",
            icon: CreditCard,
            children: [
              {
                label: "Cab Ride Plan",
                to: "/dashboard/ride-plan/cab",
                icon: Car,
              },
              {
                label: "Auto Ride Plan",
                to: "/dashboard/ride-plan/auto",
                icon: Bike,
              },
            ],
          },
        ],
      },
      {
        key: "purchase-history",
        groups: [
          {
            key: "driver-sbs-purchase-history",
            label: "Purchase History",
            icon: History,
            children: [
              {
                label: "Driver Subscription Purchases",
                to: "/dashboard/driver-subscription-purchases",
                icon: History,
              },
            ],
          },
        ],
      },
      {
        key: "service",
        items: [{ label: "Banner", to: "/dashboard/banner", icon: Image }],
      },
      {
        key: "fare",
        items: [
          {
            label: "Vehicle Fare",
            to: "/dashboard/vehicle-fare",
            icon: Banknote,
          },
        ],
      },
      {
        key: "sales-agents",
        items: [
          {
            label: "Sales Agents",
            to: "/dashboard/sales-agents",
            icon: Briefcase,
          },
        ],
      },
      {
        key: "support-agents",
        items: [
          {
            label: "Customer Support Agents",
            to: "/dashboard/agents",
            icon: Headset,
          },
        ],
      },
      {
        key: "admin-management",
        groups: [
          {
            key: "admin-customer-driver-management",
            label: "Admin Management",
            icon: ShieldCheck,
            children: [
              {
                label: "Customer Management",
                to: "/dashboard/customer-agent-management",
                icon: Users,
              },
              {
                label: "Driver Management",
                to: "/dashboard/driver-agent-management",
                icon: IdCard,
              },
              {
                label: "Driver + Customer Management",
                to: "/dashboard/driver-pls-customer-management",
                icon: ShieldCheck,
              },
            ],
          },
        ],
      },
    ],
    [],
  );

  // Filter sidebar sections based on logged-in admin's role.
  // NOTE: filtering now keys off section.key (stable) instead of the old
  // section.title strings, since titles have been removed from the UI.
  const visibleSections = useMemo(() => {
    if (!role || role === "super_admin") {
      return sections;
    }
    if (role === "driver_manager") {
      return sections.filter((sec) => sec.key === "driver");
    }
    if (role === "customer_manager") {
      return sections.filter((sec) => sec.key === "customers");
    }
    if (role === "drv_pls_cust") {
      return sections.filter(
        (sec) => sec.key === "driver" || sec.key === "customers",
      );
    }
    return sections;
  }, [sections, role]);

  const Content = (
    <div
      className={`h-full ${WIDTH} flex flex-col border-r border-gray-200 bg-white`}
    >
      {/* Brand / header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
            <Car className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold text-gray-900">Admin Panel</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {visibleSections.map((sec) => (
          <div key={sec.key} className="space-y-1">
            {sec.items?.map((item) => (
              <Item
                key={item.label}
                to={item.to}
                icon={item.icon}
                label={item.label}
                onClick={onClose}
              />
            ))}
            {sec.groups?.map((g) => (
              <Group
                key={g.key}
                label={g.label}
                icon={g.icon}
                isOpen={!!openGroups[g.key]}
                onToggle={() => toggle(g.key)}
              >
                {g.children.map((c) => (
                  <Item
                    key={c.label}
                    to={c.to}
                    icon={c.icon}
                    label={c.label}
                    onClick={onClose}
                    nested
                  />
                ))}
              </Group>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <div className={`hidden lg:block ${WIDTH} shrink-0`}>{Content}</div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          isOpen ? "" : "pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />
        {/* Drawer panel */}
        <div
          className={`absolute inset-y-0 left-0 transform transition-transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {Content}
        </div>
      </div>
    </>
  );
}
