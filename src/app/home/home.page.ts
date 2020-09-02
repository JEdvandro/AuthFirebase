import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ProductsService } from './../products/service/products.service';
import { Observable } from 'rxjs';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public title: string;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  productPromotion: any[] = [];

  constructor(
    private authService: AuthService,
    private productsService: ProductsService,
    private menu: MenuController,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.getAllPromotion();
  }

  getAllPromotion(){
    const subscribe = this.productsService.getProductPromotion().subscribe((data: any) => {
      subscribe.unsubscribe();
      this.productPromotion = data;
    });

    this.title = this.activatedRoute.snapshot.paramMap.get('id');
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  sair(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
