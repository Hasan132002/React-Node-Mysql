import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EmployeeDetail = () => {
    const [employee, setEmployee] = useState([]) 
    const { salary } = useParams() // Use salary as the URL parameter
    const navigate = useNavigate()
    
    useEffect(() => {
        // Fetch employee details based on salary
        axios.get(`https://react-node-mysql-production.up.railway.app/employee/detail/${salary}`)
        .then(result => {
            setEmployee(result.data.Result) // Assuming result.data.Result has the employee data
        })
        .catch(err => console.log(err))
    }, [salary]) // Trigger re-fetching when salary changes

    const handleLogout = () => {
        axios.get('https://react-node-mysql-production.up.railway.app/employee/logout')
        .then(result => {
          if(result.data.Status) {
            localStorage.removeItem("valid")
            navigate('/')
          }
        }).catch(err => console.log(err))
    }

    return (
        <div>
            <div className="p-2 d-flex justify-content-center shadow">
                <h4>Employee Management System</h4>
            </div>
            <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
                <img 
                    src={`https://react-node-mysql-production.up.railway.app/Images/` + employee.image} 
                    alt={employee.name} 
                    className='emp_det_image'
                />
                <div className='d-flex align-items-center flex-column mt-5'>
                    <h3>Name: {employee.name}</h3>
                    <h3>Email: {employee.email}</h3>
                    <h3>Salary: ${employee.salary}</h3> {/* Display Salary here */}
                </div>
                <div>
                    <button className='btn btn-primary me-2'>Edit</button>
                    <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default EmployeeDetail
