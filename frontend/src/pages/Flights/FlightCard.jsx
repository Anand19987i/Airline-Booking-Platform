  import React from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { setSingleFlight } from '../../redux/flightSlice';
  import { Link } from 'react-router-dom';

  const FlightCard = ({ flight, darkMode }) => {
    const { user } = useSelector(store => store.auth); // Get the current user from the Redux store
    const dispatch = useDispatch(); // Initialize the Redux dispatch function

    // Helper function to format the departure time into a readable format
    const formatTime = (dateString) => {
      const options = { hour: 'numeric', minute: '2-digit', hour12: true };
      return new Date(dateString).toLocaleTimeString('en-US', options);
    };

    // Dispatch the selected flight to the Redux store when booking is initiated
    const handleBook = () => {
      dispatch(setSingleFlight(flight));
    };

    return (
      <div className={`flex flex-col md:flex-row items-stretch justify-between p-4 rounded-lg shadow-lg hover:shadow-xl transition-all 
        md:h-32 lg:h-36  /* Fixed height for rectangular shape on larger screens */
        ${darkMode ? 'bg-zinc-800 hover:bg-zinc-750' : 'bg-white hover:bg-gray-50'}`}>

        {/* Airline and Route Info */}
        <div className="flex-1 min-w-[30%] md:pr-4 md:flex md:flex-col md:justify-center">
          <div className="space-y-1">
            <h3 className="text-base font-semibold truncate">{flight.airline}</h3> {/* Airline name */}
            <p className="text-xs font-medium text-blue-500">Flight No: {flight.flightNumber}</p> {/* Flight number */}
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
              {flight.from.city} ({flight.from.iata}) → {flight.to.city} ({flight.to.iata}) {/* Route info */}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} truncate`}>
              {flight.from.airport} → {flight.to.airport} {/* Airport names */}
            </p>
          </div>
        </div>

        {/* Departure Time */}
        <div className="md:w-24 lg:w-32 flex items-center justify-center  md:px-4">
          <div className="text-center">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Departure</p> {/* Label */}
            <p className="text-base font-medium mt-1">{formatTime(flight.departureTime)}</p> {/* Formatted time */}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="md:w-48 lg:w-56 flex flex-col justify-center items-end md:items-center md:pl-4">
          <div className="w-full flex flex-col items-end md:items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{flight.currentPrice.toFixed(0)} INR</span> {/* Current price */}
              {flight.currentPrice > flight.basePrice && (
                <span className={`line-through text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {flight.basePrice} INR {/* Base price if current price is higher */}
                </span>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-[10px] mt-1 ${flight.currentPrice > flight.basePrice
                ? 'bg-red-100 text-red-800' // High demand indicator
                : 'bg-green-100 text-green-800' // Good price indicator
              }`}>
              {flight.currentPrice > flight.basePrice ? 'High Demand' : 'Good Price'}
            </span>
            <Link
              to={`/users/booking-details/${user?.name}/v2/details/${flight?.airline}/${flight?.from?.city}/to/${flight?.to?.city}/${flight?._id}`}
              onClick={handleBook} // Trigger booking action
              className={`mt-2 px-4 py-2 rounded-lg font-medium transition-colors text-xs 
                ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} 
                text-white w-full md:w-auto text-center`}
            >
              Book Now {/* Call-to-action button */}
            </Link>
          </div>
        </div>
      </div>
    );
  };

  export default FlightCard; // Export the FlightCard component