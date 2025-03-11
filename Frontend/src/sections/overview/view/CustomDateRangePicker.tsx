import React, { useState } from 'react';
import { Calendar } from 'rsuite';
import Box from '@mui/material/Box';

interface CustomDateRangePickerProps {
    dateRange: [Date | null, Date | null];
    setDateRange: (range: [Date | null, Date | null]) => void;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({ dateRange, setDateRange }) => {
    const [start, setStart] = useState<Date | null>(dateRange[0]);
    const [end, setEnd] = useState<Date | null>(dateRange[1]);

    const handleSelect = (date: Date) => {
        if (!start || (start && end)) {
            setStart(date);
            setEnd(null);
            setDateRange([date, null]);
        } else if (start && !end) {
            if (date < start) {
                setEnd(start);
                setStart(date);
                setDateRange([date, start]);
            } else {
                setEnd(date);
                setDateRange([start, date]);
            }
        }
    };

    return (
        <Box>
            <Calendar
                bordered
                onSelect={handleSelect}
                renderCell={(date) => {
                    const dateKey = date.toISOString().split('T')[0];
                    const isSelected = (start && dateKey === start.toISOString().split('T')[0]) || (end && dateKey === end.toISOString().split('T')[0]);
                    const isInRange = start && end && date > start && date < end;
                    return (
                        <div style={{ padding: '4px', backgroundColor: isSelected || isInRange ? '#de5d83' : 'transparent' }}>
                            {/* {date.getDate()} */}
                        </div>
                    );
                }}
            />
        </Box>
    );
};

export default CustomDateRangePicker;
