import React, { createContext, useReducer } from "react";
import cartReducer from "./CartReducer";

const cartContext = createContext();

const initialState = {
    isCartOpen: false,
    cartItems: [],
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const toggleCart = (toggle) =>{
        dispatch({
            type: "TOGGLE_CART",
            payload: { toggle },
        });
    }

    const addItem = (producto) =>
        dispatch({
            type: "ADD_TO_CART",
            payload: { item: producto },
        });

    const removeItem = (itemId) =>
        dispatch({
            type: "REMOVE_FROM_CART",
            payload: { itemId },
        });

    const incrementItem = (itemId) =>
        dispatch({
            type: "INCREMENT",
            payload: { itemId },
        });

    const decrementItem = (itemId) =>
        dispatch({
            type: "DECREMENT",
            payload: { itemId },
        });

    const clearCart = () => dispatch({ type: "CLEAR_CART" });

    return (
        <cartContext.Provider
            value={{
                ...state,
                toggleCart,
                addItem,
                removeItem,
                incrementItem,
                decrementItem,
                clearCart,
            }}
        >
            {children}
        </cartContext.Provider>
    );
};

export default cartContext;
