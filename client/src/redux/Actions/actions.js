import axios from "axios";
import {
    GET_ALL_COUNTRIES,
    SEARCH_COUNTRY_BY_NAME,
    COUNTRY_DETAIL,
    GET_ACTIVITIES,
    POST_ACTIVITIES,
    UPDATE_DISPLAYEDCOUNTRIES } from "./actionsTypes";

export function getAllCountries() {
    return async function(dispatch){
        try{
            const countries = await axios.get('http://localhost:3001/countries');
            return dispatch({
                type: GET_ALL_COUNTRIES,
                payload: countries.data
            });
        }catch(e){
            alert("Unknown error while loading countries. More info in the browser console.");
            console.log(e)
        }
    }
};

export function searchCountriesByName(name) {
    return async function (dispatch) {
        try{
            const response = await axios.get(`http://localhost:3001/countries?name=${name}`);
            return dispatch({
                type: SEARCH_COUNTRY_BY_NAME,
                countries: response.data,
                nameFilter: name
            })
        }catch(e){
            if (e.response.status === 404)
                alert("No countries were found matching "+name);
            else{
                alert("Unknown error while searching countries by name. More info in the browser console.");
                console.log(e)
            }
        }
    }
}

export function countryDetail(id) {
    return async function (dispatch) {
        try{
            const response = await axios.get(`http://localhost:3001/countries/${id}`);
            return dispatch({
                type: COUNTRY_DETAIL,
                payload: response.data,
            })
        }catch(e){
            alert("Unknown error while loading the country details. More info in the browser console.");
            console.log(e);
        }
    }
}

export function getActivities() {
    return async function (dispatch) {
        try{
            const response = await axios.get('http://localhost:3001/activities');
            return dispatch({
                type: GET_ACTIVITIES,
                payload: response.data,
            })
        }catch(e){
            alert("Unknown error while loading activities. More info in the browser console.");
            console.log(e);
        }
    }
}

export async function postActivity({name, difficulty, duration, season, countries}) {
    try{
        const response = await axios.post(
            'http://localhost:3001/activity',
            {name, difficulty: +difficulty, duration: +duration, season, countries}
        );

        return {
            type: POST_ACTIVITIES,
            payload: response.data,
        };

    }catch(e){
        alert("Unknown error while creating activity. More info in the browser console.");
        console.log(e);
        return null;
    }
}

export function updateDisplayedcountries(
    continentFilter,
    activityFilter,
    orderBy,
    orderDir,
    page
){
    return {
        type: UPDATE_DISPLAYEDCOUNTRIES,
        payload: { 
            continentFilter,
            activityFilter,
            orderBy,
            orderDir,
            page
        }
    }
}

