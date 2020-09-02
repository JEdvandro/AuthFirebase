import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private afa: AngularFireAuth
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.afa.user.pipe( // pipeline de execução
      take(1), // pega 1 usuario 
      map(user => !!user), // mapeamento do usuario
      tap(usuariologado => { // comparação do usuario
        if (!usuariologado){
          this.router.navigate(['login']);
        }
      })
    );
  }

}
