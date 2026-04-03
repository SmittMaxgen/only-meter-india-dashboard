import React, { createContext, useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Navigate, Outlet } from "react-router-dom";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [baseUrl] = useState("https://adminapi.onlymeterindia.com");
  const [fetchedData, setFetchedData] = useState({
    vehicle: null,
    drivers: null,
    users: null,
    rides: null,
    driverVehicles: null,
    driverSubscriptions: null,
    subscriptions: null,
    onboardings: null,
    rentalPackages: null,
    shareVehicles: null,
    banners: null,
    brands: null,
    models: null,
    types: null,
  });

  const getData = async (endPoint) => {
    const res = await fetch(`${baseUrl}${endPoint}`);
    console.log("res:::>>>>", res);
    const data = await res.json();
    return data.data;
  };

  const postData = async (endPoint, payload, message) => {
    try {
      const res = await fetch(`${baseUrl}${endPoint}`, {
        method: "POST",
        body: payload, // JSON.stringify() or FormData
      });

      const responseData = await res.json(); // ✅ Only read once
      console.log(responseData, "this is the res of the post req");

      if (!res.ok) {
        throw new Error(
          responseData.message ||
            responseData.errors.non_field_errors?.[0] ||
            "Failed to post data",
        );
      }

      // ✅ Success alert
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `${message} Added Successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });

      return responseData.data;
    } catch (error) {
      console.error("Post Error:", error);

      // ❌ Error alert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong while submitting!",
      });

      throw error; // Still throw so the caller can handle it too
    }
  };

  const patchData = async (endPoint, payload, message) => {
    try {
      const res = await fetch(`${baseUrl}${endPoint}`, {
        method: "PATCH",
        body: payload, // FormData or JSON.stringify() depending on usage
      });

      const responseData = await res.json(); // ✅ Read only once
      console.log(responseData);

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to update data");
      }

      // ✅ Success alert
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${message} Updated Successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });

      return responseData.data;
    } catch (error) {
      console.error("Patch Error:", error);

      // ❌ Error alert
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Something went wrong while updating!",
      });

      throw error;
    }
  };

  const deleteData = async (endpoint) => {
    try {
      // Show confirmation popup
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        // Proceed with deletion if confirmed
        const res = await fetch(`${baseUrl}${endpoint}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to delete data");
        }

        // Success message
        await Swal.fire({
          title: "Deleted!",
          text: "Your data has been deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        return res; // Return response or status as needed
      }
    } catch (error) {
      // Handle errors
      await Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#d33",
      });
      throw error; // Re-throw for further handling if needed
    }
  };

  const getServicesData = async () => {
    try {
      const results = await Promise.allSettled([
        getData("/vehicle/"),
        getData("/driver/"),
        getData("/user/"),
        getData("/ride_request/"),
        getData("/driver_vehicle/"),
        getData("/subscriptions/"),
        getData("/plans/"),
        getData("/onboarding/"),
        getData("/rental_package/"),
        getData("/vehicle_share_requests/"),
        getData("/ads_banner/"),
        getData("/brand/"),
        getData("/model/"),
        getData("/type/"),
      ]);

      const [
        vehicleData,
        driverData,
        userData,
        rideData,
        driverVehicleData,
        driverSubscriptionData,
        subscriptionData,
        onboardingData,
        rentalPackageData,
        shareVehiclesData,
        bannerData,
        brandData,
        modelData,
        typeData,
      ] = results.map((r) => (r.status === "fulfilled" ? r.value : []));

      setFetchedData({
        vehicle: vehicleData,
        drivers: driverData,
        users: userData,
        rides: rideData,
        driverVehicles: driverVehicleData,
        driverSubscriptions: driverSubscriptionData,
        subscriptions: subscriptionData,
        onboardings: onboardingData,
        rentalPackages: rentalPackageData,
        shareVehicles: shareVehiclesData,
        banners: bannerData,
        brands: brandData,
        models: modelData,
        types: typeData,
      });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  // Get location name from latitude and longitude
  const getLocationFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      return data.display_name || "Unknown location";
    } catch (error) {
      console.error("Error getting location:", error);
      return "Unknown location";
    }
  };

  useEffect(() => {
    getServicesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider
      value={{
        baseUrl,
        getData,
        postData,
        patchData,
        deleteData,
        fetchedData,
        setFetchedData,
        getLocationFromCoords,
        getServicesData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for consuming context
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);

//? make all routes private
export const PrivateRoute = () => {
  const isAuth = localStorage.getItem("isAuth");

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};
