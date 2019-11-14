import React, { useState, useMemo, useEffect } from 'react';
import {
  format,
  isBefore,
  addDays,
  subDays,
  setHours,
  setMinutes,
  setSeconds,
  parseISO,
  isSameSecond,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import api from '~/services/api';

import { Container, Time } from './styles';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

export default function Dashboard() {
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date());

  const dateFormatted = useMemo(
    () => format(date, "d 'de' MMMM", { locale: pt }),
    [date],
  );
  useEffect(() => {
    const loadSchedule = async () => {
      const response = await api.get('schedules', {
        params: {
          date,
        },
      });

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.tron.log(response.data);
      const data = range.map(hour => {
        const checkDate = setSeconds(setMinutes(setHours(date, hour), 0), 0);
        const compareDate = utcToZonedTime(checkDate, timezone);

        return {
          time: `${hour}:00h`,
          past: isBefore(compareDate, new Date()),
          appointment: response.data.find(a =>
            isSameSecond(parseISO(a.date), compareDate),
          ),
        };
      });
      setSchedule(data);
    };
    loadSchedule();
  }, [date]);

  const handlePrevDay = () => {
    setDate(subDays(date, 1));
  };
  const handleNextDay = () => {
    setDate(addDays(date, 1));
  };

  useEffect(() => {
    console.tron.log(schedule);
  }, [schedule]);
  return (
    <Container>
      <header>
        <button type='button' onClick={handlePrevDay}>
          <MdChevronLeft size={30} color='#fff' />
        </button>
        <strong>{dateFormatted}</strong>
        <button type='button' onClick={handleNextDay}>
          <MdChevronRight size={30} color='#fff' />
        </button>
      </header>

      <ul>
        {schedule.map(time => (
          <Time key={time.time} past={time.past} available={!time.appointment}>
            <strong>{time.time}</strong>
            <span>
              {time.appointment ? time.appointment.user.name : 'Em aberto'}
            </span>
          </Time>
        ))}
      </ul>
    </Container>
  );
}
