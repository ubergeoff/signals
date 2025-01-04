import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { QuantityProduct } from '../model/cart.model';

describe('CartService', () => {
    let service: CartService;
    let firstItem: QuantityProduct;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CartService);

        service.addProduct({ name: 'df', price: 343 });
        const items = service.productList();
        firstItem = items[0];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('addProduct', () => {
        it('should remove an item to the product list array', () => {
            service.addProduct({ name: 'df', price: 343 });
            expect(service.productList().length).toEqual(2);
        });
    });

    describe('removeProduct', () => {
        it('should add an item to the product list array', () => {
            service.removeProduct(firstItem.product.id);
            expect(service.productList().length).toEqual(0);
        });
    });
});
