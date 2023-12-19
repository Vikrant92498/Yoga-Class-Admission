import React, { useEffect, useState } from 'react'
import './form.css'
const AdmissionForm = () => {
    const [name, setName] = useState();
    const [age, setAge] = useState(0);
    const [phone,setPhone] = useState("");
    const [batch, setBatch] = useState("");
    const [fromDate, setfromDate] = useState();
    const [toDate, setToDate] = useState();
    const [todayDate, setDate] = useState();
    const [message,setMessage] = useState("");
    function getStartAndEndDates() {
        const today = new Date(); // Get today's date
        setDate(today);
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        setfromDate(formattedStartDate);
        setToDate(formattedEndDate);
    }
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
     // eslint-disable-next-line
    useEffect(() => {
        getStartAndEndDates();
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(batch==="" || name==="" || phone===""){
            setMessage("All field are necessary");
            return;
        }
        //Validation of Age will done on server side as specified in requirements
        const response = await fetch('http://localhost:5000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, age,phone, batch ,price:500,todayDate}),
        });

        const result = await response.json();
        setMessage(result.message)
        
    };
    return (
        <div>
            <h1>Yoga Classes Admission Form</h1>
            <form>
                <div class="container">
                    <div class="card">
                        <div class="card-image">
                            <h2 class="card-heading">
                                Yoga Classes
                                <small>Admission Form</small>
                            </h2>
                        </div>
                        <form class="card-form">
                            <div class="input">
                                <input type="text" class="input-field" onChange={(e) => setName(e.target.value)} required />
                                <label class="input-label">Full name</label>
                            </div>
                            <div class="input">
                                <input type="number" class="input-field" onChange={(e) => setAge(e.target.value)} required />
                                <label class="input-label">Age</label>
                            </div>
                            <div class="input">
                                <input type="text" class="input-field" onChange={(e) => setPhone(e.target.value)} required />
                                <label class="input-label">Phone No(+91)</label>
                            </div>
                            <div class="input">
                                <input type="number" class="input-field" value="500" readOnly />
                                <label class="input-label-fee">Fees(in Rs.)</label>
                            </div>
                            <div class="input">
                                <select value={batch} onChange={(e) => setBatch(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option value="1">6-7AM</option>
                                    <option value="2">7-8AM</option>
                                    <option value="3">8-9AM</option>
                                    <option value="4">5-6PM</option>
                                </select>
                                <label class="input-label-fee">Select Batch</label>
                            </div>
                            <div class="input">
                                <input type="date" class="input-field" value={toDate} readOnly />
                                <input type="date" class="input-field" value={fromDate} readOnly />
                                <label class="input-label-fee">Duration</label>
                            </div>
                            <div class="action">
                                <button class="action-button" onClick={handleSubmit}>Pay Now</button>
                            </div>
                        </form>
                        <div class="card-info">
                            <p>{message}</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AdmissionForm
