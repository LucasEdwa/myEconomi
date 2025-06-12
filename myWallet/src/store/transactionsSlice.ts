import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
};

type TransactionsState = {
  items: Transaction[];
};

const loadState = (): TransactionsState => {
  try {
    const serialized = localStorage.getItem('transactions');
    if (serialized) return JSON.parse(serialized);
  } catch {}
  return { items: [] };
};

const saveState = (state: TransactionsState) => {
  try {
    localStorage.setItem('transactions', JSON.stringify(state));
  } catch {}
};

const initialState: TransactionsState = loadState();

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id'>>) => {
      state.items.push({
        id: Date.now().toString(),
        ...action.payload,
      });
      saveState(state);
    },
    // reducers here (e.g., removeTransaction)
  },
});

export const { addTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
