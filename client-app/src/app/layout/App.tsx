import { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react'
import { Activity } from '../models/activity'
import NavBar from './NavBar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import LoadingComponent from './LoadingComponents'
import { useStore } from '../stores/store'
import { observer } from 'mobx-react-lite'
import { Outlet, useLocation } from 'react-router-dom'
import HomePage from '../../features/home/HomePage'
import { ToastContainer } from 'react-toastify'
import ModalContainer from '../common/modals/ModalContainer'

function App() {
  const location = useLocation()
  const {commonStore,userStore} = useStore()

  useEffect(()=>{
    if (commonStore.token) {
      userStore.getUser().finally(()=>commonStore.setAppLoaded())
    } else {
      commonStore.setAppLoaded()
    }
  },[commonStore,userStore])

  if(!commonStore.appLoaded) return <LoadingComponent content='Loading activities...' />

  return (
    <>
    <ModalContainer />
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      {location.pathname === '/' ? <HomePage />:(<>
      <NavBar />
      <Container style={{marginTop:'7em'}}>
        <Outlet />
      </Container>
      </>
      )
    }
    </>
  )

}

export default observer(App)
