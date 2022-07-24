import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

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
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDelete: PropTypes.func,
  onexport: PropTypes.func,
  onstausChange: PropTypes.func
};

export default function UserListToolbar({ numSelected, filterName, onFilterName, onDelete, onstausChange, onexport }) {
  return (


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
            placeholder="Search Category..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
        )}

      {numSelected > 0 ? (
        <div>
          <Tooltip title="Bulk Status Change">
            <IconButton className='stausButton' onClick={onstausChange}>
              <Iconify icon="el:lock" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Bulk Delete">
            <IconButton className='trashButton' onClick={onDelete}>
              <Iconify icon="eva:trash-2-fill" />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <Tooltip title="Export PDF">
          <IconButton className='stausButton' onClick={onexport}>
            <Iconify icon="foundation:page-export-pdf" />
          </IconButton>
        </Tooltip>
      )}

    </RootStyle>
  );
}
