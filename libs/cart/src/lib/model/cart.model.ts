export interface Product {
    price: number;
    name: string;
    id: string;
}

export interface QuantityProduct {
    product: Product;
    quantity: number;
}

export interface CartState {
    items: QuantityProduct[];
    loggedIn: boolean;
}
