import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ShipmentDetails from './pages/ShipmentDetails';
import CreateShipment from './pages/CreateShipment';
import EditShipment from './pages/EditShipment';
import TrackShipment from './pages/TrackShipment';
import FleetManagement from './pages/FleetManagement';
import CargoTypes from './pages/CargoTypes';
import HelpSupport from './pages/HelpSupport';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="shipment/:id" element={<ShipmentDetails />} />
        <Route path="shipment/:id/edit" element={<EditShipment />} />
        <Route path="create-shipment" element={<CreateShipment />} />
        <Route path="track-shipment" element={<TrackShipment />} />
        <Route path="fleet-management" element={<FleetManagement />} />
        <Route path="cargo-types" element={<CargoTypes />} />
        <Route path="help-support" element={<HelpSupport />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;