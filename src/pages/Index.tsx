import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftRight, Copy, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

const Index = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: sourceText,
            source: sourceLang, // Explicitly specify the source language
            target: targetLang,
            format: "text",
          }),
        }
      );

      const data = await response.json();

      console.log("API Response:", data); // Log the response for debugging

      if (data && data.data && data.data.translations) {
        setTranslatedText(data.data.translations[0].translatedText);
        toast({
          title: "Translation completed!",
          description: "Your text has been translated successfully.",
        });
      } else if (data.error) {
        console.error("API Error:", data.error);
        toast({
          title: "Error",
          description: `API Error: ${data.error.message}`,
          variant: "destructive",
        });
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast({
        title: "Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "The text has been copied to your clipboard.",
    });
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center font-sans">
      {/* Modern Glassy Card Layout */}
      <div className="w-full max-w-7xl px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Main Translator Card */}
        <Card className="rounded-3xl shadow-2xl bg-white/20 backdrop-blur-lg border border-white/30 p-10 flex flex-col gap-8">
          <div className="mb-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 drop-shadow-lg mb-2 tracking-tight">Modern Translator</h1>
            <p className="text-lg text-slate-200/80 font-medium">Translate text between languages instantly with a beautiful, modern interface.</p>
          </div>
          {/* Language Selectors */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/3">
              <label className="text-xs font-semibold text-slate-200 mb-1 block">From</label>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="h-12 bg-white/40 border-0 rounded-xl text-base font-semibold text-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-center my-2 md:my-0">
              <Button
                variant="outline"
                size="icon"
                onClick={swapLanguages}
                className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-400 text-white border-0 shadow-lg hover:scale-110 hover:rotate-180 transition-all duration-300"
                aria-label="Swap languages"
              >
                <ArrowLeftRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="w-full md:w-1/3">
              <label className="text-xs font-semibold text-slate-200 mb-1 block">To</label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="h-12 bg-white/40 border-0 rounded-xl text-base font-semibold text-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Text Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Text */}
            <div className="flex flex-col gap-2">
              <Textarea
                placeholder="Enter text to translate..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="min-h-[160px] text-base bg-white/60 border-0 rounded-2xl shadow-inner focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-slate-800 placeholder:text-slate-400"
              />
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>{sourceText.length} characters</span>
                <div className="flex gap-2">
                  {sourceText && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(sourceText, sourceLang)}
                        className="h-8 w-8 p-0 hover:bg-cyan-100/60"
                        aria-label="Speak source text"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(sourceText)}
                        className="h-8 w-8 p-0 hover:bg-cyan-100/60"
                        aria-label="Copy source text"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Translated Text */}
            <div className="flex flex-col gap-2">
              <Textarea
                placeholder="Translation will appear here..."
                value={translatedText}
                readOnly
                className="min-h-[160px] text-base bg-white/30 border-0 rounded-2xl shadow-inner text-slate-800 placeholder:text-slate-400"
              />
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>{translatedText.length} characters</span>
                <div className="flex gap-2">
                  {translatedText && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(translatedText, targetLang)}
                        className="h-8 w-8 p-0 hover:bg-indigo-100/60"
                        aria-label="Speak translated text"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(translatedText)}
                        className="h-8 w-8 p-0 hover:bg-indigo-100/60"
                        aria-label="Copy translated text"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Translate Button */}
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceText.trim()}
              className="px-10 py-3 text-lg bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-500 hover:to-indigo-500 text-white border-0 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 font-bold tracking-wide"
            >
              {isTranslating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Translating...
                </>
              ) : (
                'Translate'
              )}
            </Button>
          </div>
        </Card>
        {/* Right: Features & Info */}
        <div className="flex flex-col gap-8">
          <Card className="rounded-3xl bg-gradient-to-br from-indigo-800/80 to-blue-800/80 border-0 shadow-xl p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-indigo-400 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <ArrowLeftRight className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-1">Instant Translation</h3>
            <p className="text-slate-200/80 text-base">Get accurate translations between multiple languages in seconds.</p>
          </Card>
          <Card className="rounded-3xl bg-gradient-to-br from-cyan-800/80 to-indigo-700/80 border-0 shadow-xl p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <Volume2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-1">Text-to-Speech</h3>
            <p className="text-slate-200/80 text-base">Listen to the pronunciation of translated text.</p>
          </Card>
          <Card className="rounded-3xl bg-gradient-to-br from-blue-800/80 to-cyan-800/80 border-0 shadow-xl p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <Copy className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-1">Easy Copy</h3>
            <p className="text-slate-200/80 text-base">Copy translations to clipboard with one click.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
