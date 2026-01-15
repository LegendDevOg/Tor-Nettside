function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="fixed bottom-2 right-4 z-50">
      <div className="bg-white rounded-lg shadow-md px-4 py-2">
        <p className="text-sm text-gray-600">
          © {currentYear} Norwegian with Tor. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
