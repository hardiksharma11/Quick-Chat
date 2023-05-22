import React, { useState } from 'react'
import { Container, Box } from '@mui/material';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel'
import Login from '../Components/Authentication/Login';
import SignUp from '../Components/Authentication/SignUp';


const HomePage = () => {

  const [colour,setColor]=useState(1)

  const handleLogin=()=>{
    setColor(1);
  }
  const handleSignup=()=>{
    setColor(2);
  }

  return (
    <Box sx={{position:'absolute',left:0,margin:'5%'}} >
      <Box m="auto"  sx={{ fontSize: '3vw', p: 2, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffffe0', height: '5%' }}>
        <h3>
        Quick Talk
        </h3>
      </Box>

      <Box m="auto" mt={2} sx={{ fontSize: '3vw', fontFamily: 'sans-serif', p: 2, borderRadius: 2, display: 'flex', justifyContent: 'center',  backgroundColor: '#ffffffe0'}}>
        <Tabs aria-label="Basic tabs" defaultValue={0} sx={{ borderRadius: 'lg'}}>
          <TabList>
            <Tab onClick={handleLogin} style={(colour===1) ?{backgroundColor:'#7a7a7a9e'}:{backgroundColor:'#d1d1d18a'}} >Login</Tab>
            <Tab onClick={handleSignup} style={(colour===2) ?{backgroundColor:'#7a7a7a9e'}:{backgroundColor:'#d1d1d18a'}} >Sign Up</Tab>
          </TabList>
          <Box >
          <TabPanel value={0} sx={{ p: 2 }}>
            <Login/>
          </TabPanel>
          <TabPanel value={1} mt={4} >
            <SignUp/>
          </TabPanel>
          </Box>
        </Tabs>
      </Box>
      
    </Box>
  )
}

export default HomePage