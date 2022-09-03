// @mui
// import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';

import React, { useEffect, useState } from "react";

// components
import Page from '../components/Page';
// sections
import { AppWidgetSummary } from '../sections/@dashboard/app';

// apiservice
import { getData } from '../Services/apiservice';

import { Loader } from "react-full-page-loader-overlay";
import './../pages/common.css';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  // const theme = useTheme();

  const [count, setCount] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      let response = await getData('dashboard');
      if (response) {
        setCount(response.data);
        setLoading(false);
      }
    }
    initData();
  }, []);


  return (
    <Page title="Dashboard">
        <Loader show={loading} centerBorder={'#2065d1'}/>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Customer Report" path="/admin/customer_report" total={count && count.tot_customers && count.tot_customers} icon={'carbon:user-activity'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Order Report" path="/admin/order_report" total={count && count.tot_orders && count.tot_orders} color="error" icon={'ant-design:user-switch-outlined'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Product Report" path="/admin/product_report" total={count && count.tot_products && count.tot_products} color="warning" icon={'arcticons:user-manual'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Category Report" path="/admin/category_report" total={count && count.tot_category && count.tot_category} color="info" icon={'bx:category-alt'} />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
