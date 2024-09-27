import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function HarvestSuccessRates() {
    const [rates, setRates] = useState([]);
    const location = useLocation();
    const userId = location.state?.userId;

    useEffect(() => {
        axios.get('http://localhost:8080/api/harvest/success-rates')
            .then(response => {
                setRates(response.data);
            
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div>
            <h1></h1>
            <table>
                <thead>
                    <tr>
                        <th>Mahalle</th>
                        <th>Ürün ve Başarı Oranı</th>
                    </tr>
                </thead>
                <tbody>
                    {rates.map((rate, index) => (
                        <tr key={index}>
                            <td>{rate.mahalle}</td>
                            <td>{rate.urun} <br />{rate.final_success_rate} </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default HarvestSuccessRates;
