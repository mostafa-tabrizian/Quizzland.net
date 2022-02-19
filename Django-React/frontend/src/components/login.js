import React, { Component, useEffect } from "react";
;
import { log } from './base'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { username: "", password: "" };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem('access_token')) {
            window.location.href = '/'
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        try {
            const data = await axios.post('api/token/obtain/', {
                username: this.state.username,
                password: this.state.password
            });
            
            axios.defaults.headers['Authorization'] = "JWT " + data.access;
            localStorage.setItem('access_token', data.data.access);
            localStorage.setItem('refresh_token', data.data.refresh);
            window.location.href = '/'
        } catch (error) {
            throw error;
        }
    }

    async handleLogout() {
        try {
            const response = await axiosInstance.post('api/blacklist/', {
                "refresh_token": localStorage.getItem("refresh_token")
            });
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            return response;
        }
        catch (e) {
            console.log(e);
        }
    };

    render() {
        return (
            <div className="text-center login min-h-screen">
                {/* <h1 className="text-[3rem] text-white text-center">
                    مرکز کنترل تماس های فوریت های سایبری
                </h1> */}
                <div className='backdrop-blur-20 w-[24rem] text-[20px] rounded-lg center bg-[#ffffff52]'>
                    <form className='grid justify-center space-y-5 p-8'>
                        <span className='p-3 absolute top-[-2.5rem] rounded-3xl right-[9.7rem] bg-[#287E7D]'>
                            <svg className="h-12 w-12 text-white" width="12" height="12" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <rect x="5" y="11" width="14" height="10" rx="2" />  <circle cx="12" cy="16" r="1" />  <path d="M8 11v-4a4 4 0 0 1 8 0v4" /></svg>
                        </span>
                        <label>
                            <input name="username" className='rounded-lg p-2' type="text" placeholder='نام کاربری' value={this.state.username} onChange={this.handleChange} />
                        </label>
                        <label>
                            <input name="password" className='rounded-lg p-2' type="password" placeholder="رمز عبور" value={this.state.password} onChange={this.handleChange} />
                        </label>
                        <input onClick={this.handleSubmit} className='bg-[#287E7D] p-2 rounded-lg text-white font-semibold' type="submit" value="تایید" />
                        <button onClick={this.handleLogout}>خروج</button>
                    </form>
                </div>
            </div>
        )
    }
}
export default Login;