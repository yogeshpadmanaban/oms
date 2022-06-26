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
    activePath: ['/admin/customer_report', '/admin/add_customer', '/admin/edit_customer'],
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Category Report',
    path: '/admin/category_report',
    activePath: ['/admin/category_report'],
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Product Report',
    path: '/admin/product_report',
    activePath: ['/admin/product_report'],
    icon: getIcon('eva:people-fill'),
  },
];

export default navConfig;
