import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { User } from '../interfaces/user';
import { ToastService } from './../shared/toast.service';
import { AuthService } from './../service/auth.service';
import { LoadingService } from '../shared/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formLogin: FormGroup;
  formRegister: FormGroup;
  @ViewChild(IonSlides) slides: IonSlides;

  subscribe: any;
  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private route: Router,
    private presentLoading: LoadingService,
    private formBuilder: FormBuilder,
    public platform: Platform
  ) {
      this.subscribe = this.platform.backButton.subscribeWithPriority(666666, () => {
        if ( this.constructor.name === 'LoginPage' )
        {
          if (window.confirm('Deseja sair do aplicativo?'))
          {
            navigator['app'].exitApp();
          }
        }
      });
    }

  public userLogin: User = {};
  public userRegister: User = {};
 // private loading: any;

  ngOnInit() {
    this.createFormLogin();
    this.createFormRegister();
  }

  private createFormLogin(){
    this.formLogin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]

    });
  }

 private createFormRegister(){
    this.formRegister = this.formBuilder.group({
      name: [''],
      email: ['', [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required]

    });
  }

  get f() { return this.formLogin.controls; }
  get r() { return this.formRegister.controls; }

  segmentChanged(event: any){
    if (event.detail.value === 'login'){
      this.slides.slidePrev();
    } else {
      this.slides.slideNext();
    }
  }

  async login(){
    await this.presentLoading.showMessage();

    try {
      await this.authService.login(this.formLogin.value);
      this.toast.showMessage({ message: 'Logado com sucesso!', color: 'success' });
      this.route.navigate(['/home']);
    } catch (error) {
      this.messageError(error);
    } finally {
   //   this.presentLoading.dismiss();

    }
  }

  async resetpassword(){
    this.presentLoading.showMessage();

    try {
      await this.authService.resetPassword(this.formLogin.value);
      this.toast.showMessage({ message: 'Verifique seu email para confirmar!', color: 'success' });
    } catch (error) {
      this.messageError(error);
    } finally {
     // this.presentLoading.dismiss();
    }
  }

  async register(){
    this.presentLoading.showMessage();

    try {
      await this.authService.register(this.formRegister.value);
      this.toast.showMessage({ message: 'Usuário criado com sucesso', color: 'success' });
      this.toast.showMessage({ message: 'Verifique seu email para confirmar!', color: 'success' });
    } catch (error) {
      this.messageError(error);
    } finally {
     // this.presentLoading.dismiss();
    }
  }

  // async presentLoading(){
   // this.loading = await this.loadingCtrl.create({ message: 'Aguarde...'});
  //  return this.loading.present();
  // }

  // https://firebase.google.com/docs/auth/admin/errors
  messageError(error: any){
    let mensagem = '';
    if (error.code === 'auth/email-already-in-use') {
      mensagem = 'O e-mail informado já está sendo usado.';
    } else if (error.code === 'auth/invalid-email') {
      mensagem = 'O e-mail informado é inválido';
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-password') {
      mensagem = 'O usuário/senha inválido(s)';
    } else if (error.code === 'auth/wrong-password') {
      mensagem = 'A senha é inválida ou o usuário não possui uma senha.';

    } else if (error.code === 'auth/argument-error') {
      mensagem = 'Digite um email válido.';
    }else {
      mensagem = error;
      this.toast.showMessage({ message: mensagem, color: 'warning' });

    }

    this.toast.showMessage({ message: mensagem, color: 'danger' });
  }

}
