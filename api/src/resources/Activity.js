const { Country, Activity } = require ('../db.js');

async function getActivity (req, res) {
    const activities = await Activity.findAll()
    res.send(activities);
}

function createActivityValidation(req, res, next){
    const {
        countries,
        name,
        difficulty,
        duration,
        season
    } = req.body;

    const errors = [];
    
    if (Array.isArray(countries)){
        let errorFound = false;
        countries.forEach(c => {
            if (c.length != 3) errorFound = true;
        });

        if (errorFound) errors.push("some countries are not a valid id");
    }else errors.push("countries is not an array");

    if (name == null || name.length < 3) errors.push("name should at least be 3 characters long");

    if (!Number.isInteger(+difficulty) || difficulty < 1 || difficulty > 5)
        errors.push("difficulty should be an integer number between 1 and 5");

    if (!Number.isInteger(+duration) || duration < 1)
        errors.push("duration should be an integer number greater than 0");

    if (season == null)
        errors.push("season is missing")
    else{
        let cleanSeason = season.toLowerCase()
        if (cleanSeason != "summer" && cleanSeason != "winter" && cleanSeason != "fall" && cleanSeason != "spring")
            errors.push("season must be summer, winter, fall or spring");
    }

    if (errors.length > 0){
        res.status(400).send(errors);
    }else next();
}

async function createActivity (req, res) {
    const {
        countries,
        name,
        difficulty,
        duration,
        season
    } = req.body;
    const upperCaseCountries = countries.map(c => c.toUpperCase());
    const activity = await Activity.create({ name, difficulty, duration, season: season.toLowerCase() });
    const countriesDB = await Country.findAll({ where: { id: upperCaseCountries }});

    await countriesDB.forEach(async countryDB => await activity.addCountry(countryDB));
    
    res.status(200).send(activity);
}

module.exports = {
    getActivity,
    createActivity,
    createActivityValidation
}
