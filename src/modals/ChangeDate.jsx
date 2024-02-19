import React, { useState } from 'react';
import Calendar from 'react-calendar';
import styles from './ChangeDate.module.css'


export default function Menu({isOpen,handler}){
    const [dateValue,setDateValue ] = useState(null)
    
    return(
        isOpen?
          <div className={styles.CalendarContainer} onClick={(e)=>e.stopPropagation()}>
          <Calendar formatDay={(locale, date) => date.toLocaleString("en", {day: "numeric"})} value={dateValue} onChange={setDateValue}/>
          <button onClick={()=>handler(dateValue)} className={styles.submitBtn}>확인</button>
          </div>
        :null
        )
}