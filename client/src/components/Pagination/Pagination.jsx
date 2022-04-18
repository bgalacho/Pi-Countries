import React from 'react';
import s from './pagination.module.css'

export default function Pagination ({page,rpp,total,nextPageCB,prevPageCB}){
    const prevPageButton = page!==1 ?
        (<button className={`${s.btn} ${s.btnEnabled}`} onClick={prevPageCB}>&lt;</button>) :
        (<button className={`${s.btn} ${s.btnDisabled}`}>&lt;</button>);


    const lastPage = Math.ceil(total/rpp);
    
    const nextPageButton = page === lastPage?
        (<button className={`${s.btn} ${s.btnDisabled}`}>&gt;</button>):
        (<button className={`${s.btn} ${s.btnEnabled}`} onClick={nextPageCB}>&gt;</button>);

    return(
        <div className={s.center}>
            <div className={s.container}>
                {prevPageButton}
                <span className={s.pages}>{page} / {lastPage}</span>
                {nextPageButton}
            </div>
        </div>
    )
}