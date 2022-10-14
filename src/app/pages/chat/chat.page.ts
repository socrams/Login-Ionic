import { Component, OnInit } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  comentarios: string = "";
  textoChat: string = "";
  ArrayComentarios = new Array;
  supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  user = this.supabase.auth.user();
  usuarioActual: any;
  llamadaUser = "";
  constructor() { }

  ngOnInit(): void {
    this.EscucharChat();

  }
  async insertarNew() {
    const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    const { data, error } = await supabase
      .from('comentarios')
      .insert([
        { Comentarios: this.comentarios, user: this.user?.email },
      ])
  }

  EscucharChat(): void {
    const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    const user = supabase.auth.user();
    const mySubscription = supabase
      .from('comentarios')
      .on('*', async payload => {
        this.textoChat = payload.new.Comentarios;
        console.log(payload)
        await this.obtener(payload.new.user);
        this.ArrayComentarios.push(this.llamadaUser + ":" + this.textoChat);
      })
      .subscribe()
    const subscriptions = supabase.getSubscriptions()
  }


  limpiar(): void {

    this.comentarios = "";
  }
  async obtener(userActual: string) {
    const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    const user = supabase.auth.user()
    const usuario = user?.email;
    let { data: datos, error } = await supabase
      .from('datosUser')
      .select('nombreUser')
      .eq('usuariolog', userActual)
    datos?.forEach((elemento, indice, array) => {
      console.log(elemento)
      this.llamadaUser = elemento.nombreUser;
    })
  }

}


