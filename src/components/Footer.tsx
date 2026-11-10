import React from 'react';
import { Heart, ShieldCheck, Mail, Phone, Home } from 'lucide-react';

interface FooterProps {
  onOpenLogin: () => void;
  setActiveTab: (tab: 'family' | 'chanda' | 'eid' | 'trust') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLogin, setActiveTab }) => {
  return (
    <footer className="bg-emerald-950 text-white border-t border-emerald-800/80 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-emerald-800/60">
          {/* Family Brand & Motto */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 font-serif font-bold flex items-center justify-center text-xl">
                ম
              </div>
              <h3 className="text-xl font-bold font-serif tracking-tight text-white">
                মোল্লা পরিবার
              </h3>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              একতা, পারস্পরিক ভালোবাসা ও সহমর্মিতার বন্ধন। পরিবারের যেকোনো সদস্যের অসুস্থতা বা বিপদে আমরা
              সকলে সবসময় পাশে আছি।
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-300 font-medium">
              <Heart className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>আমাদের পরিবার, আমাদের শক্তি ও অহংকার</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-3 font-serif">
              পারিবারিক সেবাসমূহ
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <button
                  onClick={() => setActiveTab('family')}
                  className="hover:text-amber-300 transition-colors"
                >
                  • পরিবারের সদস্য তালিকা ও অবস্থান
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('chanda')}
                  className="hover:text-amber-300 transition-colors"
                >
                  • ১৫ জনের মাসিক ৫০০ টাকা চাঁদা হিসাব
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('eid')}
                  className="hover:text-amber-300 transition-colors"
                >
                  • ঈদুল ফিতর ও ঈদুল আজহা অনুষ্ঠান বাজেট
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('trust')}
                  className="hover:text-amber-300 transition-colors"
                >
                  • মোল্লা পরিবার কল্যাণ ট্রাস্ট (চিকিৎসা সাহায্য)
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Contact & Login */}
          <div>
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-3 font-serif">
              জরুরি যোগাযোগ ও সাহায্য
            </h4>
            <p className="text-xs text-emerald-200/80 mb-2">
              পরিবারের কোনো সদস্য হঠাৎ অসুস্থ হলে অথবা রক্তের প্রয়োজনে জরুরি যোগাযোগ করুন:
            </p>
            <div className="space-y-1.5 text-xs text-emerald-100">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>প্রধান সমন্বয়ক: ০১৭১২-৩৪৫৬৭৮</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>samiul122344@gmail.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Home className="w-3.5 h-3.5 text-amber-400" />
                <span>মোল্লা বাড়ি, মূল পারিবারিক নিবাস</span>
              </p>
            </div>
          </div>
        </div>

        {/* Required Bottom Bar with the exact developer credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-emerald-300/70">
            © ২০২৬ মোল্লা পরিবার পোর্টাল। সর্বস্বত্ব সংরক্ষিত।
          </p>

          {/* Strictly requested developer credit */}
          <div className="bg-emerald-900/80 border border-emerald-700/80 px-4 py-2 rounded-2xl shadow-sm">
            <p className="text-sm font-bold text-amber-300 tracking-wide font-serif">
              ডেভেলপার বাই এমডি সামিউল ইসলাম ২০২৬
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
