import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

// Auth pages
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';

// Main pages
import DashboardApp from './pages/DashboardApp';


import CustomerReport from './pages/Customer/CustomerReport';
import CustomerForm from './pages/Customer/CustomerForm';

import CategoryReport from './pages/Category/CategoryReport';
import ProducttypeReport from './pages/ProductType/ProductTypeReport';


import ProductReport from './pages/Product/ProductReport';
import ProductForm from './pages/Product/productForm';


import OrderReport from './pages/Order/OrderReport';
import OrderForm from './pages/Order/OrderForm';


// ----------------------------------------------------------------------

export default function Router() {
  let isLoggedIn = localStorage.getItem("token");

  return useRoutes([
    {
      path: '/admin',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/" />,
      children: [

        { path: '/admin', element: <Navigate to="/admin/dashboard" /> },
        { path: 'dashboard', element: <DashboardApp /> },

        { path: 'customer_report', element: <CustomerReport /> },
        { path: 'add_customer', element: <CustomerForm /> },
        { path: 'edit_customer/:id', element: <CustomerForm /> },

        { path: 'category_report', element: <CategoryReport /> },

        { path: 'creditors_report', element: <ProducttypeReport /> },


        { path: 'product_report', element: <ProductReport /> },
        { path: 'add_product', element: <ProductForm /> },
        { path: 'edit_product/:id', element: <ProductForm /> },


        { path: 'order_report', element: <OrderReport /> },
        { path: 'add_order', element: <OrderForm /> },
        { path: 'edit_order/:id', element: <OrderForm /> },

      ],
    },
    {
      path: '/',
      element: !isLoggedIn ? <LogoOnlyLayout /> : <Navigate to="/admin" />,
      children: [
        { path: '/', element: <Navigate to="/admin/login" /> },
        { path: '/admin/login', element: <Login /> },
        { path: '/admin/register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
