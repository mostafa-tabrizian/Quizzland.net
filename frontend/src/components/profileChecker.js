import React, { useState, useEffect } from 'react'
import axios from 'axios'
import rateLimit from 'axios-rate-limit';

const axiosLimited = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 150 })

export const  ProfileDetail = async () => {
    try {
        const session = localStorage.getItem("signInSession")
        const username = session.split('"')[3]
        const grabProfile = await axiosLimited.get(`/dbAPI/profile/?username=${username}`)
        const profileData = grabProfile.data[0]
        return profileData
    } catch(err) {}  // Not Logged In
} 