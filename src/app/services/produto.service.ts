import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto';
import { CreateProdutoRequest } from '../models/create-produto-request';
import { UpdateProdutoRequest } from '../models/update-produto-request';

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

  remover(id: number): Observable<void> { // Método para remover um produto, recebe o ID do produto a ser removido e retorna um Observable de void
    return this.http.delete<void>(`${this.apiUrl}/${id}`); // Envia uma requisição DELETE para a API com o ID do produto a ser removido
  }

  atualizar(id: number, produto: UpdateProdutoRequest): Observable<Produto> { // Método para atualizar um produto, recebe o ID do produto e os dados atualizados
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto); // Envia uma requisição PUT para a API com os dados do produto a ser atualizado
  }
}