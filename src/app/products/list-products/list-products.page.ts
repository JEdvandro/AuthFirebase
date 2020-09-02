import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsService } from './../service/products.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.page.html',
  styleUrls: ['./list-products.page.scss'],
})
export class ListProductsPage implements OnInit {
  products: Observable<any[]>;
  imgs: Observable<any[]>;
  constructor(private productsService: ProductsService,
              private toast: ToastService ) { }

  // tslint:disable-next-line: no-inferrable-types
  hasImg: boolean = false;
  // tslint:disable-next-line: no-inferrable-types
  imgUrl: string = '';

  ngOnInit() {
    this.getAll();

  }

  getAll(){
    this.products = this.productsService.getAll();
  }

  async removeProduto(productid: string, filePath: string){
    this.productsService.deleteProduct(productid, filePath);
    try {
      this.toast.showMessage({message: 'Produto removido com sucesso', color: 'success'});
    } catch (error) {
      this.toast.showMessage({message: error, color: 'danger'});
    }
  }

}
