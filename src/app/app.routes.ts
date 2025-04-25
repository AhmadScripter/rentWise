import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyOtpComponent } from './components/verify-otp/verify-otp.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyAdsComponent } from './components/my-ads/my-ads.component';
import { CategoryComponent } from './components/category/category.component';
import { AdDetailsComponent } from './components/ad-details/ad-details.component';
import { BlogComponent } from './components/blog/blog.component';
import { ContactComponent } from './components/contact/contact.component';
import { RentwiseBusinessComponent } from './components/rentwise-business/rentwise-business.component';
import { HelpComponent } from './components/help/help.component';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'verify-otp', component: VerifyOtpComponent },
    { path: 'profile', component: ProfileComponent },
    {path: 'my-ads', component: MyAdsComponent},
    {path: 'ad/:id', component: AdDetailsComponent},
    { path: 'category/:name', component: CategoryComponent },
    {path: 'blog', component: BlogComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'rentwise-businessess', component: RentwiseBusinessComponent},
    {path: 'help', component: HelpComponent},
    {path: 'terms', component: TermsComponent},
    {path: 'privacy', component: PrivacyComponent},
];
