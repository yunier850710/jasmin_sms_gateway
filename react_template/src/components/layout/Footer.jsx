const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white px-6 py-2 shadow-inner w-full z-10 text-sm text-gray-500">
      <div className="flex items-center justify-between">
        <div>
          &copy; {currentYear} Jasmin SMPP SMS Gateway Dashboard
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-gray-700">Documentation</a>
          <a href="#" className="hover:text-gray-700">API</a>
          <a href="#" className="hover:text-gray-700">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;