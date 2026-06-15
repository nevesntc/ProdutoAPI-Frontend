import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto';
import { CreateProdutoRequest } from '../models/create-produto-request';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService { // Serviço para interagir com a API de produtos
  private readonly apiUrl = 'https://localhost:7230/api/produtos'; // URL base da API de produtos

  constructor(private http: HttpClient) {} // Injeção de dependência do HttpClient para realizar requisições HTTP

  listar(): Observable<Produto[]> { // Método para listar todos os produtos, retorna um Observable de um array de Produto
    return this.http.get<Produto[]>(this.apiUrl);
  }

  criar(produto: CreateProdutoRequest): Observable<Produto> { // Método para criar um novo produto, recebe um CreateProdutoRequest e retorna um Observable de Produto criado
    return this.http.post<Produto>(this.apiUrl, produto); // Envia uma requisição POST para a API com os dados do produto a ser criado
  }
}