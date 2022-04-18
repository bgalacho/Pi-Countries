import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCountries, getActivities, updateDisplayedcountries, searchCountriesByName } from '../../redux/Actions/actions';
import CountryCard from '../CountryCard/CountryCard'
import { COUNTRIES_PER_PAGE } from '../../redux/Reducer/reducer';
import Pagination from '../Pagination/Pagination';
import NavBar from '../NavBar/NavBar';
import s from './home.module.css';

export default function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const [continentFilter, setContinentFilter] = useState("all");
    const [activityFilter, setActivityFilter] = useState("all");
    const [orderBy, setOrderBy] = useState("name");
    const [orderDir, setOrderDir] = useState("asc");
    const [name, setName] = useState('')

    const countries = useSelector(s => s.allCountries);
    const activities = useSelector(s => s.allActivities);
    const countriesCount = useSelector(s => s.countriesCount);
    const displayedCountries = useSelector(s => s.displayedCountries);
    const nameFilter = useSelector(s => s.nameFilter);

    const dispatch = useDispatch();

    useEffect(() => {
        if (countries.length === 0) dispatch(getAllCountries());
        if (activities.length === 0) dispatch(getActivities());
    }, []);

    function resetListConfigUI(){
        const orderByUI = document.getElementById("orderBy");
        const orderDirUI = document.getElementById("orderDir");
        const continentFilterUI = document.getElementById("continentFilter");
        const activityFilterUI = document.getElementById("activityFilter");

        orderByUI.value="name";
        orderDirUI.value="asc";
        continentFilterUI.value="all";
        activityFilterUI.value="all";

        setOrderBy("name");
        setOrderDir("asc");
        setContinentFilter("all");
        setActivityFilter("all");
        setCurrentPage(1);
    }

    function loadCountries(e) {
        dispatch(getAllCountries());
        resetListConfigUI();
        document.getElementById("searchInput").value="";
    }

    function handleFilterContinents(e) {
        dispatch(updateDisplayedcountries(
            e.target.value,
            activityFilter,
            orderBy,
            orderDir,
            1
        ));
        setContinentFilter(e.target.value)
        setCurrentPage(1)
    }
    function handleFilterByActivity(e) {
        dispatch(updateDisplayedcountries(
            continentFilter,
            e.target.value,
            orderBy,
            orderDir,
            1
        ));
        setActivityFilter(e.target.value)
        setCurrentPage(1)
    }
    function handleOrderDir(e) {
        dispatch(updateDisplayedcountries(
            continentFilter,
            activityFilter,
            orderBy,
            e.target.value,
            currentPage
        ));
        setOrderDir(e.target.value)
    }
    function handleOrderBy(e) {
        dispatch(updateDisplayedcountries(
            continentFilter,
            activityFilter,
            e.target.value,
            orderDir,
            currentPage
        ));
        setOrderBy(e.target.value)
    }

    function nextPage(){
        dispatch(updateDisplayedcountries(
            continentFilter,
            activityFilter,
            orderBy,
            orderDir,
            currentPage+1
        ));
        setCurrentPage(currentPage+1)
    }

    function prevPage(){
        dispatch(updateDisplayedcountries(
            continentFilter,
            activityFilter,
            orderBy,
            orderDir,
            currentPage-1
        ));
        setCurrentPage(currentPage-1)
    }

    function performSearch(){
        if(name){
            dispatch(searchCountriesByName(name));
            resetListConfigUI();
        }
    }

    function updateSearchTerm(e){
        setName(e.target.value)
    }

    const clearFilterByName = nameFilter? (<>
        Showing countries matching {nameFilter}<br /><br />
        <button className={s.btn} onClick={loadCountries}>Clear name filter</button>
    </>):""

    return (
        <div className={s.container}>
            <NavBar />

            <br></br>
            
            <input 
                id="searchInput"
                className={s.input}
                type='text'
                autocomplete="off"
                onChange={updateSearchTerm}
                placeholder='Country´s Name...'/>

            <button className={s.btn} onClick={performSearch}>Search</button>

            <br></br>

            {clearFilterByName}
            
            <br />
            
            <div>                   

                <select className={s.filter}  id="orderBy" onChange={handleOrderBy}>
                    <option value="name">Name</option>
                    <option value="population">Population</option>
                </select>

                <select className={s.filter} id="orderDir" onChange={handleOrderDir}>
                    <option value="asc">Ascendant</option>
                    <option value="desc">Descendant</option>
                </select>

                <br /><br />

                <select className={s.filter} id="continentFilter" onChange={handleFilterContinents}>
                    <option value="all">Continents</option>
                    <option value="Africa">Africa</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="North America">North America</option>
                    <option value="Oceania">Oceania</option>
                    <option value="South America">South America</option>
                    <option value="Antartica">Antartica</option>
                </select>

                <select className={s.filter} id="activityFilter" onChange={handleFilterByActivity}>
                    <option value="all">Activities</option>
                    {activities.map(activity => (<option value={activity.id}>{activity.name}</option>))}
                </select>

                <br /><br />

                {
                    displayedCountries?.length === 0? (<span>No countries were found with that criteria</span>)
                    :<>
                        <Pagination
                            page={currentPage}
                            rpp={COUNTRIES_PER_PAGE}
                            total={countriesCount}
                            nextPageCB={nextPage}
                            prevPageCB={prevPage} />

                        <div className={s.countryContainer}>
                            {displayedCountries?.map(country => {
                                return (
                                    <div>
                                        <Link to={"/country/" + country.id}>
                                            <CountryCard
                                                name={country.name}
                                                flag={country.flag}
                                                continent={country.continent}
                                                key={country.id} />
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>

                        <Pagination
                            page={currentPage}
                            rpp={COUNTRIES_PER_PAGE}
                            total={countriesCount}
                            nextPageCB={nextPage}
                            prevPageCB={prevPage} />
                    </>
                }
            </div>
        </div>
    )
}