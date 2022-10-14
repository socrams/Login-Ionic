import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { SupabaseService, Todo } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  
  items = this.supabaseService.todos;
  
  constructor(
    private supabaseService : SupabaseService,
    private alertCtrl:AlertController
  ) { }

  ngOnInit() {
  }

  async createTodo() {
    const alert = await this.alertCtrl.create({
      header: 'New todo',
      inputs: [
        {
          name: 'task',
          placeholder: 'Learn Ionic'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data: any) => {
            this.supabaseService.addTodo(data.task);
          }
        }
      ]
    });
  await alert.present();
  }

  

  singOut(){
    this.supabaseService.salirUsuario();
  }
  
  delete(item:Todo){
    this.supabaseService.removeTodo(item.id);
  }
  toggleDone(item: Todo){
    this.supabaseService.updateTodo(item.id, !item.is_complete);
  }

  
}
