import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line: no-unused-expression
// tslint:disable-next-line: no-unused-expression
import { Router } from '@angular/router';
import { Products } from '../interface/products';
import { ProductsService } from '../service/products.service';
import { ToastService } from 'src/app/shared/toast.service';
import { LoadingController } from '@ionic/angular';
import { AlertService } from './../../shared/alert.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  private productId: string;
  private products: Products = {};
  private loading: any;
  private file: File = null;
  form: FormGroup;
  title: string;
  hasImg = false;
  filePath = '';
  imgUrl = '';

  constructor(
    private productService: ProductsService,
    private toast: ToastService,
    private alert: AlertService,
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.createForm();
    this.productId = this.activatedRoute.snapshot.params.id;
    if (this.productId){
      this.title = 'Editar Produto';
      const subscribep = this.productService.getProduct(this.productId).subscribe((data: any) => {
        subscribep.unsubscribe();
        if (data.imgUrl){
          this.imgUrl = data.imgUrl;
          this.filePath = data.filePath;
          this.hasImg = true;
        }
        // this.product = data;
        this.form.patchValue({
          name: data.name,
          description: data.description,
          price: data.price,
          promotion: data.promotion,
        });

        // const subscribei = this.productService.getByIdImg(this.productId).subscribe((datai: any) => {
          // subscribei.unsubscribe();
          // console.log(datai);
          // if (datai){
            // this.imgUrl = datai[0].img;
            // this.filePath = datai[0].filePath;
            // this.hasImg = true;
          // }

        // });

      });
    }else{
      this.title = 'Cadastrar Produto';
    }
  }

  private createForm(){
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.1)] ],
      promotion: [false],
      filepath: [''],
      img: [''],
      imgUrl: [''],
      imgs: [''],
    });

    this.filePath = '';
    this.hasImg = false;
    this.imgUrl = '';
  }

  get f() { return this.form.controls; }

  async saveProduct(){

    if (this.form.valid){

        await this.presentLoading();

        if ( this.productId ) { // produto existe
          const Product = {
            name: this.form.get('name').value,
            description: this.form.get('description').value,
            price: this.form.get('price').value,
            promotion: this.form.get('promotion').value,
          };
          try {
            await this.productService.updateProduct(this.productId, Product, this.file);
            this.toast.showMessage({message: 'Produto editado com sucesso', color: 'success'});
            this.router.navigate(['/list-products']);
          } catch (error) {
            this.toast.showMessage({message: error, color: 'danger'});
          } finally {
            this.loading.dismiss();
          }

        } else {

          try {
            await this.productService.addProduct(this.form.value, this.file);
            this.form.reset();
            this.toast.showMessage({message: 'Produto adicionado com sucesso', color: 'success'});
            this.router.navigate(['/list-products']);
          } catch (error) {
            this.toast.showMessage({message: error, color: 'danger'});
          } finally {
            this.loading.dismiss();
          }
        }

    } else {
      this.toast.showMessage({message: 'Ainda faltam campos a serem preenchidos', color: 'warning'});
    }


  }

  async presentLoading(){
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...'});
    return this.loading.present();
  }


  upload(event: any){
    if (event.target.files.length){
      this.file = event.target.files[0];
    } else {
      this.file = null;
    }
  }

  async removerImg(productid: string, filePath: string){
    try {
      await this.productService.removeImg(productid, filePath ) ;
      this.imgUrl = '';
      this.filePath = '';
    } catch (error) {
      this.toast.showMessage({message: error, color: 'danger'});
    }
  }

  async removeProduto(productid: string, filePath: string){
    this.productService.deleteProduct(this.productId, this.filePath);
    try {
      this.toast.showMessage({message: 'Produto removido com sucesso', color: 'success'});
      this.router.navigate(['/list-products']);
    } catch (error) {
      this.toast.showMessage({message: error, color: 'danger'});
    }
  }
}
