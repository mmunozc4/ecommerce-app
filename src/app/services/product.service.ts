import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from './const/constant';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private base = environment.apiBase;

  constructor(private http: HttpClient) { }

  getAllProducts() {
    console.log('🌐 Endpoint:', `${this.base}/${Constant.METHOD.GET_ALL_PRODUCTS}`);
    return this.http.get(`${this.base}/${Constant.METHOD.GET_ALL_PRODUCTS}`);
  }

  getAllCategories() {
    return this.http.get(`${this.base}/${Constant.METHOD.GET_ALL_CATEGORY}`);
  }

  saveProduct(body: any) {
    return this.http.post(`${this.base}/${Constant.METHOD.SAVE_PRODUCT}`, body);
  }

  updateProduct(body: any) {
    return this.http.post(`${this.base}/${Constant.METHOD.UPDATE_PRODUCT}`, body);
  }

  deleteProduct(id: any) {
    return this.http.get(`${this.base}/${Constant.METHOD.DELETE_PRODUCT}${id}`);
  }

  saveCategory(body: any) {
    return this.http.post(`${this.base}/${Constant.METHOD.SAVE_CATEGORY}`, body);
  }

  deleteCategory(id: any) {
    return this.http.get(`${this.base}/${Constant.METHOD.DELETE_CATEGORY}${id}`);
  }
}

