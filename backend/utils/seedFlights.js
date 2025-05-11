import Flight from '../models/flight.model.js';

const airlines = ['IndiGo', 'SpiceJet', 'Air India', 'Vistara'];
const locations = [
  { city: "Mumbai", airport: "Chhatrapati Shivaji Maharaj International Airport", iata: "BOM" },
  { city: "Delhi", airport: "Indira Gandhi International Airport", iata: "DEL" },
  { city: "Bengaluru", airport: "Kempegowda International Airport", iata: "BLR" },
  { city: "Hyderabad", airport: "Rajiv Gandhi International Airport", iata: "HYD" },
  { city: "Chennai", airport: "Chennai International Airport", iata: "MAA" },
  { city: "Kolkata", airport: "Netaji Subhas Chandra Bose International Airport", iata: "CCU" },
  { city: "Ahmedabad", airport: "Sardar Vallabhbhai Patel International Airport", iata: "AMD" },
  { city: "Kochi", airport: "Cochin International Airport", iata: "COK" },
  { city: "Pune", airport: "Pune Airport", iata: "PNQ" },
  { city: "Jaipur", airport: "Jaipur International Airport", iata: "JAI" },
  { city: "Lucknow", airport: "Chaudhary Charan Singh International Airport", iata: "LKO" },
  { city: "Guwahati", airport: "Lokpriya Gopinath Bordoloi International Airport", iata: "GAU" },
  { city: "Amritsar", airport: "Sri Guru Ram Dass Jee International Airport", iata: "ATQ" },
  { city: "Goa", airport: "Dabolim Airport", iata: "GOI" },
  { city: "Thiruvananthapuram", airport: "Trivandrum International Airport", iata: "TRV" },
  { city: "Nagpur", airport: "Dr. Babasaheb Ambedkar International Airport", iata: "NAG" },
  { city: "Varanasi", airport: "Lal Bahadur Shastri International Airport", iata: "VNS" },
  { city: "Patna", airport: "Jay Prakash Narayan Airport", iata: "PAT" },
  { city: "Indore", airport: "Devi Ahilyabai Holkar International Airport", iata: "IDR" },
  { city: "Srinagar", airport: "Sheikh Ul Alam International Airport", iata: "SXR" }
];
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPrice() {
  return Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
}

function getRandomDuration() {
  const hours = Math.floor(Math.random() * 3) + 1; // 1–3 hours
  const minutes = Math.floor(Math.random() * 60);
  return `${hours}h ${minutes}m`;
}

function getArrivalTime(departure, duration) {
  const [h, m] = duration.split('h ').map((v, i) => i === 0 ? parseInt(v) : parseInt(v.replace('m', '')));
  return new Date(departure.getTime() + h * 60 * 60 * 1000 + m * 60 * 1000);
}

function getFlightNumber(airline, fromIATA, toIATA, index) {
  const code = airline.slice(0, 2).toUpperCase();
  return `${code}${fromIATA}${toIATA}${index}`;
}

export const generateSampleFlights = async () => {
  const flights = [];

  for (const from of locations) {
    for (const to of locations) {
      if (from.iata !== to.iata) {
        for (let i = 0; i < 10; i++) {
          const airline = getRandomItem(airlines);
          const basePrice = getRandomPrice();
          const departure = new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000);
          const duration = getRandomDuration();
          const arrival = getArrivalTime(departure, duration);
          const totalSeats = 180;
          const availableSeats = Math.floor(Math.random() * totalSeats);

          flights.push({
            airline,
            flightNumber: getFlightNumber(airline, from.iata, to.iata, i),
            from,
            to,
            departureTime: departure,
            arrivalTime: arrival,
            duration,
            basePrice,
            currentPrice: basePrice,
            totalSeats,
            availableSeats,
            priceResetAt: null
          });
        }
      }
    }
  }

  await Flight.insertMany(flights);
  return flights.length;
};