import React, { useState, useEffect } from 'react';
import { addDays, format, startOfWeek } from 'date-fns';
import {Planner,DB,LectureList} from '../database'
import styles from './LecturePlan.module.css'
import DetailPlan from './DetailPlan'


function calculateCompletionDate(totalLectures, lecturesPerDayByWeekday, startDate) {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  let currentDate = new Date(startDate);
  let lecturesRemaining = totalLectures;
  const dateArr = []
  while (lecturesRemaining > 0) {
    const currentDayOfWeek = currentDate.getDay();
    let lecturesToday = lecturesPerDayByWeekday[currentDayOfWeek];
    if(isNaN(lecturesToday)){
        currentDate.setDate(currentDate.getDate() + 1);
         lecturesPerDayByWeekday[currentDayOfWeek] = 0;
    }else if (lecturesToday > 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      lecturesRemaining -= lecturesToday;
    } else {
      // If no lectures planned for the current day, move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (lecturesRemaining <= 0 || Object.values(lecturesPerDayByWeekday).every(val => val === 0)) {
      break;
    }
  }
  currentDate.setDate(currentDate.getDate() - 1)
  const completionDate = currentDate.toLocaleDateString();
  return completionDate;
}



const saveToDB= async(id,name,weekly,lectures,startDate,subject)=>{
  const filter = (data) => {
      const today = new Date()
      today.setHours(0,0,0,0);
      return new Date(data.date)>=today
  }
  
  await DB.open()
  const isExist = await Planner.find({value:id,index:'lectureID'},filter).delete()
 
  var addDay=0
  let remainLecture = lectures
  const planArr=[]
  let lecNum = 0
  while(lecNum<lectures.length){
      let day = addDays(startDate, addDay)
      let weekOfDay = day.getDay()
      let weekPlan = weekly[weekOfDay]
      if(weekPlan=='') weekPlan=0
      for (var i = 0; i < weekPlan; i++) {
          if(!lectures[lecNum]) break
          await Planner.add({id:+new Date(),lectureID:id,name:name,lectureNum:lectures[lecNum],date:day,subject:subject,clear:false,memo:''})
          lecNum++
      }
     
      addDay++
  }
}

const App = ({lecture}) => {
  const initialLecturesPerDay = {
    0: 0, // 일요일
    1: 0, // 월요일
    2: 0, // 화요일
    3: 0, // 수요일
    4: 0, // 목요일
    5: 0, // 금요일
    6: 0  // 토요일
  };
  const lectureArr = Array.from({length: lecture.totalLecture}, (_, i) => i + 1)
  const [lecturesPerDay, setLecturesPerDay] = useState({ ...initialLecturesPerDay });
  const [totalLectures, setTotalLectures] = useState(0);
  const [startDate, setStartDate] = useState(new Date());


  const handleLecturesPerDayChange = (day, value) => {
    setLecturesPerDay((prevLectures) => ({
      ...prevLectures,
      [day]: parseInt(value, 10)
    }));
  };
  
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkItems, setCheckItems] = useState([])
  
  const handleAllCheck=({target})=>{
      if (target.checked) {
        setCheckItems(lectureArr)
        setIsAllChecked(true)
        console.log(checkItems)
      } else {
        setCheckItems([]);
        setIsAllChecked(false)
        console.log(checkItems)
      }
  }
  
  const checkItemHandler = (id, isChecked) => {
    if (isChecked) {
      setCheckItems(prev=>[...prev,Number(id)])
      console.log(checkItems)
      
    } else if (!isChecked) {
      setCheckItems(checkItems.filter((item) => item !== Number(id)))
      console.log(checkItems)
      
    }//checked={checkItems.has(e)?true:false}
  }
  const checkHandled = ({target}) => {
    checkItemHandler(target.id, target.checked);
  }
  
  const submitPlan=async()=>{
      if(Object.values(lecturesPerDay).every(val => val == 0)) return alert('주별 계획을 등록해주세요')
      
      await saveToDB(
        lecture.id,
        lecture.name,
        lecturesPerDay,
        checkItems.sort(function(a,b){return a-b}),
        startDate,
        lecture.subject
      )
      alert('등록되었습니다.')
      
  }
  const [eachPlan,setEachPlan] = useState([])
  useEffect(()=>{
    DB.open()
    .then(async ()=>{
        let data = await LectureList.find({value:lecture.id,key:'id'}).get();
        data = data[0].progress
        const newData = lectureArr.filter(function(val) {
            return data.indexOf(val) == -1;
        });
        setCheckItems(newData)
    }) 
  },[lecture.id])
  const [planType,setPlanType] = useState(0)
  const planInfo = calculateCompletionDate(checkItems.length,{...lecturesPerDay},startDate)
  const sortCheck = checkItems.sort(function(a,b){return a-b})
  
  
  
  return (
    <div>
    <div className={styles.planHeader}>
      <div className={styles.planType} onClick={()=>setPlanType(0)} style={{color:planType==0?'#000':'gray'}}>주별계획 / </div>
      <div className={styles.planType} onClick={()=>setPlanType(1)} style={{color:planType==1?'#000':'gray'}}>&nbsp;세부계획</div>
      </div>
      {planType==0?<><div className={styles.LectureListContainer}>
        <div className={styles.lectureRow}>
          <input type="checkbox" onChange={handleAllCheck} checked={checkItems.length==lectureArr.length?true:false} className={styles.checkBox} id='selectAll'/>
                 <label htmlFor='selectAll'></label>
                 전체선택
        </div>
           {
               lectureArr.map(e=>
               <div className={styles.lectureRow}>
                 <input checked={checkItems.indexOf(e)==-1?false:true} id={e} type='checkbox' onChange={checkHandled} className={styles.checkBox}/>
                 <label htmlFor={e}></label>
                 {e}강
                </div> 
               )
           }
        
      </div>
      <div>
      <div className={styles.weekPerLec}>
        <label>
        <div>
          각 요일별 들을 강좌 수
          </div>
          {Object.keys(lecturesPerDay).map((day) => (
            <div key={day} className={styles.weekInputContainer}>
              <input
                type="number"
                value={lecturesPerDay[day]}
                onChange={(e) => handleLecturesPerDayChange(day, e.target.value)}
                className={styles.weekInput}
              />
              <div>{day==0?'일요일'
                    :day==1?'월요일'
                    :day==2?'화요일'
                    :day==3?'수요일'
                    :day==4?'목요일'
                    :day==5?'금요일'
                    :'토요일'
              } </div>
            </div>
          ))}
        </label>
        </div>
      </div>
      <div>
      <div className={styles.dayInfoContainer}>
        <label>
          시작 날짜:
          <input
            type="date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </label>
        
        <div>
        종료 날짜: {lecturesPerDay==initialLecturesPerDay?null:planInfo}
      </div>
      </div>
      
      </div>
      <button onClick={submitPlan} className={styles.setPlanBtn}>계획세우기</button>
      </>
      :
        <DetailPlan LecturesPerDay={lecturesPerDay} checkItems={checkItems} handleAllCheck={handleAllCheck} lectureArr={lectureArr} checkHandled={checkHandled} startDate={startDate} lecture={lecture}/>
    
      }
    </div>
  );
};

export default App;
