// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';

import React, { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';

// components
import Page from '../components/Page';
// sections
import { AppWidgetSummary } from '../sections/@dashboard/app';

// apiservice
import { postData, getData } from '../Services/apiservice';


// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();

  const [count, setCount] = useState({});

  useEffect(async () => {
    await getDashboardCount();
  }, []);

  const getDashboardCount = async () => {
    let response = await getData('dashboard');
    console.log("dashboardresponse", count);
    if (response) {
      setCount(response.data);
    }

  }

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="User Report" path="/admin/customer_report" total={count && count.user_count && count.user_count} color="error" icon={'ant-design:user-switch-outlined'} />
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Customer Report" path="/admin/customer_report" total={count && count.tot_customers && count.tot_customers} icon={'carbon:user-activity'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Category Report" path="/admin/category_report" total={count && count.tot_orders && count.tot_orders} color="info" icon={'bx:category-alt'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Product Report" path="/admin/product_report" total={count && count.tot_products && count.tot_products} color="warning" icon={'arcticons:user-manual'} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
