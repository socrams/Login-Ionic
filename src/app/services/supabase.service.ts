import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const TODO_DB = 'todos';
const CHAT_DB = 'chat';

export interface Todo{
  id: number;
  inserted_at: string;
  is_complete: boolean;
  task: string;
  user_id: string;
}

export interface Chat {
  id: number;
  created_at: string;
  user: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  supabase:SupabaseClient;
  private _currentUser: BehaviorSubject<any> = new BehaviorSubject (null);
  private _todos: BehaviorSubject<any> = new BehaviorSubject ([]);
  private _chat: BehaviorSubject<any> = new BehaviorSubject ([]);

  constructor(public router:Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey,{
      autoRefreshToken: true,
      persistSession:true,
    });

    this.supabase.auth.onAuthStateChange(( event,session )=>{
      // console.log('event ',event);
      console.log('session: ', session);

      
      if (event == 'SIGNED_IN'){
        this._currentUser.next(session.user);
        this.loadTodos();//carga basede datoss
        this.handleTodosChanged(); //
      }else{
        this._currentUser.next(false);
      }
    });
  }

  async salirUsuario(){
    await  this.supabase.auth.signOut();

    this.supabase.getSubscriptions().map(sup => {this.supabase.removeSubscription(sup);
    });
    this.router.navigateByUrl('/');
  }

  async registrarUsuario(credenciales: {email, password} ){

    return new Promise ( async (resolve, reject) => {
      const { error, session } = await this.supabase.auth.signUp(credenciales)
      if ( error ) {
        reject ( error );
      }else{
        resolve ( session );
      }
      });
    }

  ingresarUsuario(credenciales: { email, password } ) {
    return new Promise ( async (resolve, reject) => {
      const { error, session } = await this.supabase.auth.signIn(credenciales)
      if ( error ) {
        reject ( error );
      }else{
        resolve ( session );
      }
    });
  }

  get todos(): Observable <Todo[] > {
    return this._todos.asObservable();
  }

  get chat(): Observable <Chat[] > {
    return this._chat.asObservable();
  }
  
  async loadTodos(){
    const query = await this.supabase.from(TODO_DB).select('*');
    console.log('query: ', query);
    this._todos.next(query.data);
  }

  async cargarMsg(){
    const query = await this.supabase.from(CHAT_DB).select('*');
    console.log('query: ', query);
    this._chat.next(query.data);
  }

  async addTodo(task: string){
    const newTodo = {
      user_id: this.supabase.auth.user().id,
      task
    };
  //  console.log(newTodo);
    
    const result = await this.supabase
    .from(TODO_DB)
    .insert(newTodo);
  }

  async addMessage(message: string){
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey,{
      autoRefreshToken: true,
      persistSession:true,
    });
    const  newChat = {
      user : this.supabase.auth.user().email,
      message,
      
    };
//    console.log(newChat, 'newspa', this.supabase);
    const result = await this.supabase
    .from(CHAT_DB)
    .insert(
      //[{id: newChat.id, message: newChat.message}]
      newChat
      );
  }

  async removeTodo(id){
    await this.supabase
    .from(TODO_DB)
    .delete()
    .match({id});
  }

  async updateTodo(id, is_complete){
    await this.supabase
    .from(TODO_DB)
    .update({is_complete})
    .match({id});
  }

  handleTodosChanged(){
    this.supabase.from(TODO_DB).on('*', payload => {
      console.log('payload: ', payload);
      if ( payload.eventType == 'DELETE'){
        const oldItem: Todo = payload.old;
        const newValue = this._todos.value.filter(item => oldItem.id != item.id);
        this._todos.next(newValue);
      }else if (payload.eventType == 'INSERT'){
        const newItem: Todo = payload.new;
        this._todos.next([...this._todos.value, newItem]);
      }else if (payload.eventType == 'UPDATE'){
        const updatedItem: Todo = payload.new;
        const newValue = this._todos.value.map(item => {
          if (updatedItem.id == item.id){
            item = updatedItem;
          }
          return item;
        })
        this._todos.next(newValue);
      }
    }).subscribe();
    }
  }
