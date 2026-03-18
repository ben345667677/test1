"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, Cpu, Bot, MessageCircle, ArrowLeft, Loader2, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

const COOLDOWN_KEY = "last_submission";
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

function getTimeRemaining(lastSubmission: number): { remaining: number; text: string } | null {
  const now = Date.now();
  const elapsed = now - lastSubmission;
  const remaining = COOLDOWN_MS - elapsed;

  if (remaining <= 0) return null;

  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  let text = "";
  if (hours > 0) {
    text = `${hours} שעות`;
    if (minutes > 0) text += ` ו-${minutes} דקות`;
  } else {
    text = `${minutes} דקות`;
  }

  return { remaining, text };
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Cooldown state
  const [cooldownText, setCooldownText] = useState<string | null>(null);
  const [isInCooldown, setIsInCooldown] = useState(false);

  // Check cooldown on mount and every second
  const checkCooldown = useCallback(() => {
    const lastSubmission = localStorage.getItem(COOLDOWN_KEY);
    if (!lastSubmission) {
      setIsInCooldown(false);
      setCooldownText(null);
      return;
    }

    const result = getTimeRemaining(parseInt(lastSubmission, 10));
    if (result) {
      setIsInCooldown(true);
      setCooldownText(result.text);
    } else {
      setIsInCooldown(false);
      setCooldownText(null);
      localStorage.removeItem(COOLDOWN_KEY);
    }
  }, []);

  useEffect(() => {
    checkCooldown();
    timerRef.current = setInterval(checkCooldown, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [checkCooldown]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      const heroTl = gsap.timeline();

      heroTl
        .from(".hero-line", { scaleX: 0, duration: 1, ease: "power2.out" })
        .from(".hero-subtitle", { opacity: 0, y: 30, duration: 0.8 }, "-=0.4")
        .from(".hero-title-line", { opacity: 0, y: 60, duration: 0.8, stagger: 0.15 }, "-=0.4")
        .from(".hero-description", { opacity: 0, y: 30, duration: 0.8 }, "-=0.3")
        .from(".hero-button", { opacity: 0, y: 30, duration: 0.6, stagger: 0.15 }, "-=0.3");

      // About section animations
      gsap.from(".about-header", {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 0.8
      });

      gsap.from(".about-content", {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.8
      });

      gsap.from(".about-stat", {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 60%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.1
      });

      // Services section animations
      gsap.from(".services-header", {
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 0.8
      });

      gsap.from(".service-item", {
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.7,
        stagger: 0.2
      });

      // Process section animations
      gsap.from(".process-header", {
        scrollTrigger: {
          trigger: processRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 0.8
      });

      gsap.from(".process-item", {
        scrollTrigger: {
          trigger: processRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.15
      });

      // Contact section animations
      gsap.from(".contact-header", {
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 0.8
      });

      gsap.from(".contact-form", {
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.8
      });

      gsap.from(".contact-whatsapp", {
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 60%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: 0.2
      });

    });

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "נא להזין שם תקין (לפחות 2 תווים)";
    }

    if (!formData.phone.trim() || !/^[\d\+\-\(\)\s]+$/.test(formData.phone)) {
      newErrors.phone = "נא להזין מספר טלפון תקין";
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "נא להזין כתובת אימייל תקינה";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "נא להזין הודעה (לפחות 10 תווים)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isInCooldown) {
      toast.error(`נסה שוב בעוד ${cooldownText}`);
      return;
    }

    if (!validateForm()) {
      toast.error("נא לתקן את השגיאות בטופס");
      return;
    }

    setIsSubmitting(true);

    try {
      // Connect to backend API via HTTPS with SSL
      const API_URL = "https://api.benaya.online";

      if (API_URL) {
        // If API URL is set, try to send to backend
        const response = await fetch(`${API_URL}/api/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        // Handle cooldown response
        if (response.status === 429) {
          setIsInCooldown(true);
          checkCooldown();
          toast.error(result.error || "שלחת כבר הודעה לאחרונה");
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(result.error || "שגיאה בשליחת ההודעה");
        }

        // Success - store submission time in localStorage
        localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
        setIsSuccess(true);
        toast.success(result.message || "ההודעה נשלחה בהצלחה!");
        checkCooldown();

        // Reset form after delay
        setTimeout(() => {
          setFormData({ name: "", phone: "", email: "", message: "" });
          setIsSuccess(false);
        }, 3000);
      } else {
        // Static fallback - open WhatsApp with the message
        const whatsappMessage = `שם: ${formData.name}\nטלפון: ${formData.phone}\nאימייל: ${formData.email}\nהודעה: ${formData.message}`;
        const whatsappUrl = `https://wa.me/972545460223?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank");

        // Store submission time in localStorage
        localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
        setIsSuccess(true);
        toast.success("נפתח צ'אט וואטסאפ!");
        checkCooldown();

        // Reset form after delay
        setTimeout(() => {
          setFormData({ name: "", phone: "", email: "", message: "" });
          setIsSuccess(false);
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "שגיאה בשליחת ההודעה";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center px-6 py-20" dir="rtl">
        <div className="max-w-5xl w-full text-center">
          {/* Decorative line */}
          <div className="hero-line w-20 h-px bg-foreground/30 mx-auto mb-10 origin-center"></div>

          {/* Subtitle */}
          <p className="hero-subtitle text-base tracking-[0.35em] uppercase text-muted-foreground mb-8">
            סוכנות דיגיטל וטכנולוגיה
          </p>

          {/* Main Title */}
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] leading-[1.05] mb-10">
            <span className="hero-title-line block">אנחנו יוצרים</span>
            <span className="hero-title-line block italic">חוויות</span>
            <span className="hero-title-line block">דיגיטליות</span>
          </h1>

          {/* Description */}
          <p className="hero-description text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-14 leading-relaxed">
            אנחנו יוצרים אתרים מעוצבים, אוטומציות חכמות ופתרונות מותאמים אישית שמקדמים את העסק שלך לשלב הבא.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button
              onClick={scrollToContact}
              className="hero-button px-10 py-5 text-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
            >
              התחילו פרויקט
            </button>
            <button
              onClick={scrollToContact}
              className="hero-button px-10 py-5 text-lg border border-border bg-transparent text-foreground font-medium hover:bg-muted/50 transition-colors"
            >
              למידע נוסף
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-32 px-6 bg-muted/20" dir="rtl">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="about-header mb-20 text-center">
            <div className="w-20 h-px bg-foreground/30 mx-auto mb-8"></div>
            <p className="text-base tracking-[0.25em] uppercase text-muted-foreground mb-3">מי אנחנו</p>
            <h2 className="font-display text-5xl md:text-6xl">הסיפור שלנו</h2>
          </div>

          {/* About Content */}
          <div className="about-content max-w-3xl mx-auto text-center mb-20">
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              אנחנו צוות של מעצבים, מפתחים ואסטרטגים דיגיטליים שמאמינים שכל עסק ראוי לנוכחות דיגיטלית מרשימה.
              אנחנו משלבים יצירתיות עם טכנולוגיה מתקדמה כדי ליצור חוויות שמשאירות רושם.
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              מהיום הראשון, המטרה שלנו הייתה ברורה: לעזור לעסקים לפרוח בעולם הדיגיטלי.
              עם גישה אישית, תשומת לב לפרטים, ומחויבות למצוינות, אנחנו הופכים חלומות למציאות.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="about-stat text-center p-8 border border-border">
              <div className="text-5xl md:text-6xl font-display text-primary mb-3">150+</div>
              <p className="text-muted-foreground text-lg">פרויקטים שהושלמו</p>
            </div>
            <div className="about-stat text-center p-8 border border-border">
              <div className="text-5xl md:text-6xl font-display text-primary mb-3">98%</div>
              <p className="text-muted-foreground text-lg">לקוחות מרוצים</p>
            </div>
            <div className="about-stat text-center p-8 border border-border">
              <div className="text-5xl md:text-6xl font-display text-primary mb-3">5+</div>
              <p className="text-muted-foreground text-lg">שנות ניסיון</p>
            </div>
            <div className="about-stat text-center p-8 border border-border">
              <div className="text-5xl md:text-6xl font-display text-primary mb-3">24/7</div>
              <p className="text-muted-foreground text-lg">תמיכה וליווי</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-32 px-6" dir="rtl">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="services-header mb-20">
            <div className="w-20 h-px bg-foreground/30 mb-8"></div>
            <p className="text-base tracking-[0.25em] uppercase text-muted-foreground mb-3">מה אנחנו עושים</p>
            <h2 className="font-display text-5xl md:text-6xl">השירותים שלנו</h2>
          </div>

          {/* Services List */}
          <div className="divide-y divide-border">
            {/* Service 01 */}
            <div className="service-item py-16 flex flex-col md:flex-row gap-8 items-start group">
              <div className="flex items-center gap-6 md:w-1/3">
                <div className="w-20 h-20 border border-border flex items-center justify-center transition-colors group-hover:border-foreground/60">
                  <Globe className="w-9 h-9 text-primary" />
                </div>
                <span className="text-muted-foreground text-lg font-medium">01</span>
              </div>
              <div className="md:w-2/3">
                <h3 className="font-display text-3xl md:text-4xl mb-4">פיתוח אתרים</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  אתרים מעוצבים בקפידה המשלבים אסתטיקה עם ביצועים גבוהים. כל פרט מחושב, כל פיקסל מדויק.
                  אנחנו בונים אתרים שלא רק נראים טוב, אלא גם עובדים מצוין ומניבים תוצאות.
                </p>
              </div>
            </div>

            {/* Service 02 */}
            <div className="service-item py-16 flex flex-col md:flex-row gap-8 items-start group">
              <div className="flex items-center gap-6 md:w-1/3">
                <div className="w-20 h-20 border border-border flex items-center justify-center transition-colors group-hover:border-foreground/60">
                  <Cpu className="w-9 h-9 text-primary" />
                </div>
                <span className="text-muted-foreground text-lg font-medium">02</span>
              </div>
              <div className="md:w-2/3">
                <h3 className="font-display text-3xl md:text-4xl mb-4">אוטומציות AI</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  מערכות אוטומציה חכמות שמייעלות תהליכים ומשחררות זמן יקר. פתרונות מותאמים אישית לעסק שלך
                  שחוסכים שעות עבודה ומאפשרים לך להתמקד במה שבאמת חשוב.
                </p>
              </div>
            </div>

            {/* Service 03 */}
            <div className="service-item py-16 flex flex-col md:flex-row gap-8 items-start group">
              <div className="flex items-center gap-6 md:w-1/3">
                <div className="w-20 h-20 border border-border flex items-center justify-center transition-colors group-hover:border-foreground/60">
                  <Bot className="w-9 h-9 text-primary" />
                </div>
                <span className="text-muted-foreground text-lg font-medium">03</span>
              </div>
              <div className="md:w-2/3">
                <h3 className="font-display text-3xl md:text-4xl mb-4">בוטים מותאמים</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  צ&apos;אטבוטים חכמים המאומנים על הידע העסקי שלך. פעילים 24/7 בוואטסאפ, טלגרם ובאתר שלך,
                  מספקים שירות מקצועי ללקוחות שלך בכל שעה ובכל מקום.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="py-32 px-6 bg-muted/20" dir="rtl">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="process-header mb-20 text-center">
            <div className="w-20 h-px bg-foreground/30 mx-auto mb-8"></div>
            <p className="text-base tracking-[0.25em] uppercase text-muted-foreground mb-3">איך זה עובד</p>
            <h2 className="font-display text-5xl md:text-6xl">התהליך שלנו</h2>
          </div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Step 1 */}
            <div className="process-item p-10 border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 border border-primary flex items-center justify-center">
                  <span className="font-display text-2xl text-primary">01</span>
                </div>
                <h3 className="font-display text-2xl">פגישת היכרות</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                נשב together נבין את הצרכים שלך, המטרות שלך, והחזון שלך.
                נשמע את הסיפור של העסק ונתאים את הפתרון המושלם עבורך.
              </p>
            </div>

            {/* Step 2 */}
            <div className="process-item p-10 border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 border border-primary flex items-center justify-center">
                  <span className="font-display text-2xl text-primary">02</span>
                </div>
                <h3 className="font-display text-2xl">תכנון ואפיון</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                נבנה תכנית מפורטת עם מפת דרכים ברורה.
                נגדיר אבני דרך, נקבע לוחות זמנים, ונוודא שכולם באותו עמוד.
              </p>
            </div>

            {/* Step 3 */}
            <div className="process-item p-10 border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 border border-primary flex items-center justify-center">
                  <span className="font-display text-2xl text-primary">03</span>
                </div>
                <h3 className="font-display text-2xl">עיצוב ופיתוח</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                הצוות שלנו מתחיל לעבוד. עיצוב מרהיב, קוד נקי,
                ובדיקות מקיפות לאורך כל הדרך כדי להבטיח איכות ללא פשרות.
              </p>
            </div>

            {/* Step 4 */}
            <div className="process-item p-10 border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 border border-primary flex items-center justify-center">
                  <span className="font-display text-2xl text-primary">04</span>
                </div>
                <h3 className="font-display text-2xl">השקה וליווי</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                הפרויקט יוצא לאוויר העולם, אבל הקשר שלנו לא נגמר שם.
                אנחנו ממשיכים ללוות, לתחזק, ולשפר לאורך זמן.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-32 px-6 bg-muted/30" dir="rtl">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="contact-header mb-20 text-center">
            <div className="w-20 h-px bg-foreground/30 mx-auto mb-8"></div>
            <h2 className="font-display text-5xl md:text-6xl">
              בואו <span className="italic">נדבר</span>
            </h2>
            <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
              יש לכם פרויקט בראש? נשמח לשמוע ולעזור. השאירו פרטים ונחזור אליכם בהקדם.
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="contact-form">
              {/* Cooldown Warning */}
              {isInCooldown && (
                <div className="mb-8 p-6 bg-muted/50 border border-border">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <p className="text-lg">
                      שלחת כבר הודעה לאחרונה. נסה שוב בעוד <span className="font-medium text-foreground">{cooldownText}</span>
                    </p>
                  </div>
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-lg font-medium mb-3">שם מלא</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-5 text-lg bg-transparent border focus:ring-1 outline-none transition-colors ${
                      errors.name
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-foreground focus:ring-foreground/20"
                    }`}
                    placeholder="הזינו את שמכם"
                    disabled={isSubmitting || isSuccess}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-2">{errors.name}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-lg font-medium mb-3">מספר טלפון</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    dir="ltr"
                    className={`w-full px-6 py-5 text-lg bg-transparent border focus:ring-1 outline-none transition-colors text-left ${
                      errors.phone
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-foreground focus:ring-foreground/20"
                    }`}
                    placeholder="050-000-0000"
                    disabled={isSubmitting || isSuccess}
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm mt-2">{errors.phone}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-lg font-medium mb-3">כתובת אימייל</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    dir="ltr"
                    className={`w-full px-6 py-5 text-lg bg-transparent border focus:ring-1 outline-none transition-colors text-left ${
                      errors.email
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-foreground focus:ring-foreground/20"
                    }`}
                    placeholder="your@email.com"
                    disabled={isSubmitting || isSuccess}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-2">{errors.email}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-lg font-medium mb-3">תיאור פרויקט</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-6 py-5 text-lg bg-transparent border focus:ring-1 outline-none transition-colors resize-none ${
                      errors.message
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-foreground focus:ring-foreground/20"
                    }`}
                    placeholder="ספרו לנו על הפרויקט שלכם..."
                    disabled={isSubmitting || isSuccess}
                  ></textarea>
                  {errors.message && (
                    <p className="text-destructive text-sm mt-2">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess || isInCooldown}
                  className={`w-full sm:w-auto px-10 py-5 text-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3 ${
                    isSuccess
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : isInCooldown
                      ? "bg-muted-foreground text-muted cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  } ${isSubmitting || isSuccess || isInCooldown ? "cursor-not-allowed opacity-90" : ""}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>שולח...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>נשלח בהצלחה!</span>
                    </>
                  ) : isInCooldown ? (
                    <>
                      <Clock className="w-5 h-5" />
                      <span>נסה שוב בעוד {cooldownText}</span>
                    </>
                  ) : (
                    <>
                      <span>שליחת הודעה</span>
                      <ArrowLeft className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* WhatsApp CTA */}
            <div className="contact-whatsapp flex flex-col items-start">
              <div className="w-20 h-20 border border-border flex items-center justify-center mb-8">
                <MessageCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-display text-3xl mb-6">מעדיפים וואטסאפ?</h3>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                ניתן לפנות אלינו ישירות בוואטסאפ לשיחה מהירה ויעילה.
                אנחנו זמינים ומוכנים לעזור בכל שאלה או בקשה.
              </p>
              <a
                href="https://wa.me/972545460223"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-10 py-5 text-lg bg-[hsl(142,70%,45%)] text-white font-medium hover:bg-[hsl(142,70%,40%)] transition-colors shadow-sm hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>צרו קשר בוואטסאפ</span>
              </a>

              {/* Additional Info */}
              <div className="mt-16 pt-8 border-t border-border w-full">
                <p className="text-muted-foreground text-lg mb-4">או שלחו אימייל ל:</p>
                <a href="mailto:bnybwmnsh@gmail.com" className="text-xl text-primary hover:underline">
                  bnybwmnsh@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-border mt-auto" dir="rtl">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-right">
              <h3 className="font-display text-3xl mb-2">Starter Studio</h3>
              <p className="text-muted-foreground text-lg">סוכנות דיגיטל וטכנולוגיה</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-muted-foreground">© 2026 — כל הזכויות שמורות לבניבו</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
