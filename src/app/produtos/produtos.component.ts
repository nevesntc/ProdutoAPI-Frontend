import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../models/produto';
import { finalize, timeout } from 'rxjs';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.css'
})
export class ProdutosComponent implements OnInit { // Implementação da interface OnInit para usar o método ngOnInit
  produtos: Produto[] = [];
  carregando = true;
  erro = '';
  private cdr = inject(ChangeDetectorRef);

  constructor(private produtoService: ProdutoService) {} // Injeção de dependência do serviço ProdutoService

  ngOnInit(): void {
    this.carregarProdutos(); // Chama o método para carregar os produtos quando o componente for inicializado
  }

carregarProdutos(): void {
  console.log('Chamando API de produtos...');

  this.carregando = true;
  this.erro = '';

  this.produtoService.listar()
    .pipe(
      timeout(8000),
      finalize(() => {
        this.carregando = false;
        console.log('Finalizou carregamento.');
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (dados) => {
        console.log('Produtos recebidos:', dados);
        this.produtos = Array.isArray(dados) ? dados : [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos:', erro);
        this.erro = 'Erro ao carregar produtos. Verifique se a API está rodando e se a URL está correta.';
      }
    });
}}
