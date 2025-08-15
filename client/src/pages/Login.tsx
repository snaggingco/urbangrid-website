
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-green to-brand-black">
      <div className="max-w-md w-full mx-4 bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="text-3xl font-bold text-brand-green mb-4">UrbanGrid</div>
        <h1 className="text-xl font-semibold text-brand-black mb-4">
          Property Inspection & Snagging Experts
        </h1>
        <p className="text-text-grey mb-8">
          Professional property inspection services across Dubai, Abu Dhabi, Sharjah and the UAE.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => window.location.href = '/api/login'}
            className="w-full bg-brand-green text-white hover:bg-opacity-90"
          >
            Admin Login
          </Button>
          
          <div className="text-sm text-text-grey">
            Login to access the admin dashboard and manage content
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-light-grey">
          <div className="flex justify-center space-x-6">
            <a 
              href="tel:+971501234567" 
              className="text-brand-green hover:text-brand-black transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>
              Call Us
            </a>
            <a 
              href="https://wa.me/971501234567" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-green hover:text-brand-black transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
