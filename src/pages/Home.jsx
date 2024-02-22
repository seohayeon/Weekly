import React, { useState,useEffect } from 'react';
import {Planner,DB,LectureList} from '../database'
import Calendar from '../components/Calendar'
import Menu from '../modals/Menu'
import styles from './Home.module.css'
import {format} from 'date-fns'
import styled from 'styled-components';
import {ColorPalette} from '../util/ColorPalette'
import { ReactComponent as MemoIcon } from "../assets/icons/memo.svg";
import 'react-calendar/dist/Calendar.css';



const Label = styled.label`
  width: 1.5rem;
  height: 1.5rem;
  border: 1.5px solid black;
  cursor: pointer;
  display: inline-block;
  margin-right: 0.4rem;
  border-radius: 50%;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;

  &:after {
    /* ::after에 대한 스타일 */
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
   display: none;
  
  &:checked + ${Label}::after {
      content:'';
      width: 100%;
      height: 100%;
      font-size: 20px;
      text-align: center;
      background-color: ${props => props.color ? props.color : '#FF629D'};
      display: block;
  }
`;

const Home = () => {
  const [todayPlan,setTodayPlan] = useState([]) 
  const [day,setDay] = useState(new Date())
  const todayFormat = format(day, "M월 d일")
  const [isMenuOpen,setMenuOpen] = useState(false)
  const [selected,setSelected] = useState(null)
  
  useEffect(()=>{
    const filter=(e)=>new Date(e.date).getMonth()==day.getMonth()
    const filter2=(e)=>new Date(e.date).getDate()==day.getDate()
    DB.open()
    .then(async ()=>{
        const data = await Planner.find(null,filter,filter2).get();
        
        setTodayPlan(data)
    }) 
    
  },[todayFormat,isMenuOpen])
  
  const handleCheckBox=async(data,index)=>{
      await Planner.find({value:data.id,key:'id'}).update({clear:!data.clear})
      let newArr = [...todayPlan];
      newArr[index]['clear'] = !data.clear
      setTodayPlan(newArr)
      
      const lecture = await LectureList.find({value:data.lectureID,key:'id'}).get()
      if(lecture[0]){
        const progress= new Set(lecture[0].progress)
        
        if(data.clear) progress.add(data.lectureNum)
        else progress.delete(data.lectureNum)
        const arraySet = Array.from(progress)
        
        await LectureList.find({value:data.lectureID,key:'id'}).update({progress:arraySet})
      }
  }
  
  return (
    <div className={styles.container}>
    <Calendar selectedDay={day} setDay={setDay} todayPlan={todayPlan}/>
      <div className={styles.todayPlan}>
      {todayFormat}의 계획
      {
          todayPlan.map((e,i)=>
           <div className={`${styles.eachPlan} ${e.clear&&styles.clear}`}>
             <Checkbox id={`check${i}`} checked={e.clear} onChange={()=>handleCheckBox(e,i)} color={ColorPalette[e.subject]}/>
             <Label htmlFor={`check${i}`}/>
             
             <span onClick={()=>{setMenuOpen(!isMenuOpen);setSelected(e)}} className={styles.lectureInfo}>
             [{e.subject}] {e.name} {e.lectureNum}강
             </span>
             <span>{e.memo!==''?<span><MemoIcon width={15} height={15}/></span>:null}</span>
           </div>
          )
      }</div>
      <Menu isOpen={isMenuOpen} setOpen={setMenuOpen} selected={selected} setSelected={setSelected}/>
    </div>
  );
};

export default Home;
