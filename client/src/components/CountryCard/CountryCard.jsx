import React from 'react';
import { Link } from 'react-router-dom';
import s from './countryCard.module.css';

export default function CountryCard({ flag, name, continent }) {
    return (
        <div className={s.card}>
            <div className={s.image_container}>
                <img className={s.image} src={flag} alt='flag' />
            </div>
            <div className={s.text_container}>
                <h1 className={s.country}> {name} </h1>
                <h2 className={s.continents}>{continent} Continent</h2>
            </div>
        </div>
    )
}
