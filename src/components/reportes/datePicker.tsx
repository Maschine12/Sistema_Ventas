import React, { useState } from 'react';

interface DateRangePickerProps {
    onDateChange: (start: string, end: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = event.target.value;
        setStartDate(newStartDate);
        onDateChange(newStartDate, endDate);
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = event.target.value;
        setEndDate(newEndDate);
        onDateChange(startDate, newEndDate);
    };

    return (
        <div className="flex space-x-4 mb-4">
            <div>
                <label className="block mb-1">Fecha de Inicial</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="border p-2 rounded bg-gray-50"
                />
            </div>
            <div>
                <label className="block mb-1">Fecha de Final</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="border p-2 rounded bg-gray-50"
                />
            </div>
        </div>
    );
};

export default DateRangePicker;
