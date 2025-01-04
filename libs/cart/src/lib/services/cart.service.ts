import { computed, Injectable, signal } from '@angular/core';
import { Product, CartState, QuantityProduct } from '../model/cart.model';
import { v4 as uuid } from 'uuid';
import { equal, patchSignal } from '@flights/utils';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private initialState: CartState = { items: [], loggedIn: false };
    private state = signal<CartState>(this.initialState);

    constructor() {
        this.state.update((state) => ({
            ...state,
            items: [],
            loggedIn: true
        }));
    }

    // Define a signal for the list of items
    productList = computed(() => this.state().items, { equal });

    // Define a computed value for the total price
    subTotalPrice = computed(() => {
        return this.state().items.reduce(
            (acc, curr) => acc + curr.product.price * curr.quantity,
            0
        );
    });

    totalTax = computed(() => this.subTotalPrice() * 0.14);

    deliveryFee = computed(() => {
        const subTotal = this.subTotalPrice();

        if (subTotal === 0) {
            return 0;
        }

        return subTotal > 500 ? 0 : 200;
    });

    fullTotal = computed(
        () => this.subTotalPrice() + this.totalTax() + this.deliveryFee()
    );

    addProduct(product: Omit<Product, 'id'>): void {
        // create

        const lineItem: QuantityProduct = {
            product: {
                ...product,
                id: uuid()
            },
            quantity: 1
        };

        /*this.state.update(
            (state): CartState => ({
                ...state,
                items: [...state.items, lineItem]
            })
        );*/

        patchSignal(this.state, { items: [...this.state().items, lineItem] });
    }

    removeProduct(productId: string): void {
        const newProductList = this.state().items.filter(
            (todo) => todo.product.id !== productId
        );
        this.state.update(
            (state): CartState => ({ ...state, items: newProductList })
        );
    }

    updateProduct(productId: string, quantity: number): void {
        const existingItems = this.state().items;

        const indexItem = existingItems.findIndex(
            (t) => t.product.id === productId
        );

        if (indexItem >= -1) {
            existingItems[indexItem].quantity = quantity;

            this.state.update(
                (state): CartState => ({
                    ...state,
                    items: existingItems
                })
            );
        }
    }
}
