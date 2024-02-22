import React, { useState, useRef,useEffect } from 'react';
import styles from './Menu.module.css'
import ChangeDate from './ChangeDate'
import {Planner,DB} from '../database'
import { ReactComponent as ChangeIcon } from "../assets/icons/change.svg";
import { ReactComponent as MemoIcon } from "../assets/icons/memo.svg";
import { ReactComponent as PutOffIcon } from "../assets/icons/putoff.svg";
import { ReactComponent as TrashIcon } from "../assets/icons/trash.svg";

const icons={
    change:<ChangeIcon width={20} height={20} fill='#fff'/>,
    memo:<MemoIcon width={20} height={20} fill='#fff'/>,
    putoff:<PutOffIcon width={20} height={20} fill='#fff'/>,
    trash:<TrashIcon width={20} height={20} fill='#fff'/>,
}

export default function Menu({isOpen,setOpen,selected,setSelected}){
    const [memoOpen,setMemoOpen] = useState(false)
    const [changeDateOpen,setChangeDateOpen] = useState(false)
    const inputRef = useRef()
    const handleDelete=async()=>{
        await DB.open()
        await Planner.find({value:selected.id,key:'id'}).delete()
        setOpen(false)
        
    }
    const handleMemo=()=>{
        setMemoOpen(true)
        //window.scrollTo(100,100)
    }
    const handlePutOff=async()=>{
        await DB.open()
        const planData = await Planner.find({value:selected.id,key:'id'}).get()
        const date = new Date(planData[0].date)
        date.setDate(date.getDate() + 1);
        await Planner.find({value:selected.id,key:'id'}).update({date:date})
        setOpen(false)
    }
    const handlePullToday=async()=>{
        await DB.open()
        const planData = await Planner.find({value:selected.id,key:'id'}).get()
        const date = new Date(planData[0].date)
        await Planner.find({value:selected.id,key:'id'}).update({date:new Date()})
        setOpen(false)
    }
    const handleChangeDate=()=>{
        setChangeDateOpen(true)
    }
    const [inputMemo,setInputMemo] = useState('')
    const handleCompleteMemo=async()=>{
        await DB.open()
        await Planner.find({value:selected.id,key:'id'}).update({memo:inputMemo})
        setMemoOpen(false)
        setOpen(false)
        setInputMemo('')
    }
    
    const menuData=[{icon:'memo',name:'메모',handler:handleMemo,color:'orange'},{icon:'putoff',name:'내일하기',handler:handlePutOff,color:'blue'},{icon:'change',name:'날짜변경',handler:handleChangeDate,color:'blue'},{icon:'trash',name:'삭제',handler:handleDelete,color:'red'}]
    
    const scrollRef = useRef()
    useEffect(()=>{
        inputRef.current?.focus()
        if(scrollRef.current){
            scrollRef.current.scrollTop=scrollRef.current.scrollHeight
        }
    },[memoOpen])
    
    const [memoData,setMemoData] = useState(null)
    useEffect(()=>{
        if(!selected) return
        
        DB.open()
        .then(()=>{
            Planner.find({value:selected.id,key:'id'}).get()
            .then((data)=>{
                if(data.memo!==''){
                    setMemoData(data[0]?.memo)
                    setInputMemo(data[0]?.memo)
                }
            })
        })
    },[selected,isOpen])
    const handleCompleteChangeDate = () => {
        setChangeDateOpen(false)
        setOpen(false)
    }
    
    const changeDateSubmit=async(value)=>{
        if(value){
            await DB.open()
            await Planner.find({value:selected.id,key:'id'}).update({date:value})
        }
        setChangeDateOpen(false)
        setOpen(false)
        
    }
    
    return(
        isOpen?
        <div className={styles.container} onClick={()=>{setOpen(!isOpen);setSelected(null);setMemoOpen(false);setChangeDateOpen(false)}} ref={scrollRef}>
        {
            <ChangeDate handler={changeDateSubmit} isOpen={changeDateOpen}/>
        }
          <div className={styles.menuContainer} onClick={(e)=>e.stopPropagation()}>
          {memoOpen?<div className={styles.memoContainer}>
            <div>
            <div className={styles.menuHeader}>
              <div className={styles.memoComplete} onClick={handleCompleteMemo}>완료</div>
            </div>
                <textarea className={styles.memoInput} value={inputMemo} onChange={(e)=>setInputMemo(e.target.value)} ref={inputRef}>
                </textarea>
            </div>
          </div>
          :null}
        
            {
                menuData.map(e=>
                <>
                {(new Date(selected.date).toISOString().split('T')[0]!==new Date().toISOString().split('T')[0])&&e.name=='내일하기'?
                <div className={styles.menuRow} onClick={handlePullToday}>
                    <div className={styles.icon} style={{background:e.color}}>{icons[e.icon]}</div>오늘 하기
                  </div>
                :<div className={styles.menuRow} onClick={e.handler}>
                    <div className={styles.icon} style={{background:e.color}}>{icons[e.icon]}</div>{e.name}
                  </div>
                }
                  {
                        e.name=='메모'&&memoData?<div className={styles.memoData}>
                        {memoData}
                        </div>:null
                    }
                  </>
                )
            }
          </div>
        </div>
        :null
        )
}