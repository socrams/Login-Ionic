import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { createClient, RealtimeClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/services/supabase.service';
import { environment } from 'src/environments/environment';


export interface CurrentSession {
  currentSession: currentSession;
}
export interface currentSession {
  user: User;
}
export interface User {
  email: string;
}
export interface datos {
  nombre:string;
  apellido:string;
  edad:any;
  mail:any;
}

@Component({
  selector: 'app-chat1',
  templateUrl: './chat1.page.html',
  styleUrls: ['./chat1.page.scss'],
})

export class Chat1Page implements OnInit {
  message: string;
  conversacion: string = '';
  chats = this.supabaseService.chat;
  public supabase;
  //misdatos = new datos<any>;
  public mailLocal : string;

  @ViewChild(IonContent, {read: IonContent, static: false}) mycontent: IonContent;

  constructor(private supabaseService: SupabaseService) {
    
  }
  // async read(){
  //   this.supabaseService.supabase;
  //   this.misdatos= await this.supabaseService.supabase
  // .from('profiles')
  // .select('*');
  // this.misdatos.nombre;
  // }

  async enviarMessage() {
    const supabase = createClient(environment.supabaseUrl,environment.supabaseKey)
    const {data, error } = await  supabase
    .from('chat')
    .insert(
      { message: this.message , user: supabase.auth.user().email },
      );
      this.message = '';
      this.scrollToBottomOnInit();
    }
  mensajes(){
    const email:CurrentSession = JSON.parse(localStorage.getItem('supabase.auth.token'));
    //console.log('email: ',email.currentSession.user.email);
    this.mailLocal = email.currentSession.user.email;
  }
  salir(){
    this.supabaseService.salirUsuario();
  }
  ngOnInit():void{
    this.mensajes();
    this.scrollToBottomOnInit();
      // document.getElementById("ver").focus();
    }

    
    scrollToBottomOnInit() {
      setTimeout(() => {
          if (this.mycontent.scrollToBottom) {
              this.mycontent.scrollToBottom(400);
          }
      }, 500);
  }
}