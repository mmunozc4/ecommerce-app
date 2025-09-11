import { Routes } from '@angular/router';
import { LoginComponent } from './components/admin/login/login.component';
import { LayoutComponent } from './components/admin/layout/layout.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { CategoriesComponent } from './components/admin/categories/categories.component';
import { LandingComponent } from './components/website/landing/landing.component';
import { CategoryProductsComponent } from './components/website/category-products/category-products.component';
import { CheckoutComponent } from './components/website/checkout/checkout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'shop',
        pathMatch: 'full'
    },
    { path: 'login', component: LoginComponent },
    { path: 'shop', component: LandingComponent },
    { path: 'shop/category-products', component: CategoryProductsComponent },
    { path: 'shop/checkout', component: CheckoutComponent },
    {
        path: 'admin',
        component: LayoutComponent,
        children: [
            { path: 'products', component: ProductsComponent },
            { path: 'categories', component: CategoriesComponent }
        ]
    },
    {
        path: '**',
        redirectTo: 'shop',
        pathMatch: 'full'
    }
];
