import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Info, Phone, Layers } from "lucide-react";

interface Section {
  id: number;
  websiteIdeaId: number;
  title: string;
  type: string;
  description: string;
  features: string[];
  createdAt: string;
}

interface SectionCardProps {
  section: Section;
  index: number;
}

export function SectionCard({ section, index }: SectionCardProps) {
  const getSectionIcon = (type: string) => {
    if (type.includes("Hero") || type.includes("Landing")) return Layers;
    if (type.includes("Contact")) return Phone;
    return Info;
  };

  const getSectionIconColor = (index: number) => {
    const colors = [
      "bg-blue-50 text-blue-500",
      "bg-green-50 text-green-500", 
      "bg-purple-50 text-purple-500"
    ];
    return colors[index % colors.length];
  };

  const IconComponent = getSectionIcon(section.type);
  const iconColorClass = getSectionIconColor(index);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColorClass}`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-slate-900">{section.title}</h4>
              <p className="text-sm text-slate-500">{section.type}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Generated
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <p className="text-slate-700 leading-relaxed mb-4">{section.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {section.features.map((feature, idx) => (
            <Badge key={idx} variant="outline" className="bg-slate-100 text-slate-700">
              <Check className="h-3 w-3 mr-1.5 text-green-500" />
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}