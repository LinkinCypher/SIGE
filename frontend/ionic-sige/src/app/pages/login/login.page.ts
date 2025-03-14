import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Si el usuario ya está autenticado, redirigir al home
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/home');
    }
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        loading.dismiss();
        this.isLoading = false;
        this.router.navigateByUrl('/home');
      },
      error: async (error) => {
        loading.dismiss();
        this.isLoading = false;
        
        const alert = await this.alertController.create({
          header: 'Error de autenticación',
          message: error.error?.message || 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.',
          buttons: ['OK']
        });

        await alert.present();
      }
    });
  }
}