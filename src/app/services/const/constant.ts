import { environment } from "../../../environments/environment"

export const Constant = {
    API__END_POINT: environment.apiBase,
    METHOD: {
        GET_ALL_PRODUCTS: 'GetAllProducts',
        GET_ALL_CATEGORY: 'GetAllCategory',
        SAVE_PRODUCT: 'CreateProduct',
        UPDATE_PRODUCT: 'UpdateProduct',
        DELETE_PRODUCT: 'DeleteProductById?id=',
        SAVE_CATEGORY: 'CreateNewCategory',
        DELETE_CATEGORY: 'DeleteCategoryById?id=',
    }
}