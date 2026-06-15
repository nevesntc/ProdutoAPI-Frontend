import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';

import { ProdutoService } from '../services/produto.service';
import { Produto } from '../models/produto';
import { CreateProdutoRequest } from '../models/create-produto-request';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.css'
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];

  carregando = true;
  salvando = false;

  erro = '';
  mensagem = '';
  private cdr = inject(ChangeDetectorRef);

  novoProduto: CreateProdutoRequest = {
    nome: '',
    descricao: '',
    preco: 0,
    quantidadeEstoque: 0
  };

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.erro = '';

    this.produtoService.listar()
      .pipe(
        timeout(8000),
        finalize(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (dados) => {
          this.produtos = Array.isArray(dados) ? dados : [];
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: (erro) => {
          console.error('Erro ao carregar produtos:', erro);
          this.erro = 'Erro ao carregar produtos.';
        }
      });
  }

  salvarProduto(): void {
    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    this.produtoService.criar(this.novoProduto)
      .pipe(
        timeout(8000),
        finalize(() => {
          this.salvando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.mensagem = 'Produto cadastrado com sucesso!';

          this.novoProduto = {
            nome: '',
            descricao: '',
            preco: 0,
            quantidadeEstoque: 0
          };

          this.carregarProdutos();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar produto:', erro);

          if (typeof erro.error === 'string') {
            this.erro = erro.error;
          } else {
            this.erro = 'Erro ao cadastrar produto.';
          }
        }
      });
  }
}
