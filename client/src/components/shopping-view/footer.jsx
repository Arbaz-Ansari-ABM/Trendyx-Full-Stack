function ShoppingFooter() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-white">Trendyx</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Modern full-stack e-commerce platform built with cutting-edge technologies. 
              Experience seamless shopping with secure payments and fast delivery.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">FB</span>
              </div>
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">TW</span>
              </div>
              <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">IG</span>
              </div>
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">LI</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/shop/home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/shop/listing" className="text-gray-300 hover:text-white transition-colors">Products</a></li>
              <li><a href="/shop/account" className="text-gray-300 hover:text-white transition-colors">My Account</a></li>
              <li><a href="/shop/checkout" className="text-gray-300 hover:text-white transition-colors">Checkout</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Categories</h3>
            <ul className="space-y-3">
              <li><span className="text-gray-300">Men's Fashion</span></li>
              <li><span className="text-gray-300">Women's Fashion</span></li>
              <li><span className="text-gray-300">Kids Collection</span></li>
              <li><span className="text-gray-300">Accessories</span></li>
              <li><span className="text-gray-300">Footwear</span></li>
            </ul>
          </div>

          {/* Developer Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Developer</h3>
            <div className="space-y-3">
              <p className="text-lg font-bold text-blue-400">Arbaz Ahmad Ansari</p>
              <p className="text-gray-300">Full Stack || MERN Stack Developer</p>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <span className="font-semibold">Tech Stack:</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">MongoDB</span>
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">Express</span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">React</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Node.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300">
                &copy; {new Date().getFullYear()} Trendyx Platform. All rights reserved.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Developed by Arbaz Ahmad Ansari
              </p>
            </div>
            <div className="flex space-x-6">
              <span className="text-gray-300 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="text-gray-300 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              <span className="text-gray-300 hover:text-white cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;