import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

 constructor( private loadingCtrl: LoadingController) { }
  // async showMessage(){
  //  const loading = await this.loadingCtrl.create({ message: 'Aguarde...'});
  //  return loading.present();
 // }

  async showMessage() {
    const loading = await this.loadingCtrl.create({
      cssClass: '',
      message: 'Aguarde...',
      duration: 4000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

}
