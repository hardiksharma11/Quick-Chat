import React, { useState, useContext } from 'react'
import { TextField, Button } from '@mui/material';
import { useHistory } from "react-router-dom";
import Notify from '../Misc/Notify';
import ChatContext from '../../Context/Chats/ChatContext';
import '../../App.css'


const Login = () => {
  const context = useContext(ChatContext);
  const { setUser } = context;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();


  const handleSubmit = async () => {


    const data = {
      email, password
    }

    if (!email || !password) {
      return Notify("Please fill all the fields", "error");
    }

    const url = "http://localhost:5000/api/user/login"
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(data)
    });


    const json = await response.json();
    if (!json.success) {
      return Notify(json.message, "error");
    }


    localStorage.setItem("userInfo", JSON.stringify(json));
    setUser(json)
    Notify("Login Successfull", "success");
    history.push('/chats')




  }

  return (
    <div>
      <form>

        <TextField
          name="email"
          variant="outlined"
          value={email}
          required
          fullWidth
          id="email"
          label="Email Address"

          sx={{ margin: '6px 0px' }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          variant="outlined"
          required
          value={password}
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          sx={{ margin: '6px 0px' }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={{ margin: '8px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button variant="contained" onClick={handleSubmit}
            className='myButton'
          >Login</Button>
        </div>
      </form>


    </div>
  )
}

export default Login