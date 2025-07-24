import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWebsiteIdeaSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { ApiService, GenerateResponse } from "@/services/apiService";
import { SectionCard } from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wand2, 
  Lightbulb, 
  Clock, 
  Database, 
  Download, 
  Plus,
  Loader2,
  TriangleAlert,
  Info
} from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [currentSections, setCurrentSections] = useState<GenerateResponse["sections"]>([]);
  const [currentIdea, setCurrentIdea] = useState<GenerateResponse["websiteIdea"] | null>(null);

  const form = useForm({
    resolver: zodResolver(insertWebsiteIdeaSchema),
    defaultValues: {
      idea: "",
    },
  });

  const generateMutation = useMutation({
    mutationFn: ApiService.generateSections,
    onSuccess: ({ websiteIdea, sections }) => {
      setCurrentSections(sections);
      setCurrentIdea(websiteIdea);
      toast({
        title: "Sections Generated Successfully",
        description: `Generated ${sections.length} sections and stored in MongoDB.`,
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate sections. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: { idea: string }) => {
    generateMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wand2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">Website Idea Generator</h1>
            </div>
            <div className="text-sm text-slate-500">
              Built with React & Express
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Website Idea Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Generate Website Sections</h2>
              <p className="text-slate-600">Enter your website idea and we'll generate relevant sections for you.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="idea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Website Idea <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="e.g., Landing page for bakery, Portfolio for photographer, E-commerce for handmade jewelry"
                            className="pr-10"
                            {...field}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Lightbulb className="h-4 w-4 text-slate-400" />
                          </div>
                        </div>
                      </FormControl>
                      <p className="text-xs text-slate-500">Be specific about your business or project type for better results.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {generateMutation.isError && (
                  <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertDescription>
                      {generateMutation.error?.message || "Failed to generate sections. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-slate-500 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Generates 3 contextual sections
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={generateMutation.isPending}
                    className="flex items-center space-x-2"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        <span>Generate Sections</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Generated Sections Preview */}
        {currentSections.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Generated Sections</h3>
              <div className="text-sm text-slate-500 flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Generated just now</span>
              </div>
            </div>

            {currentSections.map((section, index) => (
              <SectionCard 
                key={section.id} 
                section={section} 
                index={index} 
              />
            ))}

            {/* Actions Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-slate-600 flex items-center">
                      <Database className="h-4 w-4 mr-1" />
                      <span>{currentSections.length} sections stored in MongoDB</span>
                    </div>
                    <div className="text-sm text-slate-600 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Last updated: just now</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button onClick={() => form.reset()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate New
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {currentSections.length === 0 && !generateMutation.isPending && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No sections generated yet</h3>
            <p className="text-slate-600 mb-6">Enter a website idea above to generate your first set of sections.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div>© 2024 Website Idea Generator. Built for demonstration.</div>
            <div className="flex items-center space-x-4">
              <span>React + Express + MongoDB</span>
              <span>•</span>
              <span>Production Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
