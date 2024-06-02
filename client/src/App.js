import { AuthProvider } from "./AuthContext";
import { Provider } from "./Context.js";
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Register from "./pages/Register"
import Login from "./pages/Login"
import RecoverPassword from "./pages/ForgotPass.jsx"
// import Home from "./pages/Home"
import ReservationsList from "./pages/ReservationsList.jsx"
import ChangePassword from "./pages/ChangePass.jsx"
import Search from "./pages/Search.jsx"
import Rooms from "./pages/Rooms";
import Details from "./pages/Details"
import MyAccount from "./pages/MyAccount.jsx"
// import Reservation from "./pages/Reservation.jsx";
// import Payment from "./pages/Payment.jsx";
import Amenities from "./pages/Amenities.jsx";
// import ReservationsAdmin from "./pages/ReservationsAdmin.jsx";

import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Login />
      },
      {
        path: "/pass_recover",
        element: <RecoverPassword />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/amenities",
        element: <Amenities />
      },
      {
        path: "/rooms",
        element: <Rooms />
      },
      {
        path: "/reservations_list",
        element: <ReservationsList />
      },
      {
        path: "/pass_change",
        element: <ChangePassword />
      },
      {
        path: "/details",
        element: <Details />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/my_account",
        element: <MyAccount />,
      },

    ],
    //   {
    //     path: "/rooms",
    //     element: <Rooms />,
    //   },
    //   {
    //     path: "/reservation",
    //     element: <Reservation />,
    //   },
    //   {
    //     path: "/pay",
    //     element: <Payment />,
    //   },
    //   {
    //     path: "/reservations_admin",
    //     element: <ReservationsAdmin />
    //   }
    // ]
  },
]);

function App() {
  return (
    <AuthProvider>
      <Provider>
        <div className="app">
          <div className="container">
            <div>
              <RouterProvider router={router} />
            </div>
          </div>
        </div>
      </Provider>
    </AuthProvider>
  );
}

export default App;
