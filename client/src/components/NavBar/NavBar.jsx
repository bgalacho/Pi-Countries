import React from 'react';
import { Link } from 'react-router-dom';
import s from './navBar.module.css'

export default function NavBar(){
    return (
        <nav className={s.navBar}>
            {/* <div className={s.container}> */}
                <Link to='/home'>
                    <button className={s.btn}>HOME</button>
                </Link>
                <Link to='/createActivity'>
                    <button className={s.btn}>CREATE ACTIVITY</button>
                </Link>
            {/* </div> */}
        </nav>
    )
};