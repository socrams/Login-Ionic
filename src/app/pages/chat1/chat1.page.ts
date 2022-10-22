
import { Component, OnInit } from '@angular/core';
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
  public mailLocal : string;
  constructor(private supabaseService: SupabaseService) {
  }
  
  async enviarMessage() {
    const supabase = createClient(environment.supabaseUrl,environment.supabaseKey)
    const {data, error } = await  supabase
    .from('chat')
    .insert(
      { message: this.message , user: supabase.auth.user().email },
      );
      this.message = '';
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
  }
}