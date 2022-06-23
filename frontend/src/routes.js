import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';


import CustomerReport from './pages/CustomerReport';
import CustomerForm from './pages/CustomerForm';

import CategoryReport from './pages/CategoryReport';
import ProductReport from './pages/ProductReport';


// ----------------------------------------------------------------------

export default function Router() {
  let isLoggedIn = localStorage.getItem("token");
  console.log("token", isLoggedIn);

  return useRoutes([
    {
      path: '/dashboard',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        {
          path: 'app',
          element: <DashboardApp />
        },
        { path: 'user', element: <User /> },

        // { path: 'products', element: <Products /> },
        // { path: 'blog', element: <Blog /> },

        { path: 'customer_report', element: <CustomerReport /> },
        { path: 'add_customer', element: <CustomerForm /> },
        { path: 'edit_customer/:id', element: <CustomerForm /> },

        { path: 'category_report', element: <CategoryReport /> },
        { path: 'product_report', element: <ProductReport /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
