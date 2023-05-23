import React, { useState, useContext } from 'react'
import { TextField, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Notify from '../Misc/Notify';
import { useHistory } from "react-router-dom";
import ChatContext from '../../Context/Chats/ChatContext';

const HOST = process.env.REACT_APP_HOST;
const SignUp = ({ setLoading2 }) => {

    const context = useContext(ChatContext);
    const { setUser } = context;

    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
    })

    const [pic, setPic] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    const handleSubmit = async () => {

        if (!inputs.name || !inputs.email || !inputs.password || !inputs.confirmpassword) {
            return Notify("Please fill all the fields", "error");
        }

        if (inputs.password !== inputs.confirmpassword) {
            return Notify("Password and Confirm Password do not match", "error");
        }
        setLoading2(true);
        try {

            const data = {
                name: inputs.name,
                email: inputs.email,
                password: inputs.password,
                pic: pic

            }
            const url = `${HOST}/api/user/`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(data)
            });
            const json = await response.json();

            if (!json.success) {
                setLoading2(false);
                return Notify(json.message, "error");
            }

            localStorage.setItem("userInfo", JSON.stringify(json));
            setUser(json)
            setLoading2(false);
            Notify("Successfully Registered", "success");
            history.push('/chats')

        } catch (error) {
            Notify(`${error.message}`, "error");
        }

        setLoading2(false);
    }

    const postDetails = (pic) => {
        setLoading(true);
        if (pic === undefined) {
            Notify("Not Found", "error");
            setLoading(false);
            return;
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png" || pic.type === "image/jpg") {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "MERN-Chat-App");
            data.append("cloud_name", "dcmqewoxn")

            fetch('https://api.cloudinary.com/v1_1/dcmqewoxn/image/upload', {
                method: "POST",
                body: data
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                })



        }

        else {
            Notify("Please select an image", "error");
            setLoading(false);
        }
    }
    return (
        <Box maxWidth='420px' >
            <form>
                <TextField
                    name="name"
                    value={inputs.name}
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoFocus
                    sx={{ margin: '6px 0px' }}
                    onChange={handleChange} />
                <TextField
                    name="email"
                    value={inputs.email}
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    sx={{ margin: '6px 0px' }}
                    onChange={handleChange}
                />

                <TextField
                    variant="outlined"
                    value={inputs.password}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    sx={{ margin: '6px 0px' }}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="confirmpassword"
                    value={inputs.confirmpassword}
                    label="Confirm Password"
                    type="password"
                    id="cassword"
                    sx={{ margin: '6px 0px' }}
                    onChange={handleChange} />


                <input type="file" accept="image/*" style={{ margin: '6px 0px' }} name="pic" onChange={(e) => { postDetails(e.target.files[0]) }} />

                <div style={{ margin: '8px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingButton variant="contained" loading={loading} onClick={handleSubmit} className='myButton'>Submit</LoadingButton>
                </div>
            </form>
        </Box>
    )
}

export default SignUp