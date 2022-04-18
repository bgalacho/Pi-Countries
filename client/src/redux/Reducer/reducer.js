import {
    GET_ALL_COUNTRIES,
    SEARCH_COUNTRY_BY_NAME,
    COUNTRY_DETAIL,
    GET_ACTIVITIES,
    POST_ACTIVITIES,
    UPDATE_DISPLAYEDCOUNTRIES
} from "../Actions/actionsTypes";

export const COUNTRIES_PER_PAGE = 10;

const initialState = {
    allCountries: [],
    allActivities: [],
    countryDetail: null,
    countriesCount: 0,
    displayedCountries: [],
    nameFilter: null
}

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_COUNTRIES:{
            const allCountries = action.payload
            const [ displayedCountries, countriesCount ] = buildDiplayedCountries(
                allCountries,
                'all',
                'all',
                'name',
                'asc',
                1
            );

            return {
                ...state,
                allCountries,
                displayedCountries,
                countriesCount,
                nameFilter: null
            }
        }
        case SEARCH_COUNTRY_BY_NAME:{
            const allCountries = action.countries
            const [ displayedCountries, countriesCount ] = buildDiplayedCountries(
                allCountries,
                'all',
                'all',
                'name',
                'asc',
                1
            );

            return {
                ...state,
                allCountries,
                displayedCountries,
                countriesCount,
                nameFilter: action.nameFilter
            }
        }
        case COUNTRY_DETAIL:
            return {
                ...state,
                countryDetail: action.payload
            }
        case POST_ACTIVITIES:
            return {
                ...state,
                allActivities: [...state.allActivities, action.payload],
            }
        case GET_ACTIVITIES:
            return {
                ...state,
                allActivities: action.payload,
            }
        case UPDATE_DISPLAYEDCOUNTRIES:{
            const { continentFilter, activityFilter, orderBy, orderDir, page } = action.payload;
            const countries = state.allCountries;

            console.log(
                "ACTION: UPDATE_DISPLAYEDCOUNTRIES:" +
                "\nCC: " + countries.length +
                "\nCF: " + continentFilter +
                "\nAF: " + activityFilter +
                "\nOB: " + orderBy +
                "\nOD: " + orderDir +
                "\nPG: " + page
            )

            const [ displayedCountries, countriesCount ] = buildDiplayedCountries(
                countries,
                continentFilter,
                activityFilter,
                orderBy,
                orderDir,
                page
            )

            return {
                ...state,
                countriesCount,
                displayedCountries,
            }
        }
        default:
            return state;
    }
}

function buildDiplayedCountries(countries, continentFilter, activityFilter, orderBy, orderDir, page){
    const filteredCountries = countries
    ?.filter(country => {
        const continentCondition = continentFilter === "all" || country?.continent === continentFilter;
        const activityCondition = activityFilter === "all" || country?.activities?.find(activity => activity.id === activityFilter) != null
        return continentCondition && activityCondition;
    })
    ?.sort((a, b) => {
        let condition1;
        let condition2;
        switch(orderBy){
            case "name":
                condition1 = a.name > b.name
                condition2 = b.name > a.name
                break;
            case "population":
                condition1 = a.population > b.population
                condition2 = b.population > a.population
                break;
            default:
                condition1 = true
                condition2 = false
                break;
        }

        const asc = orderDir === "asc"
       
        if (condition1){
            if (asc) return 1
            else return -1
        }else if (condition2){
            if (asc) return -1
            else return 1
        }else return 0
    });
    
    const countriesCount = filteredCountries.length;

    const begin = page * COUNTRIES_PER_PAGE - COUNTRIES_PER_PAGE;
    const end = begin + COUNTRIES_PER_PAGE;

    const displayedCountries = filteredCountries?.slice(begin, end);

    return [displayedCountries, countriesCount];
}

export default rootReducer




