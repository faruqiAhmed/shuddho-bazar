import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  User, 
  MapPin, 
  KeyRound,
  MessageSquare,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { CustomerUser } from '../types';
import { 
  requestOtp, 
  verifyOtp, 
  getDemoAccounts, 
  getOperator, 
  formatDisplayPhone,
  normalizePhone
} from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: CustomerUser) => void;
  initialPhone?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialPhone = '',
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [simulatedSmsOtp, setSimulatedSmsOtp] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // New profile state
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCityArea, setNewCityArea] = useState<'Inside City' | 'Outside City'>('Inside City');

  // Loading & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Demo accounts
  const demoAccounts = getDemoAccounts();

  // Reset modal when reopened
  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhoneNumber(initialPhone || '');
      setOtpDigits(['', '', '', '']);
      setSimulatedSmsOtp(null);
      setErrorMessage(null);
      setCountdown(60);
      setCanResend(false);
    }
  }, [isOpen, initialPhone]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const operator = getOperator(phoneNumber);

  const handleSendOtp = (targetPhone?: string) => {
    const phoneToUse = targetPhone || phoneNumber;
    setErrorMessage(null);

    const norm = normalizePhone(phoneToUse);
    if (!norm || norm.length !== 11 || !norm.startsWith('01')) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = requestOtp(norm);
      setIsLoading(false);
      if (res.success) {
        setPhoneNumber(norm);
        setSimulatedSmsOtp(res.code);
        setIsNewUser(res.isNewUser);
        setStep('otp');
        setCountdown(60);
        setCanResend(false);
        setOtpDigits(['', '', '', '']);
        // Focus first OTP field after transition
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const handleSelectDemoAccount = (demo: CustomerUser) => {
    setPhoneNumber(demo.phone);
    handleSendOtp(demo.phone);
  };

  const handleOtpChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);
    setErrorMessage(null);

    // Auto advance
    if (char && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 4 entered
    if (char && index === 3) {
      const fullCode = newDigits.join('');
      if (fullCode.length === 4) {
        verifyCode(fullCode);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length > 0) {
      const newDigits = ['', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      if (pasted.length === 4) {
        verifyCode(pasted);
      } else {
        otpInputRefs.current[Math.min(pasted.length, 3)]?.focus();
      }
    }
  };

  const handleAutoFillOtp = () => {
    if (!simulatedSmsOtp) return;
    const digits = simulatedSmsOtp.split('');
    setOtpDigits(digits);
    verifyCode(simulatedSmsOtp);
  };

  const verifyCode = (code: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      if (isNewUser) {
        // If it's a new user, test if code matches, then move to profile step
        const isMatch = code === simulatedSmsOtp || code === '1234';
        if (isMatch) {
          setStep('profile');
        } else {
          setErrorMessage('ভুল ওটিপি কোড! আবার চেষ্টা করুন বা টেস্ট কোড 1234 ব্যবহার করুন।');
        }
      } else {
        // Existing user: complete login immediately
        const res = verifyOtp(phoneNumber, code);
        if (res.success && res.user) {
          onSuccess(res.user);
          onClose();
        } else {
          setErrorMessage(res.error || 'ভেরিফিকেশন ব্যর্থ হয়েছে');
        }
      }
    }, 500);
  };

  const handleCompleteNewProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setErrorMessage('আপনার নাম লিখুন');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = verifyOtp(phoneNumber, otpDigits.join('') || simulatedSmsOtp || '1234', {
        name: newName.trim(),
        address: newAddress.trim() || 'Dhaka, Bangladesh',
        cityArea: newCityArea,
      });

      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setErrorMessage(res.error || 'একাউন্ট তৈরি করা সম্ভব হয়নি');
      }
    }, 450);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/90 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-lg shadow-sm">
              SB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">
                  শুদ্ধ বাজার লগইন
                </h3>
                <span className="text-[10px] uppercase font-bold bg-emerald-700/80 text-emerald-100 px-2 py-0.5 rounded-full">
                  OTP Login
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                মোবাইল নম্বর ও তাৎক্ষণিক ওটিপিতে সহজ লগইন
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {/* STEP 1: Phone Number */}
          {step === 'phone' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  মোবাইল নম্বর লিখুন (Enter Mobile Number)
                </label>
                
                <div className="relative flex items-center">
                  {/* Bangladesh Flag & Prefix */}
                  <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none text-stone-600 text-sm font-bold border-r border-stone-200 pr-2.5">
                    <span className="text-base leading-none">🇧🇩</span>
                    <span>+880</span>
                  </div>

                  <input
                    type="tel"
                    value={phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhoneNumber(clean ? '0' + clean : '');
                      setErrorMessage(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendOtp();
                      }
                    }}
                    placeholder="1712345678"
                    autoFocus
                    className="w-full pl-24 pr-20 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-base font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all placeholder:text-stone-300"
                  />

                  {/* Telecom Operator Badge */}
                  {phoneNumber.length >= 3 && (
                    <div className="absolute right-3 pointer-events-none">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${operator.color}`}>
                        {operator.badge}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-stone-500 mt-2 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-700 shrink-0" />
                  <span>কোনো পাসওয়ার্ড প্রয়োজন নেই, আপনার ফোনে ওটিপি পাঠানো হবে।</span>
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium animate-in fade-in">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={isLoading || phoneNumber.length < 9}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ওটিপি কোড পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>ওটিপি কোড পাঠান (Send OTP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Accounts Quick Selection */}
              <div className="pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>দ্রুত টেস্ট করুন (Demo Accounts)</span>
                  </span>
                  <span className="text-[10px] text-stone-400">১-ক্লিক লগইন</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.slice(0, 4).map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectDemoAccount(acc)}
                      className="p-2 text-left rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <img 
                          src={acc.avatar} 
                          alt={acc.name} 
                          className="w-7 h-7 rounded-full object-cover border border-stone-200 shrink-0" 
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-800 group-hover:text-emerald-800 truncate">
                            {acc.name}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate">
                            {formatDisplayPhone(acc.phone)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Banner */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>আপনার মোবাইল নম্বর সম্পূর্ণ নিরাপদ ও সুরক্ষিত</span>
              </div>
            </div>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 'otp' && (
            <div className="space-y-5">
              {/* Back & Change Phone */}
              <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
                <div className="flex items-center gap-2 text-xs text-stone-700">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-semibold">{formatDisplayPhone(phoneNumber)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setErrorMessage(null);
                  }}
                  className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>পরিবর্তন করুন</span>
                </button>
              </div>

              {/* Simulated SMS Alert Banner */}
              {simulatedSmsOtp && (
                <div className="bg-amber-50/90 border border-amber-200 p-3 rounded-2xl text-xs space-y-2 animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-amber-600" />
                      <span>সিমুলেটেড SMS ইনবক্স (Simulated SMS)</span>
                    </span>
                    <span className="text-[10px] bg-amber-200/60 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                      এখনই এসেছে
                    </span>
                  </div>
                  <p className="text-stone-700 text-[11px] leading-relaxed">
                    শুদ্ধ বাজার ওটিপি কোড হলো: <strong className="text-stone-950 font-black text-sm tracking-widest bg-white px-2 py-0.5 rounded border border-amber-300 mx-1">{simulatedSmsOtp}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[11px] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-amber-950" />
                    <span>স্বয়ংক্রিয়ভাবে কোড বসিয়ে লগইন করুন (Auto-Fill & Verify)</span>
                  </button>
                </div>
              )}

              {/* OTP Digits Input */}
              <div>
                <label className="block text-center text-xs font-bold text-stone-700 mb-3">
                  ৪ ডিজিটের ওটিপি কোড লিখুন (Enter 4-Digit OTP)
                </label>

                <div className="flex items-center justify-center gap-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpInputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-14 h-14 text-center text-2xl font-bold text-stone-900 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:bg-white focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-700/15 transition-all"
                    />
                  ))}
                </div>

                <div className="text-center mt-3 text-[11px] text-stone-400">
                  পরীক্ষার জন্য সার্বজনীন কোড <strong className="text-stone-700 font-bold">1234</strong> ও ব্যবহার করতে পারেন
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium text-center animate-in fade-in">
                  {errorMessage}
                </div>
              )}

              {/* Verify Button */}
              <button
                type="button"
                onClick={() => verifyCode(otpDigits.join(''))}
                disabled={isLoading || otpDigits.some(d => !d)}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>যাচাই করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>যাচাই করুন ও এগিয়ে যান (Verify & Continue)</span>
                  </>
                )}
              </button>

              {/* Resend OTP Timer */}
              <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
                {canResend ? (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-emerald-800 font-bold hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>পুনরায় ওটিপি পাঠান (Resend Code)</span>
                  </button>
                ) : (
                  <span className="text-stone-400">
                    পুনরায় কোড পাঠানো যাবে <strong className="text-stone-700">{countdown}s</strong> পর
                  </span>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: New Profile Setup */}
          {step === 'profile' && (
            <form onSubmit={handleCompleteNewProfile} className="space-y-4">
              <div className="text-center pb-1">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                </div>
                <h4 className="font-display font-extrabold text-base text-stone-900">
                  নম্বর সফলভাবে যাচাই হয়েছে!
                </h4>
                <p className="text-xs text-stone-500">
                  আপনার নাম ও ডেলিভারি তথ্য দিয়ে প্রোফাইল সম্পূর্ণ করুন
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  আপনার নাম (Full Name) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="উদাঃ আব্দুর রহমান"
                    autoFocus
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ডেলিভারির পূর্ণাঙ্গ ঠিকানা (Delivery Address)
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="বাড়ি নং, রোড নং, এলাকা, থানা..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ডেলিভারি এরিয়া (Delivery Area)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${newCityArea === 'Inside City' ? 'border-emerald-700 bg-emerald-50/60 font-bold text-emerald-950' : 'border-stone-200 hover:bg-stone-50 text-stone-600'}`}>
                    <input
                      type="radio"
                      name="cityArea"
                      checked={newCityArea === 'Inside City'}
                      onChange={() => setNewCityArea('Inside City')}
                      className="text-emerald-700"
                    />
                    <span>শহরের ভেতরে (৳৭০)</span>
                  </label>
                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${newCityArea === 'Outside City' ? 'border-emerald-700 bg-emerald-50/60 font-bold text-emerald-950' : 'border-stone-200 hover:bg-stone-50 text-stone-600'}`}>
                    <input
                      type="radio"
                      name="cityArea"
                      checked={newCityArea === 'Outside City'}
                      onChange={() => setNewCityArea('Outside City')}
                      className="text-emerald-700"
                    />
                    <span>শহরের বাইরে (৳১৩০)</span>
                  </label>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium animate-in fade-in">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !newName.trim()}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>প্রোফাইল তৈরি সম্পূর্ণ করুন (Complete Setup)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
