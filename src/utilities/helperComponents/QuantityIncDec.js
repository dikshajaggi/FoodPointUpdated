import React, { useContext, useEffect, useState } from 'react';
import './helperStyles.css';
import { useDispatch } from 'react-redux';
import { setItemQuantityDec, setItemQuantityInc } from '../redux/cartSlice';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { Context } from '../context/Context';

const QuantityIncDec = (props) => {
    const dispatch = useDispatch();
    const [itemQty, setItemQty] = useState();
    const { userId } = useContext(UserContext);
    const context = useContext(Context);
    const localStorageItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    const updateCart = async (updateType) => {
        const data = {
            id: props.id,
            type: updateType,
        };
        await api.updateCartItems(userId, data);
    };

    const updateLocalStorage = (items) => {
        localStorage.setItem('cartItems', JSON.stringify(items));
    };

    const increase = async (id) => {
        setItemQty((prevQty) => prevQty + 1);
        dispatch(setItemQuantityInc(id));
        const itemIndex = localStorageItems.findIndex((item) => item.menu.id === id);
        if (itemIndex !== -1) {
            const updatedItem = {
                ...localStorageItems[itemIndex],
                quantity: localStorageItems[itemIndex].quantity + 1,
            };
            localStorageItems[itemIndex] = updatedItem;
            updateLocalStorage(localStorageItems);
        }
        context.setQtyUpdated(!context.qtyUpdated);
        await updateCart('inc');
    };

    const decrease = async (id) => {
        if (itemQty >= 2) {
            setItemQty((prevQty) => prevQty - 1);
            dispatch(setItemQuantityDec(id));
            const itemIndex = localStorageItems.findIndex((item) => item.menu.id === id);
            if (itemIndex !== -1) {
                const updatedItem = {
                    ...localStorageItems[itemIndex],
                    quantity: localStorageItems[itemIndex].quantity - 1,
                };
                localStorageItems[itemIndex] = updatedItem;
                updateLocalStorage(localStorageItems);
            }
            context.setQtyUpdated(!context.qtyUpdated);
            await updateCart('dec');
        }
    };

    useEffect(() => {
        setItemQty(props.qty);
    }, [props.qty]);

    return (
        <div className='quantityIncDec'>
            <button className='inc-dec-btn' onClick={() => increase(props.id)}>+</button>
            <span className='inc-dec-span'>{itemQty}</span>
            <button className='inc-dec-btn' onClick={() => decrease(props.id)}>-</button>
        </div>
    );
};

export default QuantityIncDec;
