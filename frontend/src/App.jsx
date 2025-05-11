import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './auth/Login'
import Signup from './auth/Signup'
import Home from './pages/Home'
import Profile from './pages/Profile'
import BookFlightDetails from './pages/Booking/BookFlightDetails'
import MyBookings from './pages/Booking/MyBookings'

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />
    }, 
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/users/profile/:name/v1/details/:id/summary',
      element: <Profile />
    },
    {
      path: '/users/booking-details/:name/v2/details/:airline/:from/to/:to/:flightId',
      element: <BookFlightDetails />
    },
    {
      path: '/users/:name/bookings/:id',
      element: <MyBookings />
    }
  ])
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App