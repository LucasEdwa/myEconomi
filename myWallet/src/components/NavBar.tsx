const NavBar = () => (
  <nav className="bg-gray-800 p-4">
   <ul className="flex space-x-4">
      <li>
        <a href="/" className="text-white hover:text-gray-300">Home</a>
      </li>
      <li>
        <a href="/transaction" className="text-white hover:text-gray-300">Transactions</a>
      </li>
        <li>
            <a href="/budgets" className="text-white hover:text-gray-300">Budgets</a>
        </li>
      
    </ul>
  </nav>
);

export default NavBar;
