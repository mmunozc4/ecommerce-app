import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from './const/constant';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAllProducts() {
    console.log('🌐 Endpoint:', `${Constant.API__END_POINT}/Login`);
    return this.http.get(Constant.API__END_POINT + Constant.METHOD.GET_ALL_PRODUCTS)
  }

  getAllCategories() {
    return this.http.get(Constant.API__END_POINT + Constant.METHOD.GET_ALL_CATEGORY)
  }

  saveProduct(body: any) {
    return this.http.post(Constant.API__END_POINT + Constant.METHOD.SAVE_PRODUCT, body)
  }

  updateProduct(body: any) {
    return this.http.post(Constant.API__END_POINT + Constant.METHOD.UPDATE_PRODUCT, body)
  }

  deleteProduct(id: any) {
    return this.http.get(Constant.API__END_POINT + Constant.METHOD.DELETE_PRODUCT + id)
  }

  saveCategory(body: any) {
    return this.http.post(Constant.API__END_POINT + Constant.METHOD.SAVE_CATEGORY, body)
  }

  deleteCategory(id: any) {
    return this.http.get(Constant.API__END_POINT + Constant.METHOD.DELETE_CATEGORY + id)
  }


}
