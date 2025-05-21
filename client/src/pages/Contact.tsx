import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã liên hệ!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Liên hệ với chúng tôi</h1>
          <p className="text-gray-600 mb-10 text-center">
            Nếu bạn có bất kỳ câu hỏi nào, hãy gửi tin nhắn cho chúng tôi hoặc sử dụng thông tin bên dưới.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="text-primary mr-3 mt-1" />
                <span>567 Le Duan, Buon Me Thuot, Dak Lak</span>
              </div>
              <div className="flex items-center">
                <Phone className="text-primary mr-3" />
                <a href="tel:+84369567123" className="hover:underline">+84 (369) 567-123</a>
              </div>
              <div className="flex items-center">
                <Mail className="text-primary mr-3" />
                <a href="mailto:info@watchar.com" className="hover:underline">info@watchar.com</a>
              </div>
            </div>
            <form className="bg-white rounded-lg shadow-md p-8 space-y-5" onSubmit={handleSubmit}>
              <Input
                name="name"
                placeholder="Họ và tên"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Textarea
                name="message"
                placeholder="Nội dung liên hệ"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              />
              <Button type="submit" className="w-full">Gửi liên hệ</Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}