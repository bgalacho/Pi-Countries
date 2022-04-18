import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllCountries, postActivity } from '../../redux/Actions/actions';
import s from './createActivity.module.css';

export function validate({ countries, name, difficulty, duration, season }) {
    let errors = {};

    if (!name || name.length < 3) {
        errors.name = "Name should at least be 3 characters long";
    }
    if (!difficulty) {
        errors.difficulty = "Please select a difficulty";
    }
    if (!duration || duration < 1) {
        errors.duration = "Duration should be greater than 0";
    }
    if (!season) {
        errors.season = "Please select a season";
    }
    if (countries.length === 0) {
        errors.countries = "Please select a Country";
    }

    return errors;
}

export default function CreateActivity() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const countries = useSelector(state => state.allCountries);
    const nameFilter = useSelector(state => state.nameFilter);
    const [activity, setActivity] = useState({
        name: "",
        difficulty: 0,
        duration: null,
        season: null,
        countries: []
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (countries.length === 0 || nameFilter) dispatch(getAllCountries())
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();
        if (Object.keys(errors).length == 0) {
            const createActivityAction = await postActivity(activity);
            dispatch(getAllCountries());
            dispatch(createActivityAction);
            alert('~ Activity has been created ~');
            navigate(-1);
        } else {
            alert('Check your inputs!')
        }
    }

    function addCountry(e) {
        const selectedCountryID = e.target.value
        const existingCountry = activity.countries.find(country => country == selectedCountryID);

        if (!existingCountry) {
            const newActivity = {
                ...activity,
                countries: [...activity.countries, selectedCountryID]
            }

            setActivity(newActivity);
            setErrors(validate(newActivity));
        }
    }

    function clearCountry(e) {
        e.preventDefault()
        setActivity({
            ...activity,
            countries: []
        })
    }

    function handleFieldChange(e) {
        const newActivity = {
            ...activity,
            [e.target.name]: e.target.value,
        }

        setActivity(newActivity);
        setErrors(validate(newActivity));
    }

    return (
        <>
            <div className={s.background}></div>
            <div className={s.container}>
                <form onSubmit={handleSubmit}>
                    <h2 className={s.title}>Create Your Activity</h2><hr></hr>

                    <div className={s.formSection} >
                        <label htmlFor='name'>Activity Name:</label>
                        <input id='name'
                            name='name'
                            value={activity.name}
                            placeholder='New Activity Name'
                            onChange={handleFieldChange}
                            required='required'
                            className={errors.name && "danger"}
                        ></input>
                        {errors.name && (<p className={s.danger}>{errors.name}</p>)}
                    </div>

                    <div className={s.formSection} >
                        <label htmlFor='difficulty'>Activity Difficulty:</label>
                        <select
                            id='difficulty'
                            name='difficulty'
                            value={activity.difficulty}
                            required='required'
                            className={errors.difficulty && "danger"}
                            onChange={handleFieldChange}>
                            <option value=''>Choose your Difficulty</option>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                            <option value='4'>4</option>
                            <option value='5'>5</option>
                        </select>
                        {errors.difficulty && (<p className={s.danger}>{errors.difficulty}</p>)}
                    </div>

                    <div className={s.formSection}>
                        <label htmlFor='name'>Activity Duration:</label>
                        <input name='duration'
                            type='number'
                            value={activity.duration}
                            placeholder='Minutes'
                            required='required'
                            className={errors.duration && "danger"}
                            onChange={handleFieldChange}
                        ></input>
                        {errors.duration && (<p className={s.danger}>{errors.duration}</p>)}
                    </div>

                    <div className={s.formSection}>
                        <label htmlFor='season'>Activity Season:</label>
                        <select
                            name='season'
                            value={activity.season}
                            required='required'
                            className={errors.season && "danger"}
                            onChange={handleFieldChange}>
                            <option value=''>Choose your Season</option>
                            <option value='Fall'>Fall</option>
                            <option value='Spring'>Spring</option>
                            <option value='Summer'>Summer</option>
                            <option value='Winter'>Winter</option>
                        </select>
                        {errors.season && (<p className={s.danger}>{errors.season}</p>)}
                    </div>

                    <div className={s.formSection}>
                        <label htmlFor='countries'>Countries: </label>
                        <select
                            name='countries'
                            className={errors.countries && "danger"}
                            onChange={addCountry}>
                            <option value=''>Choose your Countries</option>

                            {countries.sort((a, b) => {
                                if (a.name > b.name) return 1
                                else if (b.name > a.name) return -1
                                else return 0
                            }).map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {errors.countries && (<p className={s.danger}>{errors.countries}</p>)}
                        <br />
                        <button onClick={clearCountry}>Delete Countries</button>
                    </div>
                    <ul className={s.countryList}>{
                        activity
                            .countries
                            .map(countryId =>
                            (<li>{
                                countries.find(country => country.id == countryId).name
                            }</li>)
                            )
                    }</ul>
                    <br />

                    <div className={s.footerButtonsContainer}>
                        <button onClick={(e) => navigate(-1)}>Back</button>
                        &nbsp;&nbsp;&nbsp;
                        <button type='submit'>Add Activity</button>
                    </div>
                </form>
            </div>
        </>
    )
}