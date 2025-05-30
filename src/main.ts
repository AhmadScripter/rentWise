import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './app/interceptor/auth.interceptor';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient( withInterceptors([AuthInterceptor])),
    provideRouter(routes),
    provideAnimations()
  ]
}).catch(err => console.error(err));
