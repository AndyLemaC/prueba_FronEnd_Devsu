import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Pages
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Components
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { ModalComponent } from './components/modal/modal.component';

//Pipes
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { TextTruncatePipe } from './shared/pipes/text-truncate.pipe';

// Directives
import { InputValidationDirective } from './shared/directives/input-validation.directive';

// Services
import { ProductService } from './services/product.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { IdValidatorService } from './services/id-validator.service';


@NgModule({
  declarations: [
    AppComponent,
    // Pages
    ProductListComponent,
    ProductFormComponent,
    NotFoundComponent,
    // Components
    SearchBarComponent,
    PaginationComponent,
    ProductCardComponent,
    DropdownMenuComponent,
    ModalComponent,
    // Pipes
    DateFormatPipe,
    TextTruncatePipe,
    // Directives
    InputValidationDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    ProductService,
    ErrorHandlerService,
    IdValidatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
