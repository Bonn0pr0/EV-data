import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Code,
  Zap,
  Shield,
  Globe,
  Copy,
} from "lucide-react";

// 🔹 Gói API
const apiPlans = [
  {
    name: "Starter",
    price: "Miễn phí",
    requests: "1,000 requests/tháng",
    features: ["Basic EV data", "Rate limiting", "Community support"],
    popular: false,
  },
  {
    name: "Professional",
    price: "$99/tháng",
    requests: "100,000 requests/tháng",
    features: [
      "Advanced analytics",
      "Real-time data",
      "Priority support",
      "Custom endpoints",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Liên hệ",
    requests: "Unlimited requests",
    features: [
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "White-label options",
    ],
    popular: false,
  },
];

// 🔹 Ví dụ code API
const codeExamples = {
  javascript: `// Lấy dữ liệu hiệu suất EV
const response = await fetch('https://api.ev-analytics.com/v1/vehicles/performance', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,

  python: `import requests

# Lấy dữ liệu trạm sạc
url = "https://api.ev-analytics.com/v1/charging-stations"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`,

  curl: `# Lấy dữ liệu thị trường EV
curl -X GET "https://api.ev-analytics.com/v1/market/trends" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
};

// 🔹 Component hiển thị code có copy
const CodeBlock = ({ code }: { code: string }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
      <Button
        size="icon"
        variant="outline"
        className="absolute top-2 right-2"
        onClick={copyToClipboard}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

const API = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Tiêu đề trang */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              API
            </span>{" "}
            & SDK
          </h1>
          <p className="text-muted-foreground text-lg">
            Truy cập dữ liệu xe điện với RESTful API mạnh mẽ và SDK đa ngôn ngữ
          </p>
        </div>

        {/* Tính năng API */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <FeatureCard
            icon={<Zap className="h-12 w-12 text-electric-blue mx-auto mb-4" />}
            title="Lightning Fast"
            desc="Phản hồi dưới 100ms với CDN toàn cầu"
          />
          <FeatureCard
            icon={<Shield className="h-12 w-12 text-electric-green mx-auto mb-4" />}
            title="Secure"
            desc="Bảo mật cấp enterprise với OAuth 2.0"
          />
          <FeatureCard
            icon={<Globe className="h-12 w-12 text-electric-purple mx-auto mb-4" />}
            title="Global"
            desc="Dữ liệu từ 50+ quốc gia trên thế giới"
          />
          <FeatureCard
            icon={<Code className="h-12 w-12 text-electric-yellow mx-auto mb-4" />}
            title="Developer Friendly"
            desc="SDK cho Python, JavaScript, Go, PHP"
          />
        </div>

        {/* Code Example Tabs */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Bắt đầu với API</CardTitle>
            <CardDescription>
              Ví dụ code để tích hợp API vào ứng dụng của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="javascript" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="curl">cURL</TabsTrigger>
              </TabsList>

              <TabsContent
                value="javascript"
                className="mt-4 transition-opacity duration-300 data-[state=inactive]:opacity-0"
              >
                <CodeBlock code={codeExamples.javascript} />
              </TabsContent>
              <TabsContent
                value="python"
                className="mt-4 transition-opacity duration-300 data-[state=inactive]:opacity-0"
              >
                <CodeBlock code={codeExamples.python} />
              </TabsContent>
              <TabsContent
                value="curl"
                className="mt-4 transition-opacity duration-300 data-[state=inactive]:opacity-0"
              >
                <CodeBlock code={codeExamples.curl} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">
            Chọn gói phù hợp với bạn
          </h2>
          <p className="text-muted-foreground mb-8">
            Bắt đầu miễn phí, nâng cấp khi cần thiết
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {apiPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular ? "ring-2 ring-primary" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary border-0 text-white">
                    Phổ biến nhất
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-primary">
                  {plan.price}
                </div>
                <CardDescription>{plan.requests}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm"
                    >
                      <Shield className="h-4 w-4 text-electric-green mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-primary hover:opacity-90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.price === "Liên hệ" ? "Liên Hệ Sales" : "Bắt Đầu"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Sẵn sàng bắt đầu?</h3>
            <p className="text-muted-foreground mb-6">
              Xem tài liệu đầy đủ và bắt đầu tích hợp ngay hôm nay
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                Xem Tài Liệu
              </Button>
              <Button size="lg" variant="outline">
                Tải SDK
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

// 🔹 Component phụ hiển thị thẻ tính năng
const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <Card className="text-center hover:shadow-electric transition-all duration-300 hover:-translate-y-1">
    <CardContent className="p-6">
      {icon}
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </CardContent>
  </Card>
);

export default API;
