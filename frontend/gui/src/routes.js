import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import BuildingDetails from "./components/BuildingDetails";
import AddBooking from "./components/AddBooking";
import Login from "./components/Login";
import Home from "./components/Home";
import Floor from "./components/Floor";
import FloorDetails from "./components/FloorDetails";
import Block from "./components/Block";
import BlockDetails from "./components/BlockDetails";
import Room from "./components/Room";
import RoomDetails from "./components/RoomDetails";
import Booking from "./components/Booking";
import TenantDetail from "./components/TenantDetail";
import Tenant from "./components/Tenant";
import Bill from "./components/Bill";
import BillDetails from "./components/BillDetails";
import MainLayout from "./components/MainLayout";
import User from "./components/User";

// let isLoggedIn = !!localStorage.getItem("user_object");

const BaseRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/login/" component={Login} />
      <MainLayout>
        <Route
          exact
          path="/buildings/:buildingID/"
          component={BuildingDetails}
        />
        <Route exact path="/add-booking/" component={AddBooking} />
        <Route exact path="/home/" component={Home} />
        <Route exact path="/floors/" component={Floor} />
        <Route exact path="/floor-details/:floorID/" component={FloorDetails} />
        <Route exact path="/blocks/" component={Block} />
        <Route exact path="/block-details/:blockID/" component={BlockDetails} />
        <Route exact path="/rooms/" component={Room} />
        <Route exact path="/room-details/:roomID/" component={RoomDetails} />
        <Route exact path="/booking/" component={Booking} />
        <Route exact path="/tenants/" component={Tenant} />
        <Route exact path="/users/" component={User} />
        <Route
          exact
          path="/tenant-details/:tenantID/"
          component={TenantDetail}
        />
        <Route exact path="/bills/" component={Bill} />
        <Route exact path="/bill-details/:billID/" component={BillDetails} />
      </MainLayout>
    </Switch>
  </BrowserRouter>
);

export default BaseRouter;
