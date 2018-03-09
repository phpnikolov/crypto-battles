import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material
import {
  MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
  
} from '@angular/material';

// components
import { AlertsComponent } from "./components/alerts/alerts.component";
import { NavbarComponent } from './components/navbar/navbar.component';
import { Top10Component } from './components/top10/top10.component';

// Services
import { StorageService } from './services/storage.service';
import { ContractService } from './services/contract.service';
import { WalletService } from './services/wallet.service';
import { PlayerService } from './services/player.service';
import { CreaturesService } from './services/creatures.service';
import { ItemService } from './services/item.service';
import { ZipperService } from './services/zipper.service';

// Pages
import { LoginPage } from './pages/login/login.page';
import { PageNotFoundPage } from './pages/page-not-found/page-not-found.page';
import { GamePage } from './pages/game/game.page';
import { HeroPage } from './pages/hero/hero.page';
import { CreaturesPage } from './pages/creatures/creatures.page';
import { ShopPage } from './pages/shop/shop.page';
import { RegisterPage } from './pages/register/register.page';
import { DialogService } from './services/dialog.service';
import { HomePage } from './pages/home/home.page';


// dialogs
import { PromptDialog } from './dialogs/prompt/prompt.dialog';
import { NotEnoughBalanceDialog } from './dialogs/not-enough-balance/not-enough-balance.dialog';
import { WalletDialog } from './dialogs/wallet/wallet.dialog';
import { PointsDialog } from './dialogs/points/points.dialog';



const appRoutes: Routes = [
  {
    path: '',
    component: HomePage
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
    component: GamePage
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
    NotEnoughBalanceDialog,
    WalletDialog,
    GamePage,
    NavbarComponent,
    HeroPage,
    CreaturesPage,
    ShopPage,
    PointsDialog,
    Top10Component,
    HomePage,
   
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    RouterModule.forRoot(appRoutes, { enableTracing: false }),


    // Angular Material
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  providers: [
    StorageService,
    ContractService,
    WalletService,
    PlayerService,
    CreaturesService,
    DialogService,
    ItemService,
    ZipperService
  ],
  entryComponents: [
    PromptDialog,
    NotEnoughBalanceDialog,
    WalletDialog,
    PointsDialog
  ],

  bootstrap: [AppComponent, AlertsComponent]
})
export class AppModule { }
