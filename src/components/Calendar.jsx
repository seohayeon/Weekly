import React, { useState,useEffect } from 'react';
import styles from './Calendar.module.css'
import {Planner,DB} from '../database'
import {ColorPalette} from '../util/ColorPalette'

function CalendarArr({year,month,setDay,selectedDay,data}){
    
  const curMonthLastDate = new Date(year, month, 0).getDate();
  const prevMonthLastDay = new Date(year, month - 1, 0).getDay();
  const allDaysArr = [];
  
  if (prevMonthLastDay !== 6) {
    for (let i = 0; i <= prevMonthLastDay; i++) {
      allDaysArr.push(
        <td
          key={`empty-${i}`}
          className={styles.emptyDay}
        />
      );
    }
  }
  const today = new Date()
  for (let i = 1; i <= curMonthLastDate; i++) {
    let isToday = false;
    let isSelected = false;
    
    if (
      year === today.getFullYear() &&
      month === today.getMonth() + 1 &&
      i === today.getDate()
    ) {
      isToday = true;
    }
    
    if (
      year === selectedDay.getFullYear() &&
      month === selectedDay.getMonth() + 1 &&
      i === selectedDay.getDate()
    ) {
      isSelected = true;
    }
    
    const daydata = data.filter(e=>e.date.getDate()==i)
    const subjects = [...new Set(daydata.map(item => item.subject))];
    
    allDaysArr.push(
      <td
        key={i}
        className={`${styles.dayBlock} ${isToday && styles.today} ${isSelected && styles.selected}`}
        onClick={() => {
          setDay(new Date(year,month - 1,i))
        }}
      >
        {i}
        <div className={styles.marks}>
        {subjects.map(e=><div className={styles.mark} style={{background:ColorPalette[e]}}></div>)}
        </div>
      </td>
    );
  }
  
  const calendar = [];
  for (let i = 1; i <= 6; i++) {
    const weekArr = allDaysArr.slice(0, 7);
    const lack = 7 - weekArr.length;
    if (lack !== 0) {
      for (let j = 1; j <= lack; j++) {
        weekArr.push(
          <td
            key={`empty-${j}`}
            className={styles.emptyDay}
          />
        );
      }
    }
    // 2-3. 완성된 한 주를 반환할 배열에 추가
    calendar.push(<tr key={i}>{weekArr.map((el) => el)}</tr>);

    // 2-4. 추가된 날짜는 기존 배열에서 삭제
    allDaysArr.splice(0, 7);
  }

  return (<>{calendar.map((el) => el)}</>);
}
function Calendar({setDay,selectedDay}){
    const [day,setCalDate]= useState(new Date())
    const filter=(e)=>e.date.getMonth()==day.getMonth()
    const filter2=(e)=>e.date.getFullYear()==day.getFullYear()
    const [monthly,setMonthly] = useState([])
    
    useEffect(()=>{
       DB.open()
        .then(()=>{
            Planner.find(null,filter,filter2).get()
            .then((result)=>{
                setMonthly(result)
            })
        })
    },[day.getMonth()])
    
    
    const handlePrevMonth=()=>{
        setCalDate(date => {
         date.setMonth(date.getMonth() - 1);
         return new Date(date)
      });
    }
    
    const handleNextMonth=()=>{
        setCalDate(date => {
         date.setMonth(date.getMonth() + 1);
         return new Date(date)
      });
    }
    
    return(
        <>
        <div className={styles.CalendarHeader}>
          <div className={styles.YDContainer}>
        <div className={styles.controller} onClick={handlePrevMonth}>&lt; &nbsp;</div>  
        <div className={styles.Year}>{day.getFullYear()}년 &nbsp;</div>
        <div className={styles.Date}>{day.getMonth() + 1}월</div>
        <div className={styles.controller} onClick={handleNextMonth}>&nbsp; &gt;</div>  
          </div>
        </div>
        <table className={styles.calendarContainer}>
        <thead>
          <tr>
            <th style={{color:'#E25241'}}>SUN</th>
            <th>MON</th>
            <th>TUE</th>
            <th>WED</th>
            <th>THU</th>
            <th>FRI</th>
            <th style={{color:'#4994EF'}}>SAT</th>
          </tr>
        </thead>
        <tbody>
        <CalendarArr year={day.getFullYear()} month={day.getMonth()+1} setDay={setDay} selectedDay={selectedDay} data={monthly}/>
        </tbody>
      </table>
        </>
        )
}

export default Calendar