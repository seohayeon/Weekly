import {LectureList,DB,Planner} from '../database'
import LecturePlan from '../components/LecturePlan'
import styles from './LectureDetail.module.css'
import React,{useState,useEffect} from 'react';
import AddPlan from '../modals/AddPlan'
import { ReactComponent as ClearIcon } from "../assets/icons/clear.svg";
import { ReactComponent as EllipsisIcon } from "../assets/icons/ellipsis.svg";
import BasicMenu from "../modals/BasicMenu";
import ModalFrame from "../modals/ModalFrame";

export default function LectureDetail({setModalOpen,isOpen,lecture,setLecture}){
    const handleClose=()=>{
        setModalOpen(false)
    }
    const lectureArr = Array.from({length: lecture?.totalLecture}, (_, i) => i + 1)
    const [addPlanModalOpen,setAddPlanModalOpen] = useState(false)
    
    const [timer,setTimer] = useState()
    const [pressLec,setPressLec] = useState()
    const [progress,setProgress] = useState()
    
    useEffect(()=>{
        setProgress(lecture?.progress)
    },[lecture])
    
    const [viewHeight,setViewHeight] = useState()
    const [memoList,setMemoList] = useState([]) 
    useEffect(()=>{
        setViewHeight(window.innerHeight)
        window.addEventListener('resize',function(){
            setViewHeight(window.innerHeight)
        })
        if(lecture){
        getMemo(lecture?.id)
        .then(result=>{
            setMemoList(result)
        })
        }
    },[lecture])
    
    const getMemo=async(lectureID)=>{
        await DB.open()
        const filter = (data) => data.memo.length > 0
        const data = await Planner.find({value:lectureID,index:'lectureID'},filter).get()
        return data
    }
    
    const timeOutEvent=(lecNum)=>{
        if(progress.indexOf(lecNum) == -1){
          setProgress(prev=>[...prev,lecNum])
          clearLecture(progress,lecture.id,lecNum,'ADD')
        }else{
            setProgress(prev=>prev.filter(e=>e !== lecNum))
            clearLecture(progress,lecture.id,lecNum,'DEL')
        } 
    }
    
    const handleMouseDown=async(lecNum)=>{
        if(timer) clearTimeout(timer);
        setPressLec(lecNum)
        setTimer(setTimeout(()=>timeOutEvent(lecNum), 800));
    }
    
    const handleMouseUp=()=>{
        setPressLec()
        clearTimeout(timer);
    }

    
    const [spreadLecture,setSpreadLecture] = useState(null) 
    const MemoData = ({lectureNum}) => {
        const lecture = memoList.filter(data=>data.lectureNum==lectureNum)
        return(
            <>
            {console.log(lecture)}
                {lecture.map(memo=>
                <div className={styles.memoBlock}>
                    {
                    memo.memo.split('\n').map( line => {
                            return (<span>{line}<br/></span>)
                            })}
                </div>
            )}
            </>
        )
    }
    const [menuOpen,setMenuOpen] = useState(false)
    const [isAlter,setIsAlter] = useState(false)
    const [delAlert,setDelOpen] = useState(false)
    const [lectureInput,setLectureInput] = useState({...lecture,name:'',subject:'',teacher:'',totalLecture:''})
    
    useEffect(e=>{
        setLectureInput({...lecture,name:lecture?.name,subject:lecture?.subject,teacher:lecture?.teacher,totalLecture:lecture?.totalLecture})
    },[lecture,isAlter])
    const lectureMenuData = [{name:'계획추가',icon:'add',handler:()=>{setAddPlanModalOpen(!addPlanModalOpen);setMenuOpen(!menuOpen)}},{name:'계획수정',icon:'pen',handler:()=>{}},{name:'강좌수정',icon:'change',handler:()=>{setIsAlter(!isAlter);setMenuOpen(!menuOpen)}},{name:'강좌삭제',icon:'trash',handler:()=>{setDelOpen(true);setMenuOpen(false)},color:'#E15241'}]
    const handleInputChange=(e)=>{
        const {name,value} = e.target
        setLectureInput({...lectureInput,[name]:value})
    }
    const handleAlter=async()=>{
        await DB.open()
        const data = await LectureList.find({value:lecture?.id,key:'id'}).update(lectureInput)
        setIsAlter(false)
        setLecture(lectureInput)
    }
    const handleDeleteLecture=async()=>{
        await DB.open()
        const data = await LectureList.find({value:lecture?.id,key:'id'}).delete()
        setModalOpen(false)
        setDelOpen(false)
    }
    return(
        <>
        <div className={`${styles.container} ${isOpen?styles.open:styles.closeModal}`} style={{overflow:addPlanModalOpen?'hidden':null}}>
            <div className={styles.close} onClick={handleClose}>x</div>
            <div className={styles.detailContainer} >
            {!isAlter?
            <div className={styles.lectureName}>
               <div>[{lecture?.subject}] {lecture?.name} ({lecture?.totalLecture}강)</div>
               <div>{lecture?.teacher}</div>
            </div>
            :
             <div className={styles.lectureName}>
              <div className={styles.upInput}>
               <input type="text" value={lectureInput.subject} name='subject' onChange={handleInputChange} className={styles.subInput} placeholder='과목'/>
               <input type="text" value={lectureInput.name} name='name' onChange={handleInputChange} className={styles.nameInput} placeholder='제목'/>
               </div>
               <div className={styles.downInput}>
               <input type="text" value={lectureInput.teacher} name='teacher' onChange={handleInputChange} className={styles.teacherInput} placeholder='선생님'/>
               <input type="text" value={lectureInput.totalLecture} name='totalLecture' onChange={handleInputChange} className={styles.totalInput} placeholder='강좌수'/>
               </div>
               <div className={styles.buttonDiv}>
               <button className={styles.alterSubmit} onClick={handleAlter}>강좌 수정</button>
               <button className={styles.alterCancel} onClick={()=>setIsAlter(false)}>취소</button>
               </div>
            </div>
            }
               
               <EllipsisIcon width={20} height={20} onClick={()=>setMenuOpen(!menuOpen)}/>
               
               {
                   lectureArr.map(e=>
                       <>
                       <div className={`${styles.eachLec}`} 
                       onMouseDown={()=>handleMouseDown(e)} 
                       onMouseUp={handleMouseUp}
                       onTouchStart={()=>handleMouseDown(e)}
                       onTouchEnd={handleMouseUp}
                       onTouchMove={handleMouseUp}
                       onClick={()=>{setSpreadLecture(e);}}
                       >
                       <div className={`${styles.gauge} ${pressLec==e&&styles.pressing}`}></div>
                       <div className={styles.lectureInfo}>
                       <div className={styles.lectureNum}>{e}강</div>
                       <div className={styles.memoSummary}>{memoList.find(data=>data.lectureNum==e)?.memo}</div>
                       {progress?.find(item=>item==e)?<div className={styles.clear}><ClearIcon width={25} height={25} fill='#23D160'/></div>
                       :null}
                       </div>
                       {spreadLecture==e?
                       <div className={styles.lectureDetailInfo}
                       onTouchStart={(event)=>{event.stopPropagation()}}>
                       <MemoData lectureNum={e}/>
                       </div>:null}
                       </div>
                       </>
                   )
               }
             </div>
             {addPlanModalOpen&&<AddPlan setModalOpen={setAddPlanModalOpen} lecture={lecture} height={viewHeight}/>}
        </div>
        <BasicMenu isOpen={menuOpen} setOpen={setMenuOpen} menuData={lectureMenuData}/>
        <ModalFrame setOpen={setDelOpen} isOpen={delAlert} header='강좌 삭제하기'>
            <div className={styles.deleteAlertBody}>
                강좌를 삭제하시겠습니까?
                <button className={styles.deleteAlertBtn} onClick={handleDeleteLecture}>삭제하기</button>
            </div>
        </ModalFrame>
        </>
        )
}

async function clearLecture(progress,lectureID,lecNum,type){
        const pgrSet= new Set(progress)
        
        if(type=='ADD') pgrSet.add(lecNum)
        else if(type=='DEL') pgrSet.delete(lecNum)
        const arraySet = Array.from(pgrSet)
        await LectureList.find({value:lectureID,key:'id'}).update({progress:arraySet})
      
}