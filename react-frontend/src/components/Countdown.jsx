// src/components/Countdown.jsx
import React, { useState, useEffect } from "react";

const Countdown = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const end = new Date(endTime);
            const distance = end.getTime() - now.getTime();

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    const formatNumber = (num) => String(num).padStart(2, "0");

    // Komponen kecil untuk setiap unit waktu agar kode tidak berulang
    const TimeUnit = ({ label, value }) => (
        <div className="text-center">
            <small className="text-muted">{label}</small>
            <div className="h3 fw-bold mb-0">{formatNumber(value)}</div>
        </div>
    );

    // Komponen untuk separator
    const Separator = () => <div className="h3 fw-bold text-danger mx-2 mb-0">:</div>;

    return (
        // Gunakan d-flex dengan align-items-end untuk menyejajarkan bagian bawah elemen
        <div className="d-flex justify-content-center align-items-end">
            <TimeUnit label="Days" value={timeLeft.days} />
            <Separator />
            <TimeUnit label="Hours" value={timeLeft.hours} />
            <Separator />
            <TimeUnit label="Minutes" value={timeLeft.minutes} />
            <Separator />
            <TimeUnit label="Seconds" value={timeLeft.seconds} />
        </div>
    );
};

export default Countdown;
