import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const TODO_DB = 'todos';

export interface Todo{
  id:number;
  inserted_at: string;
  is_complete: boolean;
  task: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  supabase:SupabaseClient;
  private _currentUser: BehaviorSubject<any> = new BehaviorSubject (null);
  private _todos: BehaviorSubject<any> = new BehaviorSubject ([]);

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
        this.loadTodos();
        this.handleTodosChanged();
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

  async loadTodos(){
    const query = await this.supabase.from(TODO_DB).select('*');
    console.log('query: ', query);
    this._todos.next(query.data);
  }

  async addTodo(task: string){
    const newTodo = {
      user_id: this.supabase.auth.user().identities,
      task
    };
    const result = await this.supabase.from(TODO_DB).insert(newTodo);
  }

   handleTodosChanged(){}
  //   this.supabase.from(TODO_DB).on('*', payload => {
  //     console.log('payload: ', payload);
  //     if ( payload.eventType == 'DELETE'){ 
  //       const oldItem: Todo = payload.old;
  //       const newValue = this.
  //     }else if (payload.eventType == 'INSERT'){
  //       const o
  //     }else if (payload.eventType == 'UPDATE'){  
      
  //     }
  //   }).subscribe();
  // }
}
