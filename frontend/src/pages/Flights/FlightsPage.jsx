// Importing necessary libraries and components
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Select from 'react-select';
import { useDarkMode } from '../../context/ThemeContext';
import { SearchIcon, SpinnerIcon, AirplaneIcon } from '../../components/Icons';
import { FLIGHT_API_END_POINT } from '../../utils/constant';
import FlightCard from './FlightCard';
import { setFlight } from '../../redux/flightSlice';
import { useNavigate } from 'react-router-dom';

const FlightsPage = () => {
  const { darkMode } = useDarkMode(); // Accessing dark mode context
  const { token, user } = useSelector(store => store.auth); // Getting token and user from Redux store
  const [searchLoading, setSearchLoading] = useState(false); // State for search loading
  const [selectLoading, setSelectLoading] = useState(false); // State for select loading
  const [error, setError] = useState(''); // State for error messages
  const [flights, setFlights] = useState([]); // State for flights data
  const [airports, setAirports] = useState([]); // State for airport suggestions
  const [formData, setFormData] = useState({
    from: '', // Origin airport
    to: '', // Destination airport
  });
  const { flight, flightInput } = useSelector(store => store.flight); // Getting flight data from Redux store
  const dispatch = useDispatch(); // Redux dispatch function
  const navigate = useNavigate(); // React Router navigation

  // Effect to clear flights when origin or destination is not selected
  useEffect(() => {
    if (!formData.from || !formData.to) {
      setFlights([]);
      dispatch(setFlight([]));
    }
  }, [formData.from, formData.to, dispatch]);

  // Debounce function to limit API calls
  const debounce = (func, delay = 500) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch airport/city suggestions from API
  const fetchAirports = async (query) => {
    try {
      const tokenResponse = await axios.get(`${FLIGHT_API_END_POINT}/amadeus/token`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSelectLoading(true);
      const response = await axios.get(
        'https://test.api.amadeus.com/v1/reference-data/locations',
        {
          params: {
            subType: 'CITY,AIRPORT', // Fetching both city and airport
            keyword: query,
            countryCode: 'IN', // Restricting to India
          },
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
          },
        }
      );
      return response.data.data.map((item) => ({
        value: item.iataCode || item.address.cityCode,
        label: `${item.name} (${item.iataCode || item.address.cityCode}) - ${item.subType}`,
        type: item.subType,
        city: item.address.cityName,
        country: item.address.countryCode,
      }));
    } catch (err) {
      console.error('Airport search error:', err.response?.data || err.message);
      return [];
    } finally {
      setSelectLoading(false);
    }
  };

  // Debounced fetch function for airport suggestions
  const debouncedFetch = debounce(async (query, callback) => {
    if (query.length < 3) return callback([]); // Minimum 3 characters to search
    const results = await fetchAirports(query);
    callback(results);
  }, 300);

  // Handle flight search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.from || !formData.to) {
      setError('Please select both origin and destination'); // Validation for empty fields
      return;
    }

    try {
      setSearchLoading(true);
      const response = await axios.get(`${FLIGHT_API_END_POINT}/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...formData }
      });

      setFlights(response.data.flights);
      dispatch(setFlight(response.data.flights)); // Update Redux store
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch flights'); // Handle errors
    } finally {
      setSearchLoading(false);
    }
  };
  console.log(flightInput)

  return (
    <div className={`min-h-screen p-6 md:p-10 ${darkMode ? 'bg-zinc-900 text-white' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Search Form */}
        <form onSubmit={handleSearch} className={`mb-8 p-6 rounded-xl shadow-lg ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Origin Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">From</label>
              <Select
                isLoading={selectLoading}
                options={airports}
                onInputChange={(value) => {
                  debouncedFetch(value, (results) => setAirports(results));
                }}
                onChange={(selected) => setFormData({ ...formData, from: selected.value })}
                styles={customSelectStyles(darkMode)}
                placeholder="Search city or airport..."
                noOptionsMessage={({ inputValue }) =>
                  inputValue.length < 3 ? 'Type at least 3 characters' : 'No results found'
                }
                formatOptionLabel={({ label, type, city, country }) => (
                  <div className="flex flex-col">
                    <span className="font-medium">{label}</span>
                    <span className="text-sm text-gray-500">
                      {type === 'AIRPORT' ? 'Airport' : 'City'} - {city}, {country}
                    </span>
                  </div>
                )}
              />
            </div>

            {/* Destination Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">To</label>
              <Select
                isLoading={selectLoading}
                options={airports}
                onInputChange={(value) => {
                  debouncedFetch(value, (results) => setAirports(results));
                }}
                onChange={(selected) => setFormData({ ...formData, to: selected.value })}
                styles={customSelectStyles(darkMode)}
                placeholder="Search city or airport..."
                noOptionsMessage={({ inputValue }) =>
                  inputValue.length < 3 ? 'Type at least 3 characters' : 'No results found'
                }
                formatOptionLabel={({ label, type, city, country }) => (
                  <div className="flex flex-col">
                    <span className="font-medium">{label}</span>
                    <span className="text-sm text-gray-500">
                      {type === 'AIRPORT' ? 'Airport' : 'City'} - {city}, {country}
                    </span>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={searchLoading}
            className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all 
              ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white
              ${searchLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {searchLoading ? (
              <>
                <SpinnerIcon className="animate-spin h-5 w-5" />
                Searching...
              </>
            ) : (
              <>
                <SearchIcon className="h-5 w-5" />
                Search Flights
              </>
            )}
          </button>
        </form>

        {/* Results Section */}
        {error && (
          <div className={`p-4 mb-4 rounded-lg ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
            {error}
          </div>
        )}

        {/* Flight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {flight?.map((flight) => (
            <FlightCard key={flight._id} flight={flight} darkMode={darkMode} />
          ))}
        </div>

        {/* No Flights Found Message */}
        {flights?.length === 0 && !searchLoading && (
          <div className={`text-center p-8 rounded-xl ${darkMode ? 'bg-zinc-800 text-gray-400' : 'bg-white text-gray-600'}`}>
            <AirplaneIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg">No flights found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom styles for react-select
const customSelectStyles = (darkMode) => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: darkMode ? '#1f2937' : 'white',
    borderColor: darkMode ? '#374151' : '#d1d5db',
    minHeight: '44px',
  }),
  input: (provided) => ({
    ...provided,
    color: darkMode ? 'white' : '#1f2937',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: darkMode ? 'white' : '#1f2937',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: darkMode ? '#1f2937' : 'white',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? (darkMode ? '#374151' : '#f3f4f6')
      : darkMode ? '#1f2937' : 'white',
    color: darkMode ? 'white' : '#1f2937',
  }),
});

export default FlightsPage;
