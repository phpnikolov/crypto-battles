import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from './app.component';



import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material
import {
  MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';

// components
import { AlertsComponent } from "./components/alerts/alerts.component";

// Services
import { StorageService } from './services/storage.service';
import { ContractService } from './services/contract.service';
import { WalletService } from './services/wallet.service';

// Pages
import { LoginPage } from './pages/login/login.page';
import { PageNotFoundPage } from './pages/page-not-found/page-not-found.page';
import { GamePage } from './pages/game/game.page';
import { CastlePage } from './pages/castle/castle.page';
import { RegisterPage } from './pages/register/register.page';
import { DialogService } from './services/dialog.service';


// dialogs
import { PromptDialog } from './dialogs/prompt/prompt.dialog';
import { TxWatcherComponent } from './components/tx-watcher/tx-watcher.component';




const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'game',
    component: GamePage,
    children: [
      {
        path: '',
        redirectTo: 'castle',
        pathMatch: 'full'
      },
      {
        path: 'castle',
        component: CastlePage,
      },
     
    ]
  },
  {
    path: '**',
    component: PageNotFoundPage
  }
];

StorageService.namespace = 'crypto-battles';

@NgModule({
  declarations: [
    AppComponent,

    AlertsComponent,

    LoginPage,
    RegisterPage,
    CastlePage,
    PageNotFoundPage,
    PromptDialog,
    GamePage,
    TxWatcherComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,

    RouterModule.forRoot(appRoutes, { enableTracing: false }),


    // Angular Material
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    StorageService,
    ContractService,
    WalletService,

    DialogService
  ],
  entryComponents: [
    PromptDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
