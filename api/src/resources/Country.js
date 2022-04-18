const axios = require('axios');
const { Country, Activity } = require ('../db.js')
const { Op } = require('sequelize');

function buildCountryObjectFromAPI(rawCountry){
    const flags = rawCountry.flags;

    let flag;
    if (flags.length > 0) flag = flags[0];
    else flag = null;
     
    const continents = rawCountry.continents;

    let continent;
    if (continents.length > 0) continent = continents[0];
    else continent = null;

    const capitals = rawCountry.capital;

    let capital;
    if (capitals!=null && capitals.length > 0) capital = capitals[0];
    else capital = null;

    return {
        id: rawCountry.cca3,
        name: rawCountry.name.common,
        flag,
        continent,
        capital, 
        subregion: rawCountry.subregion,
        area: rawCountry.area,
        population: rawCountry.population,
    }
}

function buildCountryObjectFromDB(dbCountry){
    return {
        id: dbCountry.id,
        flag: dbCountry.flag,
        name: dbCountry.name,
        continent: dbCountry.continent,
        activities: dbCountry.activities,
        population: dbCountry.population,
    }
}

async function getCountriesFromAPI(name){
    let url;
    if (name) url = 'https://restcountries.com/v3/name/' + name;
    else url = 'https://restcountries.com/v3/all';

    try{
        const apiCountries = await axios.get(url);
        return apiCountries.data;
    }catch(e){
        return [];
    }
}

async function getAllCountriesAPI(){
    const countriesRaw = await getCountriesFromAPI();
    return countriesRaw.map(country => buildCountryObjectFromAPI(country) );
}

async function getCountriesByName(name){
    const countriesRaw = await getCountriesFromAPI(name);
    return countriesRaw.map(country => buildCountryObjectFromAPI(country) );
}

async function getAllCountriesDB(){
    return await Country.findAll({include: Activity});
}

async function insertCountries(countries){
    await Country.bulkCreate(
        countries,
        { updateOnDuplicate: ["name", "flag", "continent", "capital", "subregion", "area", "population"] }
    );
}

async function getCountriesByNameDB(name){
    return await Country.findAll({
        include: Activity,
        where: {
            name: {
                [Op.iLike]:`%${name}%`
            }
        }
    })
}

async function getCountries(req, res){
    const name = req.query.name;
    
    if (name){
        const countries = await getCountriesByNameDB(name);
        if (countries.length > 0) res.send(countries);
        else res.status(404).send("No countries found");

        // const countries = await getCountriesByName(name);

        // if (countries.length > 0){
        //     await insertCountries(countries);
        //     const dbCountriesByName = await getCountriesByNameDB(name);
        //     res.send(dbCountriesByName);
        // }else
        //     res.status(404).send("No countries found");
    }else{
        const countriesDB = await getAllCountriesDB();
        if (countriesDB.length > 0){
            res.send(countriesDB.map(country => buildCountryObjectFromDB(country) ));
        }else{
            const countriesAPI = await getAllCountriesAPI();
            await insertCountries(countriesAPI);
            res.send(countriesAPI);
        }
    }
}

async function getCountryById(req, res){
    const { id } = req.params;

    if(id.length === 3){
        const country = await Country.findOne({
            where: { id: id.toUpperCase() },
            include: Activity
        });
        if (country) res.status(200).send(country);
        else res.status(404).send("Country not found");
    }else{
        res.status(400).send("Invalid country ID");
    }
}

module.exports = {
    getCountries,
    getCountryById
} 



