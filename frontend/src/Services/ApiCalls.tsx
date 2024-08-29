import React from 'react';

const userId = '66cf25ac0a13f13b3773babe';

export const GetGiftCards = async () => {
    const response = await fetch(`http://localhost:2323/users/${userId}/giftcards`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();    
    console.log(data);
    return data;
};

export const ExpiringGiftCards = async () => {
    const response = await fetch(`http://localhost:2323/users/${userId}/expiring-time`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();    
    console.log(data);
    return data;
};


export const setExpiringGiftCards = async (id: string, expirationDate: string) => {
    const response = await fetch(`http://localhost:2323/users/${id}/notification-time`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationTime: expirationDate })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
    }

    let data;
    if (response.headers.get('content-type')?.includes('application/json')) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    console.log(data);
    return data;
};