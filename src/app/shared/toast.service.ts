import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl: ToastController) { }

  async showMessage({ message, color }: { message: string; color: string; }){
    const toast = await this.toastCtrl.create({
      message, // mensagem
      duration: 4000, // duração
      color, // cor
      position: 'bottom' // posição
    });
    toast.present();
  }
}
