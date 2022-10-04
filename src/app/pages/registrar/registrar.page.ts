import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  credenciales2: FormGroup;
  
  constructor(
    private loadingController: LoadingController,
    private supabaseService: SupabaseService,
    private alertController: AlertController,
    private fb: FormBuilder,

    ) { }

  ngOnInit() {
    this.credenciales2 = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async registrarUsuario(){
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.supabaseService.registrarUsuario(this.credenciales2.value).then(async session => {
      await loading.dismiss();
      this.showError('Registro Completo', 'Por favor confirme su email ahora');
    },async err => { 
      await loading.dismiss();
      const alert = await this.alertController.create({
        header:'Registro fallido',
        message: err.msg,
        buttons: ['OK']
      });
      await alert.present();
    });
  }

  async showError(tittle , msg) {
    const alert = await this.alertController.create({
      header: tittle,
      message: msg,
      buttons :['OK'],
    })
    await alert.present();
  }

}