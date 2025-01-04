import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { CartService } from '../services/cart.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '@flights/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'flights-cart',
    standalone: true,
    imports: [NzButtonModule, NgIf, CurrencyPipe, NgForOf],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
    private cartService = inject(CartService);
    private authService = inject(AuthService);
    private router = inject(Router);

    cartItems = this.cartService.productList;
    subTotal = this.cartService.subTotalPrice;
    totalTax = this.cartService.totalTax;
    fullTotal = this.cartService.fullTotal;
    deliveryFee = this.cartService.deliveryFee;

    addProduct(): void {
        this.cartService.addProduct({ name: 'Hi there', price: 200 });
    }

    removeProduct(id: string): void {
        this.cartService.removeProduct(id);
    }

    updateQuantity(event: any, productId: string): void {
        this.cartService.updateProduct(productId, Number(event.value));
    }
}
