import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Calendar } from 'rsuite';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import './styles.css';

// ----------------------------------------------------------------------

export function UserView() {
  const [dass21Data, setDass21Data] = useState<any[]>([]);
  const [psstData, setPsstData] = useState<any[]>([]);
  const [symptomTrackingData, setSymptomTrackingData] = useState<any[]>([]);
  const [allAssessments, setAllAssessments] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedDateAssessments, setSelectedDateAssessments] = useState<any>(null);

  useEffect(() => {
    const fetchDass21Data = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`http://localhost:3000/dass21/${userId}`);
        const data = await response.json();
        setDass21Data(data);
      } catch (error) {
        console.error("Error fetching DASS-21 data:", error);
      }
    };

    const fetchPsstData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`http://localhost:3000/psst/${userId}`);
        const data = await response.json();
        setPsstData(data);
      } catch (error) {
        console.error("Error fetching PSST data:", error);
      }
    };

    const fetchSymptomTrackingData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`http://localhost:3000/symptom-tracking/${userId}`);
        const data = await response.json();
        setSymptomTrackingData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching symptom tracking data:", error);
      }
    };

    const fetchAllAssessments = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`http://localhost:3000/all-assessments/${userId}`);
        const data = await response.json();
        setAllAssessments(data);
      } catch (error) {
        console.error("Error fetching all assessments data:", error);
      }
    };

    fetchDass21Data();
    fetchPsstData();
    fetchSymptomTrackingData();
    fetchAllAssessments();
  }, []);

  const chartOptionsuser = {
    chart: {
      type: 'donut' as const,
    },
    labels: ['Label 1', 'Label 2', 'Label 3'],
    colors: ['#FFCDB2', '#FFB4A2', '#FFB6C1'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        },
      }
    }]
  };

  const planSectionData = [44, 55, 41];
  const periods = ['ช่วงก่อนมีรอบเดือน', 'ช่วงมีรอบเดือน', 'ช่วงหมดประจำเดือน'];

  const checkPSSTResult = () => {
    const { pmdd, pms } = psstData[0] || {};
    if (pmdd === 0 && pms === 0) {
      return 'ไม่มีอาการ';
    }
    if (pmdd === 1) {
      return 'มีแนวโน้มอาการ PMDD';
    }
    if (pms === 1) {
      return 'มีแนวโน้มอาการ PMS';
    }
    return 'ไม่พบข้อมูล';
  };

  const getSymptomData = (period: string) => symptomTrackingData.find(data => data.period === period) || {};

  const renderSymptomSection = (period: string, index: number) => {
    const symptomData = getSymptomData(period);
    return (
      <Box key={index} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 25 }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography sx={{ mt: 1, mb: 1 }}>
              อาการของร่างกาย
            </Typography>
            {symptomData.physicalSymptoms ? (
              <ul>
                {symptomData.physicalSymptoms.map((symptom: string, symptomIndex: number) => (
                  <li key={symptomIndex}>
                    <Typography variant='body2' sx={{ mb: 1, whiteSpace: 'nowrap' }}>
                      {symptom}
                    </Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant='body2'>
                ไม่พบข้อมูล
              </Typography>
            )}
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography sx={{ mt: 1, mb: 1, whiteSpace: 'nowrap' }}>
              อาการของพฤติกรรม
            </Typography>
            {symptomData.emotionalSymptoms ? (
              <ul>
                {symptomData.emotionalSymptoms.map((symptom: string, symptomIndex: number) => (
                  <li key={symptomIndex}>
                    <Typography variant='body2' sx={{ mb: 1, whiteSpace: 'nowrap' }}>
                      {symptom}
                    </Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant='body2'>
                ไม่พบข้อมูล
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  const handleOpen = async (date: Date) => {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    const dateString = nextDate.toISOString().split('T')[0];
    const userId = localStorage.getItem('user_id');
    try {
      const response = await fetch(`http://localhost:3000/assessments/${userId}/${dateString}`);
      const data = await response.json();
      if (data.dass21.length > 0 || data.psst.length > 0 || data.symptomTracking.length > 0) {
        setSelectedDate(nextDate);
        console.log(data);
        setSelectedDateAssessments(data);
        setOpen(true);
      }
    } catch (error) {
      console.error("Error fetching assessments for selected date:", error);
    }
  };

  const handleClose = () => setOpen(false);

  const renderCell = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const assessmentsOnDate = allAssessments.filter(assessment => assessment.date.startsWith(dateString));
    if (assessmentsOnDate.length > 0) {
      return (
        <div style={{ padding: '4px', backgroundColor: '#FFCDB2', width: '100%', height: '15px' }}>
          {/*  */}
        </div>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        mt: 10,
      }}
    >
      <Typography variant='h6' sx={{ mb: 1 }}>
        ผลการติดตามอาการช่วงก่อนมีรอบเดือน
      </Typography>
      <Typography variant='body2' sx={{ mb: 3 }}>
        วันที่ประเมินล่าสุด : {symptomTrackingData[0] && new Date(symptomTrackingData[0]?.created_at).toLocaleDateString()} {!symptomTrackingData[0] && 'ไม่พบข้อมูล'}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mb: 3, gap: 10 }}>
        {renderSymptomSection('ช่วงก่อนมีรอบเดือน', 0)}
      </Box>

      <Typography variant='h6' sx={{ mb: 1, mt: 10 }}>
        ผลการติดตามอาการช่วงมีรอบเดือน
      </Typography>
      <Typography variant='body2' sx={{ mb: 3 }}>
        วันที่ประเมินล่าสุด
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mb: 3, gap: 10 }}>
        {renderSymptomSection('ช่วงมีรอบเดือน', 1)}
      </Box>

      <Typography variant='h6' sx={{ mb: 5, mt: 10 }}>
        ผลการประเมินสุขภาวะสุขภาพจิต DASS-21
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        {periods.map((period, index) => {
          const periodData = dass21Data.length > 0 ? dass21Data.find(data => data.period === period) : null;
          return (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant='body1' sx={{ mx: 15 }}>
                {period}
              </Typography>
              {periodData ? (
                <>
                  <Typography variant='body2' sx={{ mb: 3 }}>
                    วันที่ประเมินล่าสุด: {new Date(periodData.created_at).toLocaleDateString()}
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    ภาวะซึมเศร้าของคุณอยู่ในระดับ {periodData.depression}
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    ภาวะวิตกกังวลของคุณอยู่ในระดับ {periodData.anxiety}
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    ภาวะความเครียดของคุณอยู่ในระดับ {periodData.stress}
                  </Typography>
                </>
              ) : (
                <Typography variant='body2'>
                  ไม่พบข้อมูล
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      <Typography variant='h6' sx={{ mb: 1, mt: 10 }}>
        แบบคัดกรองอาการก่อนมีประจำเดือน PSST-A
      </Typography>
      <Typography variant='body2' sx={{ mb: 2 }}>
        วันที่ประเมินล่าสุด : {psstData[0] && new Date(psstData[0]?.created_at).toLocaleDateString()} {!psstData[0] && 'ไม่พบข้อมูล'}
      </Typography>
      <Typography variant='body1' sx={{ mb: 5 }}>
        ผลการคัดกรองเบื้องต้น : {checkPSSTResult()}
      </Typography>

      <Typography variant='h6' sx={{ mb: 5, mt: 10 }}>
        เป็นแบบประเมินคัดกรองเบื้องต้นควรปรึกษาแพทย์หรือผู้เชียวชาญเพื่อการวินิจฉัยที่ถูกต้อง
      </Typography>

      <Typography variant='h6' sx={{ mb: 1, mt: 10 }}>
        ประวัติการทำแบบประเมิน
      </Typography>
      <Box sx={{ width: '100%', maxWidth: 900, mt: 5 }}>
        <Calendar bordered renderCell={renderCell} onSelect={handleOpen} />
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1000,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}>
          <Typography variant='h6' component='h2' sx={{ textAlign: 'center' }}>
            ประวัติการทำแบบประเมิน
          </Typography>
          {selectedDate && selectedDateAssessments && (
            <Box>
              <Typography sx={{ textAlign: 'center', mb: 3 }}>
                วันที่: {new Date(selectedDate.getTime() - 86400000).toLocaleDateString()}
              </Typography>
              {selectedDateAssessments.symptomTracking.length > 0 && (
                <Box>
                  <Typography variant='body1' sx={{ mb: 1, textAlign: 'center' }}>
                    ผลการติดตามอาการช่วงก่อนมีรอบเดือน
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mb: 3, gap: 10 }}>
                    {renderSymptomSection('ช่วงก่อนมีรอบเดือน', 0)}
                  </Box>
                </Box>
              )}
              {selectedDateAssessments.dass21.length > 0 && (
                <Box>
                  <Typography variant='body1' sx={{ mb: 5, textAlign: 'center' }}>
                    ผลการประเมินสุขภาวะสุขภาพจิต DASS-21
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                    {periods.map((period, index) => {
                      const periodData = selectedDateAssessments.dass21.find((data: { period: string }) => data.period === period);
                      return (
                        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Typography variant='body1' sx={{ mx: 15, whiteSpace: 'nowrap' }}>
                            {period}
                          </Typography>
                          {periodData ? (
                            <Box>
                              <Typography variant='body2' sx={{ mb: 1 }}>
                                ภาวะซึมเศร้าของคุณอยู่ในระดับ {periodData.depression}
                              </Typography>
                              <Typography variant='body2' sx={{ mb: 1 }}>
                                ภาวะวิตกกังวลของคุณอยู่ในระดับ {periodData.anxiety}
                              </Typography>
                              <Typography variant='body2' sx={{ mb: 1 }}>
                                ภาวะความเครียดของคุณอยู่ในระดับ {periodData.stress}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant='body2'>
                              ไม่พบข้อมูล
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
              {selectedDateAssessments.psst.length > 0 && (
                <Box>
                  <Typography variant='body1' sx={{ mb: 1, mt: 10, textAlign: 'center' }}>
                    แบบคัดกรองอาการก่อนมีประจำเดือน PSST-A
                  </Typography>
                  <Typography variant='body1' sx={{ mb: 5, textAlign: 'center' }}>
                    ผลการคัดกรองเบื้องต้น : {checkPSSTResult()}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          <Button onClick={handleClose} sx={{ mt: 2 }}>
            ปิด
          </Button>
        </Box>
      </Modal>
    </Box >

  );
}
