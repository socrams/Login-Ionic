
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
      // const supabase= this.supabaseService.supabase;
      // const user = supabase.auth.user();
      
      // const mySubscription = supabase
      //   .from('chat')
      //   .on('*', async payload => {
      //     console.log('chat: ', await payload.new.user)
      //   })
      //   .subscribe()
      // const subscriptions = this.supabaseService.supabase.getSubscriptions()
    /*
      supabase
      .channel('public:countries')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, payload => {
      console.log('Change received!', payload)
      })
    .subscribe()
      */

//   const user = supabase.auth.user();
// const mySubscription = supabase
// .from('menssages')
// .on('*', async payload => {
  //   this.conversacion = payload.new.menssages;
  //   console.log(payload)
  //await this.obtener(payload.new.user);
  //   supabase.auth.user()?.email + ":" + this.conversacion;
  // })
  // .subscribe()
  // const subscriptions = supabase.getSubscriptions()
  //   } 

/*
angular.module('ionicApp', ['ionic'])
    
    // All this does is allow the message
    // to be sent when you tap return
    .directive('input', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          'returnClose': '=',
          'onReturn': '&',
          'onFocus': '&',
          'onBlur': '&'
        },
        link: function(scope, element, attr) {
          element.bind('focus', function(e) {
            if (scope.onFocus) {
              $timeout(function() {
                scope.onFocus();
              });
            }
          });
          element.bind('blur', function(e) {
            if (scope.onBlur) {
              $timeout(function() {
                scope.onBlur();
              });
            }
          });
          element.bind('keydown', function(e) {
            if (e.which == 13) {
              if (scope.returnClose) element[0].blur();
              if (scope.onReturn) {
                $timeout(function() {
                  scope.onReturn();
                });
              }
            }
          });
        }
      }
    })
    
    //   EscucharChat(): void{
      //   const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    .controller('Messages', function($scope, $timeout, $ionicScrollDelegate) {
      
      $scope.hideTime = true;
      
      var alternate,
      isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
      
      $scope.sendMessage = function() {
        alternate = !alternate;
        
        var d = new Date();
  d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
  
  $scope.messages.push({
    userId: alternate ? '12345' : '54321',
    text: $scope.data.message,
    time: d
  });
  
  delete $scope.data.message;
  $ionicScrollDelegate.scrollBottom(true);
  
};
 
 
$scope.inputUp = function() {
  if (isIOS) $scope.data.keyboardHeight = 216;
  $timeout(function() {
    $ionicScrollDelegate.scrollBottom(true);
  }, 300);
  
};

$scope.inputDown = function() {
  if (isIOS) $scope.data.keyboardHeight = 0;
  $ionicScrollDelegate.resize();
};
 
$scope.closeKeyboard = function() {
  // cordova.plugins.Keyboard.close();
};

 
$scope.data = {};
$scope.myId = '12345';
$scope.messages = [];

});
*/