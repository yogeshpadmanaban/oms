// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/admin/dashboard',
    activePath: ['/admin/dashboard'],
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Customer Report',
    path: '/admin/customer_report',
    activePath: ['/admin/customer_report', '/admin/add_customer', 'edit_customer'],
    icon: getIcon('ant-design:unordered-list-outlined'),
  },
  {
    title: 'Category Report',
    path: '/admin/category_report',
    activePath: ['/admin/category_report'],
    icon: getIcon('ant-design:unordered-list-outlined'),
  },
  {
    title: 'ProductType Report',
    path: '/admin/product_type_report',
    activePath: ['/admin/product_type_report'],
    icon: getIcon('ant-design:unordered-list-outlined'),
  },
  {
    title: 'Product Report',
    path: '/admin/product_report',
    activePath: ['/admin/product_report', '/admin/add_product', 'edit_product'],
    icon: getIcon('ant-design:unordered-list-outlined'),
  },
  {
    title: 'Order Report',
    path: '/admin/order_report',
    activePath: ['/admin/order_report', '/admin/add_order', 'edit_order'],
    icon: getIcon('ant-design:unordered-list-outlined'),
  },
];

export default navConfig;
