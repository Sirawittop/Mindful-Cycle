import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal'; // Import Modal
import Switch from '@mui/material/Switch'; // Import Switch
import { useState, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';

export function ProductsView() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false); // State for modal
  const [cycle, setCycle] = useState('');
  const [cycleDays, setCycleDays] = useState('');
  const [originalCycle, setOriginalCycle] = useState('');
  const [originalCycleDays, setOriginalCycleDays] = useState('');
  const [isCycleEdited, setIsCycleEdited] = useState(false);
  const [isCycleDaysEdited, setIsCycleDaysEdited] = useState(false);

  const [beforePeriod, setBeforePeriod] = useState(false);
  const [duringPeriod, setDuringPeriod] = useState(false);
  const [beforeDASS21, setBeforeDASS21] = useState(false);
  const [duringDASS21, setDuringDASS21] = useState(false);
  const [afterDASS21, setAfterDASS21] = useState(false);
  const [beforePSST, setBeforePSST] = useState(false);
  const [isNotificationsEdited, setIsNotificationsEdited] = useState(false); // State for notification edits

  useEffect(() => {
    const fetchUserDetails = async () => {
      const storedEmail = localStorage.getItem('user_id');
      if (storedEmail) {
        try {
          const userDetailsResponse = await axios.get(`http://localhost:3000/user-details/${storedEmail}`);
          setUsername(userDetailsResponse.data.username);
          setOriginalUsername(userDetailsResponse.data.username);
          setEmail(userDetailsResponse.data.email);

          const userCycleResponse = await axios.get(`http://localhost:3000/user-cycle/${storedEmail}`);
          setCycle(userCycleResponse.data.cycle);
          setOriginalCycle(userCycleResponse.data.cycle);
          setCycleDays(userCycleResponse.data.cycleDays);
          setOriginalCycleDays(userCycleResponse.data.cycleDays);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      const user_id = localStorage.getItem('user_id');
      if (user_id) {
        try {
          const response = await axios.get(`http://localhost:3000/notification-settings/${user_id}`);
          const settings = response.data;
          setBeforePeriod(settings.beforePeriod);
          setDuringPeriod(settings.duringPeriod);
          setBeforeDASS21(settings.beforeDASS21);
          setDuringDASS21(settings.duringDASS21);
          setAfterDASS21(settings.afterDASS21);
          setBeforePSST(settings.beforePSST);
        } catch (error) {
          console.error('Error fetching notification settings:', error);
        }
      }
    };
    fetchNotificationSettings();
  }, []);

  interface HandleUsernameChangeEvent {
    target: {
      value: string;
    };
  }

  const handleUsernameChange = (e: HandleUsernameChangeEvent) => {
    setUsername(e.target.value);
    setIsEdited(e.target.value !== originalUsername);
  };

  const handleCycleChange = (e: HandleUsernameChangeEvent) => {
    setCycle(e.target.value);
    setIsCycleEdited(e.target.value !== originalCycle);
  };

  const handleCycleDaysChange = (e: HandleUsernameChangeEvent) => {
    setCycleDays(e.target.value);
    setIsCycleDaysEdited(e.target.value !== originalCycleDays);
  };

  const handleSave = async () => {
    setConfirmModalOpen(true); // Open modal on save button click
  };

  const handleConfirmModalSave = async () => {
    const user_id = localStorage.getItem('user_id');
    if (user_id && username !== null) {
      try {
        await axios.put('http://localhost:3000/update-username', {
          user_id,
          new_username: username,
        });
        setOriginalUsername(username);
        setIsEdited(false);
        localStorage.setItem('username', username);
        window.location.reload();
      } catch (error) {
        console.error('Error updating username:', error);
      }
    }
    setConfirmModalOpen(false); // Close modal after saving
  };

  const handleSaveCycle = async () => {
    const user_id = localStorage.getItem('user_id');
    if (user_id && cycle !== null && cycleDays !== null) {
      try {
        await axios.post('http://localhost:3000/save-cycle', {
          user_id,
          cycle,
          cycleDays,
        });
        setOriginalCycle(cycle);
        setOriginalCycleDays(cycleDays);
        setIsCycleEdited(false);
        setIsCycleDaysEdited(false);
        window.location.reload();
      } catch (error) {
        console.error('Error saving cycle:', error);
      }
    }
  };

  const handleSaveCycleDays = async () => {
    // Implement save logic for cycle days
  };

  const handleSaveNotifications = async () => {
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      try {
        await axios.post('http://localhost:3000/save-notification-settings', {
          user_id,
          beforePeriod,
          duringPeriod,
          beforeDASS21,
          duringDASS21,
          afterDASS21,
          beforePSST,
        });
        setIsNotificationsEdited(false); // Reset edit state after saving
        window.location.reload();
      } catch (error) {
        console.error('Error saving notifications:', error);
      }
    }
  };

  const handleNotificationChange = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
    setter(value);
    setIsNotificationsEdited(true); // Set edit state when any switch is toggled
  };

  const handleClose = () => {
    setConfirmModalOpen(false); // Close modal without saving
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',   // Arrange items in a column
        justifyContent: 'center',  // Centers horizontally
        alignItems: 'center',      // Centers vertically
        textAlign: 'center',       // Centers text inside Typography
        mt: 10,
      }}
    >
      <Typography variant='h6' sx={{ mb: 5 }}>
        ข้อมูลบัญชีผู้ใช้
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <TextField
          label='ชื่อผู้ใช้'
          value={username}
          onChange={handleUsernameChange}
          sx={{ width: '300px' }} // Set the width here
        />

        {isEdited && (
          <Button
            variant='contained'
            color='primary'
            onClick={handleSave}
            sx={{
              ml: 2,
              '&:hover': {
                backgroundColor: '#c8486e',
              },
            }}
          >
            บันทึกการแก้ไข
          </Button>
        )}

        <TextField
          label='อีเมล'
          value={email}
          disabled
          sx={{ width: '300px', ml: 5 }} // Set the width here
        />
      </Box>

      <Modal open={confirmModalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            ยืนยันการแก้ไขชื่อผู้ใช้
          </Typography>
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            คุณแน่ใจหรือไม่ว่าต้องการแก้ไขชื่อผู้ใช้?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>
              ยกเลิก
            </Button>
            <Button onClick={handleConfirmModalSave} color="primary">
              บันทึก
            </Button>
          </Box>
        </Box>
      </Modal>


      <Typography variant='h6' sx={{ mt: 10 }}>
        ข้อมูลรอบเดือน
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <TextField
          label='รอบเดือน'
          value={cycle}
          onChange={handleCycleChange}
          sx={{ width: '300px' }}
        />

        <TextField
          label='จำนวนวันของรอบเดือน'
          value={cycleDays}
          onChange={handleCycleDaysChange}
          sx={{ width: '300px', ml: 5 }}
        />
      </Box>
      {isCycleEdited && isCycleDaysEdited && (
        <Button
          variant='contained'
          color='primary'
          onClick={handleSaveCycle}
          sx={{
            ml: 2,
            mt: 4,
            '&:hover': {
              backgroundColor: '#c8486e',
            },
          }}
        >
          บันทึกการแก้ไขรอบเดือน
        </Button>
      )}
      <Typography variant='h6' sx={{ mt: 10 }}>
        การแจ้งเตือน
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10 }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt: 5, gap: 2 }}>
          <Typography>
            ติดตามอาการประจำเดือน
          </Typography>

          <FormControlLabel
            control={<Switch checked={beforePeriod} onChange={(e) => handleNotificationChange(setBeforePeriod, e.target.checked)} />}
            label="ช่วงก่อนมีประจำเดือน"
            sx={{ textAlign: 'left', width: '100%' }}
          />
          <FormControlLabel
            control={<Switch checked={duringPeriod} onChange={(e) => handleNotificationChange(setDuringPeriod, e.target.checked)} />}
            label="ช่วงระหว่างมีประจำเดือน"
            sx={{ textAlign: 'left', width: '100%' }}
          />

        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt: 5, gap: 2 }}>
          <Typography sx={{ whiteSpace: 'nowrap' }}>
            แจ้งเตือนทำแบบสอบถาม DASS-21
          </Typography>

          <FormControlLabel
            control={<Switch checked={beforeDASS21} onChange={(e) => handleNotificationChange(setBeforeDASS21, e.target.checked)} />}
            label="ช่วงก่อนมีประจำเดือน"
            sx={{ textAlign: 'left', width: '100%' }}
          />
          <FormControlLabel
            control={<Switch checked={duringDASS21} onChange={(e) => handleNotificationChange(setDuringDASS21, e.target.checked)} />}
            label="ช่วงระหว่างมีประจำเดือน"
            sx={{ textAlign: 'left', width: '100%' }}
          />
          <FormControlLabel
            control={<Switch checked={afterDASS21} onChange={(e) => handleNotificationChange(setAfterDASS21, e.target.checked)} />}
            label="ช่วงหลังหมดมีประจำเดือน"
            sx={{ textAlign: 'left', width: '100%' }}
          />

        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt: 5, gap: 2 }}>
          <Typography sx={{ whiteSpace: 'nowrap' }}>
            แจ้งเตือนทำแบบสอบถาม PSST-A
          </Typography>

          <FormControlLabel
            control={<Switch checked={beforePSST} onChange={(e) => handleNotificationChange(setBeforePSST, e.target.checked)} />}
            label="ช่วงก่อนมีประจำเดือน"
            sx={{ textAlign: 'left', width: '100%' }}
          />

        </Box>
      </Box>
      {isNotificationsEdited && (
        <Button
          variant='contained'
          color='primary'
          onClick={handleSaveNotifications}
          sx={{
            mt: 4,
            '&:hover': {
              backgroundColor: '#c8486e',
            },
          }}
        >
          บันทึกการแก้ไขการแจ้งเตือน
        </Button>
      )}
    </Box>
  );
}
