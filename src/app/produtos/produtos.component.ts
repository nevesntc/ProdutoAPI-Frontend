import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';

import { ProdutoService } from '../services/produto.service';
import { Produto } from '../models/produto';
import { CreateProdutoRequest } from '../models/create-produto-request';
import { UpdateProdutoRequest } from '../models/update-produto-request';

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

  produtoEditandoId: number | null = null;

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

    if (this.produtoEditandoId !== null) {
      const produtoAtualizado: UpdateProdutoRequest = {
        nome: this.novoProduto.nome,
        descricao: this.novoProduto.descricao,
        preco: this.novoProduto.preco,
        quantidadeEstoque: this.novoProduto.quantidadeEstoque
      };

      this.produtoService.atualizar(this.produtoEditandoId, produtoAtualizado)
        .pipe(
          timeout(8000),
          finalize(() => {
            this.salvando = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: () => {
            this.mensagem = 'Produto atualizado com sucesso!';
            this.limparFormulario();
            this.carregarProdutos();
          },
          error: (erro) => {
            console.error('Erro ao atualizar produto:', erro);

            if (typeof erro.error === 'string') {
              this.erro = erro.error;
            } else {
              this.erro = 'Erro ao atualizar produto.';
            }
          }
        });

      return;
    }

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
          this.limparFormulario();
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

  editarProduto(produto: Produto): void {
    this.produtoEditandoId = produto.id;

    this.novoProduto = {
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      quantidadeEstoque: produto.quantidadeEstoque
    };

    this.mensagem = '';
    this.erro = '';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
    this.mensagem = '';
    this.erro = '';
  }

  limparFormulario(): void {
    this.produtoEditandoId = null;

    this.novoProduto = {
      nome: '',
      descricao: '',
      preco: 0,
      quantidadeEstoque: 0
    };
  }

  removerProduto(id: number): void {
    const confirmar = confirm('Tem certeza que deseja remover este produto?');

    if (!confirmar) {
      return;
    }

    this.erro = '';
    this.mensagem = '';

    this.produtoService.remover(id)
      .pipe(timeout(8000))
      .subscribe({
        next: () => {
          this.mensagem = 'Produto removido com sucesso!';

          if (this.produtoEditandoId === id) {
            this.limparFormulario();
          }

          this.carregarProdutos();
        },
        error: (erro) => {
          console.error('Erro ao remover produto:', erro);
          this.erro = 'Erro ao remover produto.';
        }
      });
  }
}
