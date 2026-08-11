import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../Pages/login.jsx";
import { PrivateRoute } from "../Central_Store/app_context.jsx";
import DashboardLayout from "../Components/DashboardLayout.jsx";
import Home from "../Pages/Home.jsx";
import CabBooking from "../Pages/CabBooking.jsx";
import AutoBooking from "../Pages/AutoBooking.jsx";
import ShareVehicle from "../Pages/ShareVehicle.jsx";
import ShareVehicleDetail from "../Pages/ShareVehicleDetail.jsx";
import CabDetail from "../Pages/CabDetail.jsx";
import Driver from "../Pages/Driver.jsx";
import DriverDetail from "../Pages/DriverDetail.jsx";
import DriverVehicles from "../Pages/DriverVehicle.jsx";
import DriverVehicleDetail from "../Pages/DriverVehicleDetail.jsx";
import DriverSubscription from "../Pages/DriverSubscription.jsx";
import DriverSubscriptionDetail from "../Pages/DriverSubscriptionDetail.jsx";
import Referral from "../Pages/Referral.jsx";
import RentalPackage from "../Pages/RentalPackage.jsx";
import OnBoarding from "../Pages/OnBoarding.jsx";
import InterCityHistory from "../Pages/InterCityHistory.jsx";
import ReservedBooking from "../Pages/ReservedBooking.jsx";
import RentalRides from "../Pages/RentalRides.jsx";
import WorkInProgress from "../Pages/WorkInProgress.jsx";
import VehicleFare from "../Pages/VehicleFare.jsx";
import VehicleBrand from "../Pages/VehicleBrand.jsx";
import VehicleModel from "../Pages/VehicleModel.jsx";
import VehicleType from "../Pages/VehicleType.jsx";
import Vehicle from "../Pages/Vehicle.jsx";
import SupportTicket from "../Pages/SupportTicket.jsx";
import CabRidePlan from "../Pages/CabRidePlan.jsx";
import AutoRidePlan from "../Pages/AutoRidePlan.jsx";
import Customers from "../Pages/Customers.jsx";
import CustomerDetail from "../Pages/CustomerDetail.jsx";
import Banner from "../Pages/Banner.jsx";
import Offer from "../Pages/Offer.jsx";
import SalesAgents from "../Pages/SalesAgents.jsx";
import Agents from "../Pages/Agents.jsx";
import DriverAgentManagement from "../Pages/DriverAgentManagement.jsx";
import CustomerAgentManagement from "../Pages/CustomerAgentManagement.jsx";
import DriverCustomerAgentManagement from "../Pages/DriverCustomerAgentManagement.jsx";
import DriverTransactionHistoryPage from "../Pages/DriverTransactionHistoryPage.jsx";
import DriverVehicleHistoryPage from "../Pages/DriverVehicleHistoryPage.jsx";
import DriverPlanPurchase from "../Pages/Driverplanpurchase.jsx";
// Redirects non-super_admin roles away from the analytics Dashboard
// straight to the one section they're allowed to see.
const ROLE_HOME = {
  driver_manager: "/dashboard/driver",
  customer_manager: "/dashboard/customers",
  drv_pls_cust: "/dashboard/customers",
};

function RoleHome() {
  const role = localStorage.getItem("role");
  const redirectTo = ROLE_HOME[role];
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Home />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          { path: "home", element: <RoleHome /> },
          { path: "cab-booking", element: <CabBooking /> },
          { path: "auto-booking", element: <AutoBooking /> },
          { path: "cab-detail/:id", element: <CabDetail /> },
          { path: "share-vehicles", element: <ShareVehicle /> },
          { path: "share-vehicle-detail/:id", element: <ShareVehicleDetail /> },
          { path: "driver", element: <Driver /> },
          { path: "driver-detail/:id", element: <DriverDetail /> },
          { path: "driver-vehicles", element: <DriverVehicles /> },
          {
            path: "driver-vehicle-detail/:id",
            element: <DriverVehicleDetail />,
          },
          { path: "driver-subscription", element: <DriverSubscription /> },
          {
            path: "driver-subscription-detail/:id",
            element: <DriverSubscriptionDetail />,
          },
          { path: "referals", element: <Referral /> },
          { path: "customers", element: <Customers /> },
          { path: "customer-detail/:id", element: <CustomerDetail /> },
          { path: "banner", element: <Banner /> },
          { path: "offers", element: <Offer /> },
          { path: "onboarding", element: <OnBoarding /> },
          { path: "intercity-booking", element: <InterCityHistory /> },
          { path: "reserved-booking", element: <ReservedBooking /> },
          { path: "ride-plan/cab", element: <CabRidePlan /> },
          { path: "ride-plan/auto", element: <AutoRidePlan /> },
          {
            path: "driver-subscription-purchases",
            element: <DriverPlanPurchase />,
          },
          { path: "vehicle-brand", element: <VehicleBrand /> },
          { path: "vehicle-model", element: <VehicleModel /> },
          { path: "vehicle-type", element: <VehicleType /> },
          { path: "vehicles", element: <Vehicle /> },
          { path: "rental-rides", element: <RentalRides /> },
          { path: "rental-package", element: <RentalPackage /> },
          { path: "support-ticket", element: <SupportTicket /> },
          { path: "work", element: <WorkInProgress /> },
          { path: "vehicle-fare", element: <VehicleFare /> },
          { path: "sales-agents", element: <SalesAgents /> },
          { path: "agents", element: <Agents /> },
          {
            path: "driver-agent-management",
            element: <DriverAgentManagement />,
          },
          {
            path: "customer-agent-management",
            element: <CustomerAgentManagement />,
          },
          {
            path: "driver-pls-customer-management",
            element: <DriverCustomerAgentManagement />,
          },
          {
            path: "driver/transaction-history/:id",
            element: <DriverTransactionHistoryPage />,
          },
          {
            path: "driver/vehicles/:id",
            element: <DriverVehicleHistoryPage />,
          },
          { path: "*", element: <WorkInProgress /> },
        ],
      },
    ],
  },
]);
