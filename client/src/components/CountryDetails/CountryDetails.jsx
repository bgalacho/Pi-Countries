import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { countryDetail } from '../../redux/Actions/actions';
import NavBar from '../NavBar/NavBar'
import s from './countryDetail.module.css';

export default function CountryDetails() {
    const country = useSelector(state => state.countryDetail)
    const requestedCountryId = useParams().id;
    const dispatch = useDispatch();

    useEffect(() => { dispatch(countryDetail(requestedCountryId)) }, [])

    const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

    return (
        <div className={s.background}>
            <NavBar />
            {
                country ? (
                    <div className={s.container}>
                        <div className={s.header}>
                            <img className={s.flag} src={country.flag}/>
                            <div className={s.headerData}>
                                <div className={s.countryName}>{country.name}</div>
                                <div className={s.continent}>{country.continent}</div>
                            </div>
                        </div>

                        <div className={s.description}>
                            Capital: <b>{country.capital}</b> <br />
                            SubRegion: <b>{country.subregion}</b> <br />
                            Area: <b>{numberFormatter.format(
                            country.area > 1000000 ? (country.area / 1000000) : country.area
                        )}{country.area > 1000000 ? "M" : ""} km²</b> <br />
                            Population: <b>{numberFormatter.format(country.population)}</b>
                        </div>

                        <div className={s.activitiesTitle}>Activities</div>
                        {country.activities.map(activity =>
                            (<div className={s.activity}>{activity.name}</div>)
                        )}
                    </div>
                )
                    : <div>Loading country...</div>
            }
        </div>
    )
}