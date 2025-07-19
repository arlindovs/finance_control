import React, { useState } from 'react';
import axios from 'axios';

interface TransactionFormProps {
  fetchTransactions: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ fetchTransactions }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');
  const [faturaCartao, setFaturaCartao] = useState(false);
  const [recorrente, setRecorrente] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/transacoes', {
        descricao,
        valor: parseFloat(valor),
        data,
        tipo,
        fatura_cartao: faturaCartao,
        recorrente,
      });
      fetchTransactions();
      // Limpar formulário
      setDescricao('');
      setValor('');
      setFaturaCartao(false);
      setRecorrente(false);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  const inputStyle = "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const checkboxLabelStyle = "flex items-center space-x-2 text-sm text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Adicionar Transação</h3>
      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className={inputStyle}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className={inputStyle}
          required
        />
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className={inputStyle}
          required
        />
      </div>
      <select value={tipo} onChange={(e) => setTipo(e.target.value as any)} className={inputStyle}>
        <option value="despesa">Despesa</option>
        <option value="receita">Receita</option>
      </select>
      <div className="space-y-2">
        <label className={checkboxLabelStyle}>
          <input type="checkbox" checked={faturaCartao} onChange={(e) => setFaturaCartao(e.target.checked)} className="rounded" />
          <span>É no cartão de crédito?</span>
        </label>
        <label className={checkboxLabelStyle}>
          <input type="checkbox" checked={recorrente} onChange={(e) => setRecorrente(e.target.checked)} className="rounded" />
          <span>É uma transação recorrente?</span>
        </label>
      </div>
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
        Adicionar
      </button>
    </form>
  );
};

export default TransactionForm;
