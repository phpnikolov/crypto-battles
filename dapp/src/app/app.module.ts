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
import { NavbarComponent } from './components/navbar/navbar.component';

// Services
import { StorageService } from './services/storage.service';
import { ContractService } from './services/contract.service';
import { WalletService } from './services/wallet.service';
import { PlayerService } from './services/player.service';

// Pages
import { LoginPage } from './pages/login/login.page';
import { PageNotFoundPage } from './pages/page-not-found/page-not-found.page';
import { GamePage } from './pages/game/game.page';
import { HeroPage } from './pages/hero/hero.page';
import { CreaturesPage } from './pages/creatures/creatures.page';
import { ShopPage } from './pages/shop/shop.page';
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
        redirectTo: 'hero',
        pathMatch: 'full'
      },
      {
        path: 'hero',
        component: HeroPage,
      },
      {
        path: 'creatures',
        component: CreaturesPage,
      },
      {
        path: 'shop',
        component: ShopPage,
      }
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
    PageNotFoundPage,
    PromptDialog,
    GamePage,
    TxWatcherComponent,
    NavbarComponent,
    HeroPage,
    CreaturesPage,
    ShopPage,

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
    PlayerService,
    DialogService
  ],
  entryComponents: [
    PromptDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
