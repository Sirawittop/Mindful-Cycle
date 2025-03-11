import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Calendar } from 'rsuite';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';

import CustomDateRangePicker from './CustomDateRangePicker';
import './styles.css';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [addIconOpen, setAddIconOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [dateRanges, setDateRanges] = useState<{ start_date: string, end_date: string }[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [symptomModalOpen, setSymptomModalOpen] = useState(false);
  const [dass21ModalOpen, setDass21ModalOpen] = useState(false);
  const [psstAModalOpen, setPsstAModalOpen] = useState(false);
  const [trackingPeriod, setTrackingPeriod] = useState<string>('');
  const [trackingDASS, setTrackingDASS] = useState<string>('');
  const [symptomTrackingModalOpen, setSymptomTrackingModalOpen] = useState(false);
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>([]);
  const [emotionalSymptoms, setEmotionalSymptoms] = useState<string[]>([]);
  const [dass21Responses, setDass21Responses] = useState<{ [key: number]: string }>({});
  const [psstResponses, setPsstResponses] = useState<{ [key: number]: string }>({});
  const [cycleDays, setCycleDays] = useState<number>(0); // Default cycle days
  const [cycle, setCycle] = useState<number>(0) // Default cycle

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`http://localhost:3000/notes/${userId}`);
        const data = await response.json();

        const notesData = data.reduce((acc: { [key: string]: string }, item: { date: string, note: string }) => {
          const datePlusOne = new Date(item.date);
          datePlusOne.setDate(datePlusOne.getDate() + 1);
          const dateKey = datePlusOne.toISOString().split('T')[0];
          acc[dateKey] = item.note;
          return acc;
        }, {});
        setNotes(notesData);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    const fetchDateRanges = async () => {
      try {
        const response = await fetch(`http://localhost:3000/date-ranges/${localStorage.getItem('user_id')}`);
        const data = await response.json();
        setDateRanges(data);
      } catch (error) {
        console.error("Error fetching date ranges:", error);
      }
    };

    const fetchCycleDays = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`http://localhost:3000/user-cycle/${userId}`);
        const data = await response.json();
        setCycleDays(data.cycleDays);
        setCycle(data.cycle);
      } catch (error) {
        console.error("Error fetching cycle days:", error);
      }
    };

    fetchNotes();
    fetchDateRanges();
    fetchCycleDays();
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateKey = date.toISOString().split('T')[0];
    setNote(notes[dateKey] || '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAddIconOpen(false);
    setConfirmModalOpen(false);
    setSymptomModalOpen(false);
    setDass21ModalOpen(false);
    setPsstAModalOpen(false);
    setSymptomTrackingModalOpen(false);
    setNote('');
    setDateRange([null, null]);
    setTrackingPeriod('');
    setPhysicalSymptoms([]);
    setEmotionalSymptoms([]);
    setDass21Responses({});
    setTrackingDASS('');
    setPsstResponses({});
  };

  const handleSaveNote = async () => {
    if (selectedDate) {
      const dateKey = selectedDate.toISOString().split('T')[0];
      try {
        const response = await fetch("http://localhost:3000/save-note", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: localStorage.getItem('user_id'), date: dateKey, note }),
        });
        const data = await response.json();
        if (response.ok) {
          setNotes((prevNotes) => ({
            ...prevNotes,
            [dateKey]: note,
          }));
          handleClose();
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }
  };

  const handleAddIconClick = () => {
    setAddIconOpen(true);
  };

  const handleAddIconClose = () => {
    setAddIconOpen(false);
    setDateRange([null, null]);
  };

  const handleSaveWeek = async () => {
    if (dateRange[0] && dateRange[1]) {
      const startDate = new Date(dateRange[0]);
      startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date(dateRange[1]);
      endDate.setDate(endDate.getDate() + 1);

      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];

      try {
        const response = await fetch("http://localhost:3000/save-date-range", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: localStorage.getItem('user_id'), start_date: startDateString, end_date: endDateString }),
        });
        const data = await response.json();
        if (response.ok) {
          // refetch page
          window.location.reload();
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error saving date range:", error);
      }
    }
    handleAddIconClose();
  };


  const handleConfirmSaveWeek = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmModalClose = () => {
    setConfirmModalOpen(false);
  };

  const handleConfirmModalSave = () => {
    handleSaveWeek();
    setConfirmModalOpen(false);
  };


  const handleSymptomModalClose = () => {
    setTrackingPeriod('');
    setSymptomModalOpen(false);
  };

  const handleDass21ModalOpen = () => {
    setDass21ModalOpen(true);
  };

  const handleDass21ModalClose = () => {
    setDass21ModalOpen(false);
  };

  const handlePsstAModalOpen = () => {
    setPsstAModalOpen(true);
  };

  const handlePsstAModalClose = () => {
    setPsstAModalOpen(false);
  };

  const handleTrackingPeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingPeriod(event.target.value);
  };

  const handleTrackingDASSChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingDASS(event.target.value);
  }

  const handleSymptomTrackingModalOpen = () => {
    setSymptomTrackingModalOpen(true);
    setSymptomModalOpen(false);
  };

  const handleSymptomTrackingModalClose = () => {
    setSymptomTrackingModalOpen(false);
  };

  const handlePhysicalSymptomsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const symptom = event.target.value;
    setPhysicalSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleEmotionalSymptomsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const symptom = event.target.value;
    setEmotionalSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const renderSmallCalendarCell = (date: Date) => {
    const isInRange = dateRanges.some(range => {
      const startDate = new Date(range.start_date);
      const endDate = new Date(range.end_date);
      return date >= startDate && date <= endDate;
    });

    const isInPredictedRange = dateRanges.some(range => {
      const endDate = new Date(range.end_date);
      const predictedStartDate = new Date(endDate);
      predictedStartDate.setDate(predictedStartDate.getDate() + cycle);
      const predictedEndDate = new Date(predictedStartDate);
      predictedEndDate.setDate(predictedEndDate.getDate() + cycleDays);
      return date >= predictedStartDate && date <= predictedEndDate;
    });

    return (
      <div style={{ padding: '4px', backgroundColor: isInRange ? '#de5d83' : isInPredictedRange ? '#ffcccb' : 'transparent' }}>
        {/* Only show date range, no notes */}
      </div>
    );
  };

  const renderBigCalendarCell = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    const noteForDate = notes[dateKey];
    return (
      <div style={{ padding: '4px', wordWrap: 'break-word' }}>
        {noteForDate && <div className="note">{noteForDate}</div>}
      </div>
    );
  };

  const questionsDASS = [
    "ฉันรู้สึกยากที่จะสงบจิตใจ",
    "ฉันรู้สึกปากแห้งคอแห้ง",
    "ฉันแทบไม่รู้สึกดี ๆ อะไรบ้างเลย",
    "ฉันมีอาการหายใจผิดปกติ (เช่นหายใจเร็วเกินเหตุ หายใจไม่ทันแม้ว่าจะไม่ได้ออกแรง)",
    "ฉันพบว่ามันยากที่จะคิดริเริ่มสิ่งใดสิ่งหนึ่ง",
    "ฉันมีแนวโน้มที่จะตอบสนองเกินเหตุต่อสถานการณ์",
    "ฉันรู้สึกว่าร่างกายบางส่วนสั่นผิดปกติ (เช่น มือสั่น)",
    "ฉันรู้สึกเสียพลังไปมากกับการวิตกกังวล",
    "ฉันรู้สึกกังวลกับเหตุการณ์ที่อาจทำให้ฉันรู้สึกตื่นกลัวและกระทำบางสิ่งที่น่าอับอาย",
    "ฉันไม่มีเป้าหมายในชีวิต",
    "ฉันรู้สึกกระวนกระวายใจ",
    "ฉันอยากที่จะผ่อนคลายตัวเอง",
    "ฉันรู้สึกจิตใจเหงาหงอยเศร้าซึม",
    "ฉันรู้สึกทนไม่ได้เวลามีอะไรมาขัดขวางสิ่งที่ฉันกำลังทำอยู่",
    "ฉันรู้สึกคล้ายจะมีอาการตื่นตระหนัก",
    "ฉันรู้สึกไม่มีความกระตือรือร้นต่อสิ่งใด",
    "ฉันรู้สึกเป็นคนไม่มีคุณค่า",
    "ฉันรู้สึกค่อนข้างฉุนเฉียวง่าย",
    "ฉันรับรู้ถึงการทำงานของหัวใจแม้ในตอนที่ฉันไม่ได้ออกแรง (เช่น รู้สึกหัวใจเต้นเร็วขึ้น หรือเต้นไม่เป็นจังหวะ)",
    "ฉันรู้สึกกลัวโดยไม่มีเหตุผล",
    "ฉันรู้สึกว่าชีวิตไม่มีความหมาย"
  ];

  const questionsPSST = [
    "โกรธ/หงุดหงิด",
    "วิตกกังวล/เครียด",
    "ร้องไห้ได้ง่าย/ไวต่อการถูกปฏิเสธมากขึ้น",
    "อารมณ์ลดลง/รู้สึกหมดหวัง",
    "ความสนใจในการลดลง",
    "ความสนใจในกิจกรรมที่บ้านลดลง",
    "ความสนใจในกิจกรรมสังคมลดลง",
    "มีปัญหาในการมีสมาธิ",
    "เหนื่อยล้า/ขาดพลังงาน",
    "กินมากเกินไป/อยากอาหาร",
    "นอนไม่หลับ",
    "นอนมากกว่าปกติ (ต้องการการนอนมากขึ้น)",
    "รู้สึกท่วมทันหรือควบคุมตัวเองไม่ได้",
    "อาการทางกายภาพ: เจ็บเต้านม, ปวดหัว, ปวดกล้ามเนื้อ/ข้อ, ท้องอืด, น้ำหนักขึ้น",
    "ประสิทธิภาพหรือการทำงาน/การเรียน",
    "ความสัมพันธ์กับเพื่อนๆ/เพื่อนร่วมงาน",
    "ความสัมพันธ์กับครอบครัว",
    "กิจกรรมทางสังคม",
    "หน้าที่รับผิดชอบที่บ้าน"
  ];

  const questionsDASSConverted = {
    0: "V",
    1: "W",
    2: "X",
    3: "Y",
    4: "Z",
    5: "AA",
    6: "AB",
    7: "AC",
    8: "AD",
    9: "AE",
    10: "AF",
    11: "AG",
    12: "AH",
    13: "AI",
    14: "AJ",
    15: "AK",
    16: "AL",
    17: "AM",
    18: "AN",
    19: "AO",
    20: "AP"
  };


  const handleDassChange = (index: number, value: string) => {
    setDass21Responses((prev) => ({ ...prev, [index]: value }));
  };

  const handlePsstChange = (index: number, value: string) => {
    setPsstResponses((prev) => ({ ...prev, [index]: value }));
  }

  const handleSaveDass21 = async () => {
    try {

      // convert responses to format for saving questionsDASSConverted
      const Responses = Object.entries(dass21Responses).reduce((acc: { [key: string]: string }, [key, value]) => {
        const questionKey = questionsDASSConverted[key as unknown as keyof typeof questionsDASSConverted];
        if (questionKey) {
          acc[questionKey] = value;
        }
        return acc;
      }, {});

      const response = await fetch("http://localhost:3000/save-dass21", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: localStorage.getItem('user_id'), period: trackingDASS, responses: Responses }),
      });
      const data = await response.json();
      if (response.ok) {
        handleClose();
        window.location.reload();
      } else {
        console.error(data.error);
      }
    }
    catch (error) {
      console.error("Error saving DASS-21:", error);
    }
  }

  const handleSavePsst = async () => {
    try {
      const response = await fetch("http://localhost:3000/save-psst", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: localStorage.getItem('user_id'), responses: psstResponses }),
      });
      const data = await response.json();
      if (response.ok) {
        handleClose();
        window.location.reload();
      } else {
        console.error(data.error);
      }
    }
    catch (error) {
      console.error("Error saving PSST-A:", error);
    }
  }

  const handleSaveSymptomTracking = async () => {
    try {
      const response = await fetch("http://localhost:3000/save-symptom-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('user_id'),
          period: trackingPeriod,
          physicalSymptoms,
          emotionalSymptoms,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        handleClose();
        window.location.reload();
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error saving symptom tracking:", error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box className="small-calendar" sx={{ marginBottom: 2, position: 'relative' }}>
          <Calendar bordered renderCell={renderSmallCalendarCell} />
          <AddIcon
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: '10px', // Increase padding to make the icon bigger
              fontSize: '3.5rem', // Increase font size to make the icon bigger
              cursor: 'pointer',
              color: '#de5d83',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // Add box shadow
            }}
            onClick={handleAddIconClick}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#de5d83', borderRadius: '50%', mr: 1 }} />
            <Typography>
              ช่วงเวลาที่เป็นประจำเดือน
            </Typography>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#ffcccb', borderRadius: '50%', mr: 1, ml: 2 }} />
            <Typography>
              ช่วงเวลาคาดการณ์เป็นประจำเดือน
            </Typography>
          </Box>

        </Box>
        <Button sx={{ marginBottom: 3, marginTop: 3 }} onClick={handleSymptomTrackingModalOpen}>
          เพิ่มการติดตามอาการ
        </Button>
        <Button sx={{ marginBottom: 3 }} onClick={handleDass21ModalOpen}>
          แบบประเมินสุขภาวะสุขภาพจิต DASS-21
        </Button>
        <Button onClick={handlePsstAModalOpen}>
          แบบคัดกรองอาการก่อนมีประจำเดือน PSST-A
        </Button>
      </Box>
      <Box className="big-calendar">
        <Calendar bordered onSelect={handleDateSelect} renderCell={renderBigCalendarCell} />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant='h6' component='h2' sx={{ textAlign: 'center' }}>
            บันทึกโน้ตสำหรับวันที่ {selectedDate?.toLocaleDateString()}
          </Typography>
          <TextField
            fullWidth
            label='Note'
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              onClick={handleSaveNote}
              variant='contained'
              sx={{
                backgroundColor: "#de5d83",
                '&:hover': {
                  backgroundColor: "#c75473",
                },
              }}
            >
              บันทึกโน้ต
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={addIconOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant='h6' component='h2' sx={{ textAlign: 'center' }}>
            เลือกช่วงเวลาที่เป็นประจำเดือน
          </Typography>
          <CustomDateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              onClick={handleConfirmSaveWeek}
              variant='contained'
              sx={{
                backgroundColor: "#de5d83",
                '&:hover': {
                  backgroundColor: "#c75473",
                },
              }}
            >
              บันทึกช่วงเวลาเป็นประจำเดือน
            </Button>
          </Box>
        </Box>
      </Modal>
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
            ยืนยันการบันทึกช่วงเวลา
          </Typography>
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            คุณแน่ใจหรือไม่ว่าต้องการบันทึกช่วงเวลานี้ ?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>ยกเลิก</Button>
            <Button onClick={handleConfirmModalSave} color="primary">บันทึก</Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={dass21ModalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            maxHeight: '80%',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ textAlign: "center" }}>
            แบบประเมินสุขภาวะสุขภาพจิต DASS-21
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ fontSize: 16, textAlign: 'center' }}>
                เลือกช่วงเวลาที่ต้องการติดตาม
              </FormLabel>
              <RadioGroup value={trackingDASS} onChange={handleTrackingDASSChange} sx={{ mt: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <FormControlLabel value="ช่วงก่อนมีรอบเดือน" control={<Radio />} label="ช่วงก่อนมีรอบเดือน" />
                <FormControlLabel value="ช่วงมีรอบเดือน" control={<Radio />} label="ช่วงมีรอบเดือน" />
                <FormControlLabel value="ช่วงหมดประจำเดือน" control={<Radio />} label="ช่วงหมดประจำเดือน" />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box sx={{ mt: 3 }}>
            {questionsDASS.map((question, index) => (
              <FormControl component="fieldset" key={index} sx={{ width: "100%", mt: 2 }}>
                <FormLabel component="legend" sx={{ fontSize: 16 }}>
                  {question}
                </FormLabel>
                <RadioGroup
                  row
                  value={dass21Responses[index] || ""}
                  onChange={(e) => handleDassChange(index, e.target.value)}
                  sx={{ mt: 1, display: "flex", justifyContent: "space-around" }}
                >
                  <FormControlLabel value="0" control={<Radio />} label="ไม่ตรงกับฉัน" />
                  <FormControlLabel value="1" control={<Radio />} label="เกิดขึ้นเป็นบางครั้ง" />
                  <FormControlLabel value="2" control={<Radio />} label="เกิดขึ้นบ่อย" />
                  <FormControlLabel value="3" control={<Radio />} label="เกิดขึ้นบ่อยมากที่สุด" />
                </RadioGroup>
              </FormControl>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#de5d83",
                '&:hover': { backgroundColor: "#c75473" },
              }}
              onClick={handleSaveDass21}
              disabled={!trackingDASS || Object.keys(dass21Responses).length < 21}
            >
              บันทึก
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={psstAModalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            maxHeight: '80%',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,

          }}
        >
          <Typography variant='h6' component='h2' sx={{ textAlign: 'center' }}>
            แบบคัดกรองอาการก่อนมีประจำเดือน PSST-A
          </Typography>
          <Box sx={{ mt: 3 }}>
            {questionsPSST.map((question, index) => (
              <FormControl component="fieldset" key={index} sx={{ width: "100%", mt: 2 }}>
                <FormLabel component="legend" sx={{ fontSize: 16 }}>
                  {question}
                </FormLabel>
                <RadioGroup
                  row
                  value={psstResponses[index] || ""}
                  onChange={(e) => handlePsstChange(index, e.target.value)}
                  sx={{ mt: 1, display: "flex", justifyContent: "space-around" }}
                >
                  <FormControlLabel value="0" control={<Radio />} label="ไม่มีเลย" />
                  <FormControlLabel value="1" control={<Radio />} label="เล็กน้อย" />
                  <FormControlLabel value="2" control={<Radio />} label="ปานกลาง" />
                  <FormControlLabel value="3" control={<Radio />} label="รุนแรง" />
                </RadioGroup>
              </FormControl>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#de5d83",
                '&:hover': { backgroundColor: "#c75473" },
              }}
              onClick={handleSavePsst}
              disabled={Object.keys(psstResponses).length < 19}
            >
              บันทึก
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={symptomTrackingModalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 320, sm: 800 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            เพิ่มการติดตามอาการ
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              วันที่ {new Date().toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ fontSize: 16, textAlign: 'center' }}>
                เลือกช่วงเวลาที่ต้องการติดตาม
              </FormLabel>
              <RadioGroup value={trackingPeriod} onChange={handleTrackingPeriodChange} sx={{ mt: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <FormControlLabel value="ช่วงก่อนมีรอบเดือน" control={<Radio />} label="ช่วงก่อนมีรอบเดือน" />
                <FormControlLabel value="ช่วงมีรอบเดือน" control={<Radio />} label="ช่วงมีรอบเดือน" />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ width: '48%' }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: 16 }}>
                  อาการทางกาย (10 อาการ)
                </FormLabel>
                <FormGroup>
                  {[
                    'สิว',
                    'ท้องอืด',
                    'เจ็บเต้านม',
                    'เวียนศีรษะ',
                    'อ่อนเพลีย',
                    'ปวดศีรษะ',
                    'ร้อนวูบวาบ',
                    'คลื่นไส้ ท้องเสีย ท้องผูก',
                    'ใจสั่น',
                    'บวม (มือ ข้อเท้า เท้า)',
                  ].map((symptom) => (
                    <FormControlLabel
                      key={symptom}
                      control={
                        <Checkbox
                          checked={physicalSymptoms.includes(symptom)}
                          onChange={handlePhysicalSymptomsChange}
                          value={symptom}
                        />
                      }
                      label={symptom}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Box>
            <Box sx={{ width: '48%' }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: 16 }}>
                  อาการทางพฤติกรรมทางอารมณ์ (12 อาการ)
                </FormLabel>
                <FormGroup>
                  {[
                    'ระเบิดอารมณ์ ทะเลาะวิวาท มีแนวโน้มรุนแรง',
                    'สับสน สมาธิไม่ดี',
                    'ร้องไห้ง่าย',
                    'ซึมเศร้า',
                    'อยากอาหาร (เค็ม หวาน)',
                    'หลงลืม',
                    'หงุดหงิด',
                    'อยากอาหารเพิ่มขึ้น',
                    'อารมณ์แปรปรวน',
                    'อ่อนไหวเกินไป',
                    'อยากอยู่คนเดียว',
                  ].map((symptom) => (
                    <FormControlLabel
                      key={symptom}
                      control={
                        <Checkbox
                          checked={emotionalSymptoms.includes(symptom)}
                          onChange={handleEmotionalSymptomsChange}
                          value={symptom}
                        />
                      }
                      label={symptom}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#de5d83",
                '&:hover': { backgroundColor: "#c75473" },
              }}
              onClick={handleSaveSymptomTracking}
              disabled={!trackingPeriod || (physicalSymptoms.length === 0 && emotionalSymptoms.length === 0)}
            >
              บันทึก
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box >
  );
}
