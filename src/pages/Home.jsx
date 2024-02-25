import React, { useState,useEffect } from 'react';
import {Planner,DB,LectureList} from '../database'
import Calendar from '../components/Calendar'
import Menu from '../modals/Menu'
import BasicMenu from '../modals/BasicMenu'
import styles from './Home.module.css'
import {format} from 'date-fns'
import styled from 'styled-components';
import {ColorPalette} from '../util/ColorPalette'
import { ReactComponent as MemoIcon } from "../assets/icons/memo.svg";
import { ReactComponent as Ellipsis } from "../assets/icons/ellipsis.svg";




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
  const [todayPlanMenu,setTodayPlanMenu] = useState(false)
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
  
  const deleteUnCompletePlan=async()=>{
      const filter = (data) => {
          const today = new Date(day)
          day.setHours(0,0,0,0);
          return new Date(data.date).toLocaleDateString()==today.toLocaleDateString() 
      }
      await DB.open()
      const data = await Planner.find({value:data.id,index:'lectureID'},filter).delete();
      setTodayPlanMenu(false)
  }
  
  const planMenuData=[{name:'새 계획추가',icon:'add',color:'#38B8F5'},{name:'모든 계획 삭제',icon:'trash',color:'#FF4E62'},{name:'미완료 할일 내일하기',icon:'putoff',color:'#7195B6'},{name:'미완료 할일 다른날 하기',icon:'change',color:'#7195B6'},{name:'미완료 할일 삭제',icon:'xmark',color:'#7195B6',handler:deleteUnCompletePlan}]
  
  
  
  return (
    <div className={styles.container}>
    <Calendar selectedDay={day} setDay={setDay} todayPlan={todayPlan}/>
      <div className={styles.todayPlan}>
      <div className={styles.todayPlanHeader}>
      {todayFormat}의 계획
      <Ellipsis width={30} height={30} fill='white' className={styles.ellipsisIcon} onClick={()=>setTodayPlanMenu(!todayPlanMenu)}/>
      </div>
      <div className={styles.todayPlanBody}>
      
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
      }
      </div>
      </div>
      <Menu isOpen={isMenuOpen} setOpen={setMenuOpen} selected={selected} setSelected={setSelected}/>
      <BasicMenu isOpen={todayPlanMenu} setOpen={setTodayPlanMenu} menuData={planMenuData}/>
    </div>
  );
};

export default Home;
