import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type Budget = {
  id: string;
  name: string;
  target: number;
  savings: { month: string; amount: number }[];
  color?: string;
  leftColor?: string;
};

type BudgetsState = {
  items: Budget[];
};

const loadState = (): BudgetsState => {
  try {
    const serialized = localStorage.getItem('budgets');
    if (serialized) return JSON.parse(serialized);
  } catch {}
  return { items: [] };
};

const saveState = (state: BudgetsState) => {
  try {
    localStorage.setItem('budgets', JSON.stringify(state));
  } catch {}
};

const initialState: BudgetsState = loadState();

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    addBudget: (state, action: PayloadAction<{ name: string; target: number; color?: string }>) => {
      state.items.push({
        id: Date.now().toString(),
        name: action.payload.name,
        target: action.payload.target,
        color: action.payload.color,
        savings: [],
      });
      saveState(state);
    },
    addSaving: (state, action: PayloadAction<{ budgetId: string; month: string; amount: number }>) => {
      const budget = state.items.find(b => b.id === action.payload.budgetId);
      if (budget) {
        budget.savings.push({ month: action.payload.month, amount: action.payload.amount });
        saveState(state);
      }
    },
    editBudget: (
      state,
      action: PayloadAction<{ id: string; name?: string; target?: number; color?: string; leftColor?: string }>
    ) => {
      const budget = state.items.find(b => b.id === action.payload.id);
      if (budget) {
        if (action.payload.name !== undefined) budget.name = action.payload.name;
        if (action.payload.target !== undefined) budget.target = action.payload.target;
        if (action.payload.color !== undefined) budget.color = action.payload.color;
        if (action.payload.leftColor !== undefined) budget.leftColor = action.payload.leftColor;
        saveState(state);
      }
    },
    removeBudget: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(b => b.id !== action.payload);
      saveState(state);
    },
    removeSaving: (state, action: PayloadAction<{ budgetId: string; month: string }>) => {
      const budget = state.items.find(b => b.id === action.payload.budgetId);
      if (budget) {
        budget.savings = budget.savings.filter(s => s.month !== action.payload.month);
        saveState(state);
      }
    }
  },
});

export const { addBudget, addSaving ,removeBudget, editBudget} = budgetsSlice.actions;
export default budgetsSlice.reducer;
