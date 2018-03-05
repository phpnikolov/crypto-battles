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
import { CreaturesService } from './services/creatures.service';

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
import { NotEnoughBalanceDialog } from './dialogs/not-enough-balance/not-enough-balance.dialog';
import { WalletDialog } from './dialogs/wallet/wallet.dialog';
import { PointsDialog } from './dialogs/points/points.dialog';






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
    CreaturesService,
    DialogService
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
