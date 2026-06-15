import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService { // Serviço para interagir com a API de produtos
  private readonly apiUrl = 'https://localhost:7230/api/produtos'; // URL base da API de produtos

  constructor(private http: HttpClient) {} // Injeção de dependência do HttpClient para realizar requisições HTTP

  listar(): Observable<Produto[]> { // Método para listar todos os produtos, retorna um Observable de um array de Produto
    return this.http.get<Produto[]>(this.apiUrl);
  }
}