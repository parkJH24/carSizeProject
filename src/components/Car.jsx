import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Car = () => {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);

    // 로그인하고 JWT 토큰을 받아오는 함수

    const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy';
    console.log(PROXY)
    const URL = `${PROXY}/api/auth/login`;
    const loginAndGetJwt = async () => {
        try {
            const response = await axios.post(URL, {
                api_token: '899e21dc-eb81-4928-9bed-76d2f1c95dd4', // 여기에 실제 API 토큰을 입력하세요
                api_secret: 'f01bd5389490bb61f212206f6b606662'    // 여기에 실제 API 시크릿을 입력하세요
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data.jwt)
            return response.data.jwt; // JWT 반환
        } catch (error) {
            console.error('Login error', error);
            return null;
        }
    }

    // JWT를 사용하여 모델 데이터를 가져오는 함수
    const fetchCarModels = async (jwt) => {
        try {
            const response = await axios.get(`${PROXY}/api/models`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            });
            return response.data; // 모델 데이터 반환
        } catch (error) {
            console.error('Error fetching car models', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const jwt = await loginAndGetJwt();
            if (jwt) {
                const modelsData = await fetchCarModels(jwt);
                setModels(modelsData);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                models.map((model, index) => (
                    <div key={index}>
                        <h3>{model.name}</h3>
                        {/* 모델에 관한 추가 정보 표시 */}
                    </div>
                ))
            )}
        </div>
    );
};

export default Car
