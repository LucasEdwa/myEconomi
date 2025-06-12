import { createBrowserRouter } from 'react-router';
import Layout from './pages/Layout';
import { NotFound } from './pages/NotFound';
import { Home } from './pages/Home';
import { TransactionForm } from './pages/TransactionForm';
import { Budgets } from './pages/Budgets';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		errorElement: <NotFound />,
		children: [
			{ path: '/', element: <Home /> },
			{ path: 'transaction', element: <TransactionForm /> },
			{ path: 'budgets', element: <Budgets /> },
		],
	},
]);

export default router;