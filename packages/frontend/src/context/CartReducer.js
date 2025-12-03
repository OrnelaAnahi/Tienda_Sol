const cartReducer = (state, action) => {
    switch (action.type) {
        case "TOGGLE_CART": {
            const toggleValue = action.payload?.toggle;
            return {
                ...state,
                isCartOpen:
                    typeof toggleValue === "boolean"
                        ? toggleValue
                        : !state.isCartOpen,
            };
        }

        case "ADD_TO_CART": {
            const newItemId = action.payload.item.id;
            const itemExist = state.cartItems.some(
                (item) => item.id === newItemId
            );

            let updatedCartItems;

            if (itemExist) {
                updatedCartItems = state.cartItems.map((item) =>
                    item.id === newItemId
                        ? item.stock > item.quantity
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                        : item
                );
            } else {
                updatedCartItems = [
                    ...state.cartItems,
                    { ...action.payload.item, quantity: 1 },
                ];
            }

            return {
                ...state,
                cartItems: updatedCartItems,
            };
        }

        case "REMOVE_FROM_CART":
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (item) => item.id !== action.payload.itemId
                ),
            };

        case "INCREMENT":
            return {
                ...state,
                cartItems: state.cartItems.map((item) =>
                    item.id === action.payload.itemId
                        ? item.stock > item.quantity
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                        : item
                ),
            };

        case "DECREMENT":
            return {
                ...state,
                cartItems: state.cartItems
                    .map((item) =>
                        item.id === action.payload.itemId
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    )
                    .filter((item) => item.quantity > 0),
            };

        case "CLEAR_CART":
            return {
                ...state,
                cartItems: [],
            };

        default:
            return state;
    }
};

export default cartReducer;
