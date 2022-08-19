import PropTypes from 'prop-types';
import * as Yup from 'yup';

// material
import { styled } from '@mui/material/styles';
import {
  Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, TextField, Button
} from '@mui/material';



import { useFormik, Form, FormikProvider } from 'formik';

// component
import Iconify from '../../../components/Iconify';
import { toast } from 'react-toastify';

// css
import '../../../pages/common.css';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  data: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDelete: PropTypes.func,
  onstausChange: PropTypes.func,
  onmetalstatusChange: PropTypes.func,
  getRecord: PropTypes.func,
  onexport: PropTypes.func
};


export default function UserListToolbar({ numSelected, filterName, onFilterName,
  onDelete, onstausChange, getRecord, onexport, data, onmetalstatusChange }) {

  const filterSchema = Yup.object().shape({
    from_date: Yup.string(),
    to_date: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      from_date: '',
      to_date: ''
    },
    validationSchema: filterSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!values.from_date && !values.to_date) {
        toast.error("Please fill Dates");
        return;
      } else {
        let data = values;
        resetForm();
        getRecord(data);
      }

    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <div>

      <RootStyle
        sx={{
          ...(numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) :

          (
            <SearchStyle
              value={filterName}
              onChange={onFilterName}
              placeholder="Search Order..."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
            />
          )}

        {
          numSelected > 0 &&
          <div>
            <Tooltip title="Bulk Status Change">
              <IconButton className='stausButton' onClick={onstausChange}>
                <Iconify icon="el:lock" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Bulk Metal Status Change">
              <IconButton className='stausButton' onClick={onmetalstatusChange}>
                <Iconify icon="el:lock" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Bulk Delete">
              <IconButton className='trashButton' onClick={onDelete}>
                <Iconify icon="eva:trash-2-fill" />
              </IconButton>
            </Tooltip>
          </div>

        }
        
        {
          data > 0 && numSelected === 0 &&
          <Tooltip title="Export PDF">
            <IconButton className='stausButton' onClick={onexport}>
              <Iconify icon="foundation:page-export-pdf" />
            </IconButton>
          </Tooltip>
        }

      </RootStyle>

      <FormikProvider value={formik}>
        <Form autoComplete="off" encType="multipart/form-data" noValidate onSubmit={handleSubmit}>

          <RootStyle>
            <TextField
              type="date"
              label="From Date"
              margin="normal"
              {...getFieldProps('from_date')}
              InputLabelProps={{ shrink: true }}
              error={Boolean(touched.from_date && errors.from_date)}
              helperText={touched.from_date && errors.from_date}
            />

            <TextField
              type="date"
              label="To Date"
              margin="normal"
              {...getFieldProps('to_date')}
              InputLabelProps={{ shrink: true }}
              error={Boolean(touched.to_date && errors.to_date)}
              helperText={touched.to_date && errors.to_date}
            />

            <Button variant="contained" type="submit">
              Search by Date
            </Button>

          </RootStyle>
        </Form>
      </FormikProvider>

    </div >
  );


}
