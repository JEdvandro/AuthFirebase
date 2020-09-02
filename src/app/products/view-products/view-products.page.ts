import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../service/products.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.page.html',
  styleUrls: ['./view-products.page.scss'],
})
export class ViewProductsPage implements OnInit {
  private productId: string;
  productImg: any[] = [];
  name: string;
  description: string;
  price: string;
  imgUrl: string;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(
    private productService: ProductsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.params.id;
    const resultProduct = this.productService.getProduct(this.productId).subscribe((data: any) => {
      resultProduct.unsubscribe();
      if (data.imgUrl){
        this.imgUrl = data.imgUrl;
      }
      this.name = data.name;
      this.description = data.description;
      this.price = data.price;

      this.getAllPhoto();

    });
  }

  getAllPhoto(){
    const resultImgs = this.productService.getByIdImg(this.productId).subscribe((datai: any) => {
      resultImgs.unsubscribe();
      // console.log(datai);
      if (datai){
        this.productImg = datai;
      }
    });
  }


}
