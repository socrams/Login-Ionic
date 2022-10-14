import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

export interface User {
  uid: string;
  email: string;
}

export interface Message {
  createdAt: string;
  id: string;
  from: string;
  msg: string;
  formName: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  currentUser: User;

  constructor() {
  }
}
