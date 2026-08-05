import { useNavigate, useParams, useLocation } from "react-router-dom";
import DriverTransactionsModal from "../Components/DriverTransactionsModal.jsx";

export default function DriverTransactionHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Prefer the name passed via navigate state (from the Drivers list click)
  // so we don't need an extra API call just for the header label.
  const driverLabel = location.state?.driverLabel || "";

  return (
    <DriverTransactionsModal
      onClose={() => navigate("/dashboard/driver")}
      driverId={id}
      driverLabel={driverLabel}
    />
  );
}
