import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Avatar } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    { props.closeModal() };
    setOpen(false);
  }

  const { user } = props;

  return (
    <div>
      <Modal
        open={props.isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box alignItems='center' display='flex' justifyContent='center'>
            <Avatar alt={`${user.name}`} src={`${user.pic}`} sx={{ width: 170,height:170,border:'10px solid #dbb1d4'}}/>
          </Box>
          <Typography id="modal-modal-title" variant="h6" component="h2" align='center'>
            {user.name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} align='center'>
            {user.email}
          </Typography>

        </Box>
      </Modal>
    </div>
  );
}