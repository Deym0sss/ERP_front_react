import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import HomePage from "./pages/HomePage/HomePage";
import CreateLocation from "./pages/CreateLocation/CreateLocation";
import LocationInfo from "./pages/LocationInfo/LocationInfo";
import InventoryPage from "./pages/InventoryPage/InventoryPage";
import StaffPage from "./pages/StaffPage/StaffPage";
import CreateAsset from "./pages/CreateAsset/CreateAsset";
import AssetInfo from "./pages/Assetinfo/AssetInfo";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import CreateOrder from "./pages/CreateOrder/CreateOrder";
import OrderInfo from "./pages/OrderInfo/OrderInfo";
import styles from "./App.module.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/location/create" element={<CreateLocation />} />
        <Route path="/location/:locationId" element={<LocationInfo />} />
        <Route
          path="/location/create/inventory/:locationId"
          element={<InventoryPage />}
        />
        <Route path="/staff/:locationId" element={<StaffPage />} />
        <Route path="/asset/create/:locationId" element={<CreateAsset />} />
        <Route path="/asset/:assetId" element={<AssetInfo />} />
        <Route path="/orders/:locationId" element={<OrdersPage />} />
        <Route path="/orders/create/:locationId" element={<CreateOrder />} />
        <Route path="/order/:orderId" element={<OrderInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
