import React,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import { About, AdminDash, ApplicationsForTrainer, AssignTrainer, AtendenceHistory, AttendancePage, BookingHistory, ContactPage, DietPage, EditPlan, Feedback, GymCardPage, GymPage, GymPlans, LogIn, Packages, PlanForm, PlansPage, RegisteredTrainer, RegisteredUser, SetDietPlan, SetWorkoutPlan, SignUp, TrainerApplicationForm, TrainerDash, UserDash, WorkoutPage } from '../Index.js'
import { Provider } from 'react-redux'
import store from './store/Store.js'
import Dashboard from './pages/Admin/Dashboard.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/about',
        element : <About />
      },
      {
        path: '/contact',
        element: <ContactPage />
      },
      {
        path: '/login',
        element: <LogIn />
      },
      {
        path: '/signup',
        element: <SignUp />
      },
      {
        path: '/admin',
        element: <AdminDash />,
        children: [
          {
           index: true,
          element: <Dashboard />
          },
          {
            path: 'total_packages',
            element: <Packages />
          },
          {
            path: 'plan_form',
            element: <PlanForm />
          },
          {
            path: 'edit_plan/:id',
            element: <EditPlan />
          },
          {
            path: 'registered_user',
            element: <RegisteredUser />
          },
          {
            path: 'applications_for_trainer',
            element: <ApplicationsForTrainer />
          },
          {
            path: 'assign_trainer/:userID/:gymID',
            element: <AssignTrainer />
          },
          {
            path: 'registered_trainer',
            element: <RegisteredTrainer />
          },
          {
            path: 'booking_history',
            element: <BookingHistory />
          },
          {
            path: 'feedback',
            element: <Feedback />
          },
          {
            path: 'atendence-history',
            element: <AtendenceHistory />
          }
        ]
      },
      
      {
        path: '/pricing',
        element: <PlansPage />
      },
      {
        path: '/member',
        element: <UserDash />
      },
      {
        path: '/workout',
        element: <WorkoutPage />
      },
      {
        path: '/attendance',
        element: <AttendancePage />
      },
      {
        path: '/trainer',
        element: <TrainerDash />
      },
      
      {
        path: '/gym_card',
        element: <GymCardPage />
      },
      {
        path: '/gyms/:gymId',
        element: <GymPage />
      },
      {
        path: '/trainer_application',
        element: <TrainerApplicationForm />
      },
      
      
      {
        path: '/gym_plans/:adminID',
        element: <GymPlans />
      },
      {
        path: '/set_diet_plan/:userID',
        element: <SetDietPlan />
      },
      {
        path: '/set_workout_plan/:userID',
        element: <SetWorkoutPlan />
      },
      {
        path: '/diet',
        element: <DietPage />
      },
      
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
