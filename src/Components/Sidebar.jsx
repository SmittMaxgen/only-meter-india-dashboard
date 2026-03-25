// import { useState, useMemo } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   Squares2X2Icon,
//   UserIcon,
//   MapPinIcon,
//   ClipboardDocumentListIcon,
//   TicketIcon,
//   BanknotesIcon,
//   ChevronRightIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";

// // Sidebar width
// const WIDTH = "w-72"; // ~288px similar to screenshot

// function SectionTitle({ children }) {
//   return (
//     <div className="px-3 pt-6 pb-2 text-xs font-semibold tracking-wide text-gray-400">
//       {children}
//     </div>
//   );
// }

// function Item({ to, icon: Icon, label, onClick }) {
//   return (
//     <NavLink
//       to={to}
//       onClick={onClick}
//       className={({ isActive }) =>
//         `flex items-center font-bold gap-3 px-3 py-2 text-md transition-colors border-l-2 ${
//           isActive
//             ? "text-orange-600 border-orange-500 border-r-4"
//             : "text-gray-700 hover:bg-gray-100 border-transparent"
//         }`
//       }
//     >
//       {Icon && <Icon className={`h-5 w-5 text-black`} />}
//       <span>{label}</span>
//     </NavLink>
//   );
// }

// function Group({ label, icon: Icon, children, isOpen, onToggle }) {
//   return (
//     <div className="px-1">
//       <button
//         type="button"
//         onClick={onToggle}
//         className={`w-full flex items-center font-bold justify-between px-2 py-2 rounded-md text-md hover:bg-gray-100 cursor-pointer`}
//       >
//         <span className="flex items-center gap-3 text-gray-800">
//           {Icon && <Icon className="h-5 w-5 text-black" />}
//           {label}
//         </span>
//         <ChevronRightIcon
//           className={`h-4 w-4 text-gray-500 transition-transform ${
//             isOpen ? "rotate-90" : ""
//           }`}
//         />
//       </button>
//       {isOpen && <div className="mt-1 ml-9 space-y-1">{children}</div>}
//     </div>
//   );
// }

// export default function Sidebar({ isOpen, onClose }) {
//   const [openGroups, setOpenGroups] = useState({});

//   const toggle = (key) =>
//     setOpenGroups((s) => ({ ...s, [key]: !s[key] }));

//   // Data model for sections to closely mirror screenshot
//   const sections = useMemo(
//     () => [
//       {
//         title: "MAIN",
//         items: [
//           { label: "Dashboard", to: "/dashboard/home", icon: Squares2X2Icon },
//         ],
//       },
//       {
//         title: "BOOKING MANAGEMENT",
//         items: [
//           { label: "Cab Bookings", to: "/dashboard/cab-booking", icon: ClipboardDocumentListIcon },
//           { label: "Share Vehicles", to: "/dashboard/share-vehicles", icon: ClipboardDocumentListIcon },
//         ],
//       },
//       {
//         title: "INTERCITY SERVICE",
//         // items: [
//         //   { label: "Intercity Service", to: "/dashboard/work", icon: ClipboardDocumentListIcon },
//         // ],
//         groups: [
//           {
//             key: "intercity",
//             label: "Bookings",
//             icon: ClipboardDocumentListIcon,
//             children: [
//               { label: "Intercity Booking", to: "/dashboard/intercity-booking", icon: ClipboardDocumentListIcon },
//               { label: "Reserved Booking", to: "/dashboard/reserved-booking", icon: ClipboardDocumentListIcon },
//             ],
//           },
//         ],
//       },
//       {
//         title: "RENTAL SERVICE",
//         items: [
//           // { label: "Rental Rides", to: "/dashboard/rental-rides", icon: ClipboardDocumentListIcon },
//           { label: "Rental Package", to: "/dashboard/rental-package", icon: ClipboardDocumentListIcon },
//         ],
//       },
//       {
//         title: "CUSTOMER MANAGEMENT",
//         items: [
//           { label: "Customers", to: "/dashboard/customers", icon: UserIcon },
//         ],
//       },
//       {
//         title: "DRIVER MANAGEMENT",
//         groups: [
//           {
//             key: "driver",
//             label: "Driver",
//             icon: UserIcon,
//             children: [
//               { label: "Drivers", to: "/dashboard/driver", icon: ClipboardDocumentListIcon },
//               { label: "Driver Vehicles", to: "/dashboard/driver-vehicles", icon: ClipboardDocumentListIcon },
//               { label: "Driver Subscription", to: "/dashboard/driver-subscription", icon: ClipboardDocumentListIcon },
//             ],
//           },
//         ],
//       },
//       {
//         title: "ONBOARDING MANAGEMENT",
//         items: [
//           { label: "On Boarding", to: "/dashboard/onboarding", icon: ClipboardDocumentListIcon },
//         ],
//       },
//       {
//         title: "VEHICLE MANAGEMENT",
//         groups: [
//           {
//             key: "vehicle",
//             label: "Vehicle Details",
//             icon: ClipboardDocumentListIcon,
//             children: [
//               { label: "Brand", to: "/dashboard/vehicle-brand", icon: ClipboardDocumentListIcon },
//               { label: "Model", to: "/dashboard/vehicle-model", icon: ClipboardDocumentListIcon },
//               { label: "Type", to: "/dashboard/vehicle-type", icon: ClipboardDocumentListIcon },
//               { label: "Vehicle", to: "/dashboard/vehicles", icon: ClipboardDocumentListIcon },
//             ],
//           },
//         ],
//       },
//       {
//         title: "SUBSCRIPTION MANAGEMENT",
//         groups: [
//           {
//             key: "subs",
//             label: "Subscriptions",
//             icon: ClipboardDocumentListIcon,
//             children: [
//               { label: "Subscription Plans", to: "/dashboard/subscription-plan", icon: ClipboardDocumentListIcon },
//             ],
//           },
//         ],
//       },
//       // {
//       //   title: "SUPPORT",
//       //   items: [
//       //     { label: "Support Ticket", to: "/dashboard/support-ticket", icon: TicketIcon },
//       //     { label: "Payout Request", to: "/dashboard/work", icon: BanknotesIcon },
//       //   ],
//       // },
//       {
//         title: "SERVICE MANAGEMENT",
//         items: [
//           { label: "Banner", to: "/dashboard/banner", icon: TicketIcon },
//         ],
//       },
//     ],
//     []
//   );

//   // Sidebar content block
//   const Content = (
//     <div className={`h-full ${WIDTH} bg-white border-r border-gray-200 flex flex-col`}>
//       {/* Close button on mobile */}
//       <div className="lg:hidden flex justify-end p-3">
//         <button
//           onClick={onClose}
//           aria-label="Close sidebar"
//           className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
//         >
//           <XMarkIcon className="h-5 w-5" />
//         </button>
//       </div>

//       <nav className="flex-1 overflow-y-auto pb-6">
//         {sections.map((sec) => (
//           <div key={sec.title}>
//             <SectionTitle>{sec.title}</SectionTitle>
//             <div className="space-y-1">
//               {sec.items?.map((item) => (
//                 <Item key={item.label} to={item.to} icon={item.icon} label={item.label} onClick={onClose} />
//               ))}
//               {sec.groups?.map((g) => (
//                 <Group
//                   key={g.key}
//                   label={g.label}
//                   icon={g.icon}
//                   isOpen={!!openGroups[g.key]}
//                   onToggle={() => toggle(g.key)}
//                 >
//                   {g.children.map((c) => (
//                     <Item key={c.label} to={c.to} icon={c.icon} label={c.label} onClick={onClose} />
//                   ))}
//                 </Group>
//               ))}
//             </div>
//           </div>
//         ))}
//       </nav>
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop static sidebar */}
//       <div className={`hidden lg:block ${WIDTH} shrink-0`}>{Content}</div>

//       {/* Mobile drawer */}
//       <div
//         className={`lg:hidden fixed inset-0 z-40 ${isOpen ? "" : "pointer-events-none"}`}
//         aria-hidden={!isOpen}
//       >
//         {/* Overlay */}
//         <div
//           className={`absolute inset-0 bg-black/30 transition-opacity ${
//             isOpen ? "opacity-100" : "opacity-0"
//           }`}
//           onClick={onClose}
//         />
//         {/* Drawer panel */}
//         <div
//           className={`absolute inset-y-0 left-0 transform transition-transform ${
//             isOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//         >
//           {Content}
//         </div>
//       </div>
//     </>
//   );
// }
import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  Squares2X2Icon,
  UserIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  TicketIcon,
  BanknotesIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Sidebar width
const WIDTH = "w-72"; // ~288px similar to screenshot

function SectionTitle({ children }) {
  return (
    <div className="px-3 pt-6 pb-2 text-xs font-semibold tracking-wide text-gray-400">
      {children}
    </div>
  );
}

function Item({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center font-bold gap-3 px-3 py-2 text-md transition-colors border-l-2 ${
          isActive
            ? "text-orange-600 border-orange-500 border-r-4"
            : "text-gray-700 hover:bg-gray-100 border-transparent"
        }`
      }
    >
      {Icon && <Icon className={`h-5 w-5 text-black`} />}
      <span>{label}</span>
    </NavLink>
  );
}

function Group({ label, icon: Icon, children, isOpen, onToggle }) {
  return (
    <div className="px-1">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center font-bold justify-between px-2 py-2 rounded-md text-md hover:bg-gray-100 cursor-pointer`}
      >
        <span className="flex items-center gap-3 text-gray-800">
          {Icon && <Icon className="h-5 w-5 text-black" />}
          {label}
        </span>
        <ChevronRightIcon
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      {isOpen && <div className="mt-1 ml-9 space-y-1">{children}</div>}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const [openGroups, setOpenGroups] = useState({});

  const toggle = (key) => setOpenGroups((s) => ({ ...s, [key]: !s[key] }));

  const sections = useMemo(
    () => [
      {
        title: "MAIN",
        items: [
          { label: "Dashboard", to: "/dashboard/home", icon: Squares2X2Icon },
        ],
      },
      {
        title: "BOOKING MANAGEMENT",
        groups: [
          {
            // "Cab Bookings" is now a collapsible group with two sub-pages:
            // - Cab Booking  → vehicle_type !== "Auto"
            // - Auto Booking → vehicle_type === "Auto"
            key: "cab-bookings",
            label: "Cab Bookings",
            icon: ClipboardDocumentListIcon,
            children: [
              {
                label: "Cab Booking",
                to: "/dashboard/cab-booking",
                icon: ClipboardDocumentListIcon,
              },
              {
                label: "Auto Booking",
                to: "/dashboard/auto-booking",
                icon: ClipboardDocumentListIcon,
              },
            ],
          },
          {
            key: "share-vehicles",
            label: "Share Vehicles",
            icon: ClipboardDocumentListIcon,
            children: [
              {
                label: "Share Vehicles",
                to: "/dashboard/share-vehicles",
                icon: ClipboardDocumentListIcon,
              },
            ],
          },
        ],
      },
      {
        title: "INTERCITY SERVICE",
        groups: [
          {
            key: "intercity",
            label: "Bookings",
            icon: ClipboardDocumentListIcon,
            children: [
              {
                label: "Intercity Booking",
                to: "/dashboard/intercity-booking",
                icon: ClipboardDocumentListIcon,
              },
              {
                label: "Reserved Booking",
                to: "/dashboard/reserved-booking",
                icon: ClipboardDocumentListIcon,
              },
            ],
          },
        ],
      },
      {
        title: "RENTAL SERVICE",
        items: [
          {
            label: "Rental Package",
            to: "/dashboard/rental-package",
            icon: ClipboardDocumentListIcon,
          },
        ],
      },
      {
        title: "CUSTOMER MANAGEMENT",
        items: [
          { label: "Customers", to: "/dashboard/customers", icon: UserIcon },
        ],
      },
      {
        title: "DRIVER MANAGEMENT",
        groups: [
          {
            key: "driver",
            label: "Driver",
            icon: UserIcon,
            children: [
              {
                label: "Drivers",
                to: "/dashboard/driver",
                icon: ClipboardDocumentListIcon,
              },
              {
                label: "Driver Vehicles",
                to: "/dashboard/driver-vehicles",
                icon: ClipboardDocumentListIcon,
              },
              {
                label: "Driver Subscription",
                to: "/dashboard/driver-subscription",
                icon: ClipboardDocumentListIcon,
              },
            ],
          },
        ],
      },
      {
        title: "ONBOARDING MANAGEMENT",
        items: [
          {
            label: "On Boarding",
            to: "/dashboard/onboarding",
            icon: ClipboardDocumentListIcon,
          },
        ],
      },
      {
        title: "VEHICLE MANAGEMENT",
        groups: [
          {
            key: "vehicle",
            label: "Vehicle Details",
            icon: ClipboardDocumentListIcon,
            children: [
              {
                label: "Brand",
                to: "/dashboard/vehicle-brand",
                icon: ClipboardDocumentListIcon,
              },
              {
                label: "Model",
                to: "/dashboard/vehicle-model",
                icon: ClipboardDocumentListIcon,
              },
              {
                label: "Type",
                to: "/dashboard/vehicle-type",
                icon: ClipboardDocumentListIcon,
              },
              {
                label: "Vehicle",
                to: "/dashboard/vehicles",
                icon: ClipboardDocumentListIcon,
              },
            ],
          },
        ],
      },
      {
        title: "SUBSCRIPTION MANAGEMENT",
        groups: [
          {
            key: "subs",
            label: "Subscriptions",
            icon: ClipboardDocumentListIcon,
            children: [
              {
                label: "Subscription Plans",
                to: "/dashboard/subscription-plan",
                icon: ClipboardDocumentListIcon,
              },
            ],
          },
        ],
      },
      {
        title: "SERVICE MANAGEMENT",
        items: [{ label: "Banner", to: "/dashboard/banner", icon: TicketIcon }],
      },
    ],
    [],
  );

  const Content = (
    <div
      className={`h-full ${WIDTH} bg-white border-r border-gray-200 flex flex-col`}
    >
      {/* Close button on mobile */}
      <div className="lg:hidden flex justify-end p-3">
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto pb-6">
        {sections.map((sec) => (
          <div key={sec.title}>
            <SectionTitle>{sec.title}</SectionTitle>
            <div className="space-y-1">
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
                    />
                  ))}
                </Group>
              ))}
            </div>
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
        className={`lg:hidden fixed inset-0 z-40 ${isOpen ? "" : "pointer-events-none"}`}
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
