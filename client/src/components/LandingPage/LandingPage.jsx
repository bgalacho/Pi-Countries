import React from 'react';
import { Link } from 'react-router-dom';
import s from './landingPage.module.css'

export default function LandingPage(){
    return (       
        <div className={s.container}>
            <div>
            <Link to='/home'>                
                <button className={s.btn}>Let's start</button>
            </Link>
            </div>
        </div>
    )
}