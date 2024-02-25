import React, { useState, useRef,useEffect } from 'react';
import styles from './Menu.module.css'
import {Planner,DB} from '../database'
import { ReactComponent as ChangeIcon } from "../assets/icons/change.svg";
import { ReactComponent as MemoIcon } from "../assets/icons/memo.svg";
import { ReactComponent as PutOffIcon } from "../assets/icons/putoff.svg";
import { ReactComponent as TrashIcon } from "../assets/icons/trash.svg";
import { ReactComponent as ADDIcon } from "../assets/icons/add.svg";
import { ReactComponent as XMarkIcon } from "../assets/icons/xmark.svg";
import { ReactComponent as PenIcon } from "../assets/icons/pen.svg";

const icons={
    change:<ChangeIcon width={20} height={20} fill='#fff'/>,
    memo:<MemoIcon width={20} height={20} fill='#fff'/>,
    putoff:<PutOffIcon width={20} height={20} fill='#fff'/>,
    trash:<TrashIcon width={20} height={20} fill='#fff'/>,
    add:<ADDIcon width={20} height={20} fill='#fff'/>,
    xmark:<XMarkIcon width={20} height={20} fill='#fff'/>,
    pen:<PenIcon width={20} height={20} fill='#fff'/>
}

export default function Menu({isOpen,setOpen,menuData}){
    
    
    return(
        isOpen?
        <div className={styles.container} onClick={()=>{setOpen(!isOpen)}}>
          <div className={styles.menuContainer} onClick={(e)=>e.stopPropagation()}>
        
            {
                menuData.map(e=>
                <div className={styles.menuRow} onClick={e.handler}>
                    <div className={styles.icon} style={{background:e.color}}>{icons[e.icon]}</div>{e.name}
                  </div>
                )
            }
          </div>
        </div>
        :null
        )
}