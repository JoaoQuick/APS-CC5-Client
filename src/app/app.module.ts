import { BrowserModule }            from '@angular/platform-browser';
import { NgModule }                 from '@angular/core';
import { FormsModule, 
        ReactiveFormsModule }       from '@angular/forms';
import { AppRoutingModule }         from './app-routing.module';
import { AppComponent }             from './app.component';
import { HomeComponent }            from './home/home.component';
import { ChatComponent }            from './home/chat/chat.component';
import { ChatGlobalComponent }      from './home/chat-global/chat-global.component';
import { ConfigComponent }          from './config/config.component';
import { ListUsersComponent }       from './home/list-users/list-users.component';
import { 
      ListConversationsComponent }  from './home/list-conversations/list-conversations.component';

import { RouterModule }             from '@angular/router';
import { HttpClientModule }         from '@angular/common/http';
// Firebase
import { AngularFireModule }        from '@angular/fire';
import { environment }              from '../environments/environment';
import { AngularFirestoreModule }   from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
// animação angular-material
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { MatSliderModule }          from '@angular/material/slider';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatAutocompleteModule }    from '@angular/material/autocomplete';
import { MatSelectModule }          from '@angular/material/select';
import { MatGridListModule }        from '@angular/material/grid-list';
import { MatSidenavModule }         from '@angular/material/sidenav';
import { MatBadgeModule }           from '@angular/material/badge';
import { MatCardModule }            from '@angular/material/card';
import { MatButtonModule }          from '@angular/material/button';
import { LoginComponent }           from './login/login.component';
import { MatListModule }            from '@angular/material/list';
import { MatIconModule }            from '@angular/material/icon';
import {MatMenuModule}              from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkTableModule }           from '@angular/cdk/table';
import { MatTableModule }           from '@angular/material/table';
import { MatTabsModule }            from '@angular/material/tabs';
import { ScrollingModule }          from '@angular/cdk/scrolling';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { ProfileComponent } from './profile/profile.component';

const root = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'api-config', component: ConfigComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ChatComponent,
    ChatGlobalComponent,
    ConfigComponent,
    ListUsersComponent,
    ListConversationsComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(root),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatInputModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatGridListModule,
    MatSelectModule,
    MatCardModule,
    ScrollingModule,
    MatButtonModule,
    MatTableModule,
    CdkTableModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    TableVirtualScrollModule,
    AngularFireStorageModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
