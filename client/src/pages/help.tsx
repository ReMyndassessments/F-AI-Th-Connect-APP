import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Book, 
  Upload, 
  Settings, 
  Heart, 
  Phone, 
  Mail, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Highlighter,
  Star,
  Bookmark,
  BookOpen,
  Gamepad2,
  Shuffle,
  Users,
  Volume2,
  RefreshCw,
  Clock,
  Headphones,
  Coffee,
  Zap,
  UserCheck,
  Globe
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import DailyVerseCard from "@/components/daily-verse/daily-verse-card";
import { useLanguage } from "@/contexts/LanguageContext";


export default function Help() {
  const [, setLocation] = useLocation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const { t } = useLanguage();

  // Fetch feature flags to conditionally show TTS section
  const { data: featureFlags } = useQuery({
    queryKey: ['/api/feature-flags/public'],
    retry: false,
  });

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  // Check if TTS features are enabled
  const isTTSEnabled = featureFlags?.flags?.some((flag: any) => 
    (flag.name === 'tts_ai_responses' || flag.name === 'tts_bible_verses') && flag.enabled
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Hero Section - Mobile Optimized */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold faith-gradient-text mb-3 sm:mb-4">{t.help.title}</h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
                {t.help.subtitle}
              </p>
            </div>

            {/* Getting Started - Mobile Optimized */}
            <Card className="mb-4 sm:mb-6 lg:mb-8">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Book className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <span>{t.help.gettingStarted}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">{t.help.startConversation}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{t.help.startConversationDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">{t.help.uploadDocs}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{t.help.uploadDocsDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">{t.help.shareAndSave}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{t.help.shareAndSaveDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm sm:text-base">{t.help.personalizedExp}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{t.help.personalizedExpDesc}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Library Feature */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>{t.help.promptLibrary}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{t.help.promptLibraryDesc}</p>
                
                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{t.help.howToUse}</h4>
                    <ol className="text-xs sm:text-sm text-gray-600 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full mt-0.5 flex-shrink-0">1</span>
                        <span>{t.help.promptStep1}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full mt-0.5 flex-shrink-0">2</span>
                        <span>{t.help.promptStep2}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full mt-0.5 flex-shrink-0">3</span>
                        <span>{t.help.promptStep3}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full mt-0.5 flex-shrink-0">4</span>
                        <span>{t.help.promptStep4}</span>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{t.help.availableCategories}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div className="bg-blue-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-blue-800 block">{t.help.catMinistryLeadership}</span>
                        <p className="text-blue-600 text-xs">{t.help.catMinistryLeadershipDesc}</p>
                      </div>
                      <div className="bg-purple-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-purple-800 block">{t.help.catMens}</span>
                        <p className="text-purple-600 text-xs">{t.help.catMensDesc}</p>
                      </div>
                      <div className="bg-pink-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-pink-800 block">{t.help.catWomens}</span>
                        <p className="text-pink-600 text-xs">{t.help.catWomensDesc}</p>
                      </div>
                      <div className="bg-green-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-green-800 block">{t.help.catMissions}</span>
                        <p className="text-green-600 text-xs">{t.help.catMissionsDesc}</p>
                      </div>
                      <div className="bg-yellow-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-yellow-800 block">{t.help.catChurchPlanting}</span>
                        <p className="text-yellow-600 text-xs">{t.help.catChurchPlantingDesc}</p>
                      </div>
                      <div className="bg-red-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-red-800 block">{t.help.catHealth}</span>
                        <p className="text-red-600 text-xs">{t.help.catHealthDesc}</p>
                      </div>
                      <div className="bg-indigo-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-indigo-800 block">{t.help.catPersonalGrowth}</span>
                        <p className="text-indigo-600 text-xs">{t.help.catPersonalGrowthDesc}</p>
                      </div>
                      <div className="bg-orange-50 p-2 sm:p-3 rounded">
                        <span className="font-medium text-orange-800 block">{t.help.catYouth}</span>
                        <p className="text-orange-600 text-xs">{t.help.catYouthDesc}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-900 mb-2">{t.help.perfectBeginners}</h5>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• {t.help.beginnerTip1}</li>
                    <li>• {t.help.beginnerTip2}</li>
                    <li>• {t.help.beginnerTip3}</li>
                    <li>• {t.help.beginnerTip4}</li>
                    <li>• {t.help.beginnerTip5}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Bible Word Games Feature - Updated with Four Modes */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gamepad2 className="w-5 h-5 text-purple-500" />
                  <span>{t.help.bibleGamesSection}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{t.help.bibleGamesDesc}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">{t.help.fourModes}</h4>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">{t.help.modeIndividual}</span>
                        </div>
                        <p className="text-blue-600 text-xs">{t.help.modeIndividualDesc}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Coffee className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-800">{t.help.modeIcebreaker}</span>
                        </div>
                        <p className="text-green-600 text-xs">{t.help.modeIcebreakerDesc}</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Zap className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-orange-800">{t.help.modeQuickFire}</span>
                        </div>
                        <p className="text-orange-600 text-xs">{t.help.modeQuickFireDesc}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <UserCheck className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-purple-800">{t.help.modeTeamBuilding}</span>
                        </div>
                        <p className="text-purple-600 text-xs">{t.help.modeTeamBuildingDesc}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">{t.help.gameTypesHeading}</h4>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <Shuffle className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{t.help.gameScramble}</span>
                        <span className="text-gray-600">{t.help.gameScrambleDesc}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{t.help.gameFillBlank}</span>
                        <span className="text-gray-600">{t.help.gameFillBlankDesc}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">{t.help.gameCharacter}</span>
                        <span className="text-gray-600">{t.help.gameCharacterDesc}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-amber-600" />
                        <span className="font-medium">{t.help.gameMemory}</span>
                        <span className="text-gray-600">{t.help.gameMemoryDesc}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-gray-800 mb-2">{t.help.enhancedFeaturesHeading}</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• {t.help.enhancedFeat1}</li>
                        <li>• {t.help.enhancedFeat2}</li>
                        <li>• {t.help.enhancedFeat3}</li>
                        <li>• {t.help.enhancedFeat4}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-blue-50 p-3 rounded text-center">
                    <div className="font-semibold text-blue-800">{t.help.easyGames}</div>
                    <div className="text-blue-600">{t.help.easyPoints}</div>
                  </div>
                  <div className="bg-amber-50 p-3 rounded text-center">
                    <div className="font-semibold text-amber-800">{t.help.mediumGames}</div>
                    <div className="text-amber-600">{t.help.mediumPoints}</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded text-center">
                    <div className="font-semibold text-red-800">{t.help.hardGames}</div>
                    <div className="text-red-600">{t.help.hardPoints}</div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-900 mb-2">{t.help.perfectMinistry}</h5>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• {t.help.ministryTip1}</li>
                    <li>• {t.help.ministryTip2}</li>
                    <li>• {t.help.ministryTip3}</li>
                    <li>• {t.help.ministryTip4}</li>
                    <li>• {t.help.ministryTip5}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Premium Text-to-Speech Feature - Only show if TTS is enabled */}
            {isTTSEnabled && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Volume2 className="w-5 h-5 text-green-500" />
                    <span>{t.help.ttsTitle}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">{t.help.ttsDesc}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">{t.help.ttsVoicesHeading}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">Adam</span>
                          <span className="text-gray-600">{t.help.ttsAdamDesc}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-medium">Bella</span>
                          <span className="text-gray-600">{t.help.ttsBellaDesc}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span className="font-medium">Grace</span>
                          <span className="text-gray-600">{t.help.ttsGraceDesc}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{t.help.ttsPoweredBy}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">{t.help.ttsWhereHeading}</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start space-x-2">
                          <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{t.help.ttsWhere1}</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <MessageCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{t.help.ttsWhere2}</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Headphones className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>{t.help.ttsWhere3}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-900 mb-2">{t.help.ttsVoiceFeatHeading}</h5>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• {t.help.ttsVoiceFeat1}</li>
                      <li>• {t.help.ttsVoiceFeat2}</li>
                      <li>• {t.help.ttsVoiceFeat3}</li>
                      <li>• {t.help.ttsVoiceFeat4}</li>
                      <li>• {t.help.ttsVoiceFeat5}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bible Study Highlighting Feature */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Highlighter className="w-5 h-5 text-amber-500" />
                  <span>{t.help.highlighting}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{t.help.highlightingDesc}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">{t.help.highlightHowToUse}</h4>
                    <ol className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">1</span>
                        <span>{t.help.highlightStep1}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">2</span>
                        <span>{t.help.highlightStep2}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">3</span>
                        <span>{t.help.highlightStep3}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">4</span>
                        <span>{t.help.highlightStep4}</span>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">{t.help.highlightCategoriesHeading}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="bg-yellow-200 px-2 py-1 rounded text-xs font-medium">{t.help.hlKeyVerse}</span>
                        <span className="text-gray-600">{t.help.hlKeyVerseDesc}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-blue-600" />
                        <span className="bg-blue-200 px-2 py-1 rounded text-xs font-medium">{t.help.hlPrayerPoint}</span>
                        <span className="text-gray-600">{t.help.hlPrayerPointDesc}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bookmark className="w-4 h-4 text-green-600" />
                        <span className="bg-green-200 px-2 py-1 rounded text-xs font-medium">{t.help.hlStudyNote}</span>
                        <span className="text-gray-600">{t.help.hlStudyNoteDesc}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-orange-600" />
                        <span className="bg-orange-200 px-2 py-1 rounded text-xs font-medium">{t.help.hlActionItem}</span>
                        <span className="text-gray-600">{t.help.hlActionItemDesc}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-purple-600" />
                        <span className="bg-purple-200 px-2 py-1 rounded text-xs font-medium">{t.help.hlDiscussion}</span>
                        <span className="text-gray-600">{t.help.hlDiscussionDesc}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">{t.help.advancedFeaturesHeading}</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• {t.help.advancedFeat1}</li>
                    <li>• {t.help.advancedFeat2}</li>
                    <li>• {t.help.advancedFeat3}</li>
                    <li>• {t.help.advancedFeat4}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Missions Partner Program */}
            <Card className="mb-4 sm:mb-6 lg:mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-teal-500" />
                  <span>{t.help.missionsSection}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{t.help.missionsPartnerDesc}</p>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-teal-50 rounded-xl p-4 text-center">
                    <Globe className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-teal-900 mb-1">{t.help.missionsYourPage}</p>
                    <p className="text-xs text-teal-700">{t.help.missionsYourPageDesc}</p>
                  </div>
                  <div className="bg-rose-50 rounded-xl p-4 text-center">
                    <Heart className="w-6 h-6 text-rose-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-rose-900 mb-1">{t.help.missionsPrayerSupport}</p>
                    <p className="text-xs text-rose-700">{t.help.missionsPrayerSupportDesc}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-blue-900 mb-1">{t.help.missionsGrowTogether}</p>
                    <p className="text-xs text-blue-700">{t.help.missionsGrowTogetherDesc}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-900 mb-2">{t.help.givingTitle}</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• {t.help.givingPoint1}</li>
                    <li>• {t.help.givingPoint2}</li>
                    <li>• {t.help.givingPoint3}</li>
                    <li>• {t.help.givingPoint4}</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setLocation("/missions/register")}
                    className="bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    {t.help.registerMission}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/missions")}
                    className="border-teal-300 text-teal-700 hover:bg-teal-50 flex items-center justify-center gap-2"
                  >
                    {t.help.viewDirectory}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section - Mobile Optimized */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">{t.help.faq}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {(t.help.faqs as { question: string; answer: string; ttsOnly?: boolean }[]).filter(faq => !faq.ttsOnly || isTTSEnabled).map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-3 sm:pb-4 last:pb-0">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="flex justify-between items-center w-full text-left p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <h4 className="font-semibold pr-3 sm:pr-4 text-sm sm:text-base leading-tight">{faq.question}</h4>
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFAQ === index && (
                        <div className="mt-2 sm:mt-3 ml-2 sm:ml-3">
                          <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support - Mobile Optimized */}
            <Card className="mt-4 sm:mt-6 lg:mt-8">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">{t.help.needHelp}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  {t.help.needHelpDesc}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={() => setLocation("/contact")}
                    className="faith-button-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{t.help.contactSupport}</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("mailto:info@f-ai-th-connect.online", "_blank")}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{t.help.emailUs}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Mobile Optimized */}
          <div className="w-full lg:w-80 space-y-4 sm:space-y-6">
            <DailyVerseCard />
            
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">{t.help.quickActions}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button
                  onClick={() => setLocation("/")}
                  className="w-full faith-button-primary justify-center sm:justify-start text-sm sm:text-base py-2 sm:py-3"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t.help.startChat}
                </Button>
                <Button
                  onClick={() => setLocation("/bible-games")}
                  variant="outline"
                  className="w-full justify-center sm:justify-start text-sm sm:text-base py-2 sm:py-3"
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  {t.help.playGames}
                </Button>
                <Button
                  onClick={() => setLocation("/missions")}
                  variant="outline"
                  className="w-full justify-center sm:justify-start text-sm sm:text-base py-2 sm:py-3 border-teal-200 text-teal-700 hover:bg-teal-50"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {t.help.missionsPartners}
                </Button>
                <Button
                  onClick={() => setLocation("/contact")}
                  variant="outline"
                  className="w-full justify-center sm:justify-start text-sm sm:text-base py-2 sm:py-3"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t.help.contactUs}
                </Button>
                <Button
                  onClick={() => setLocation("/support")}
                  variant="outline"
                  className="w-full justify-center sm:justify-start text-sm sm:text-base py-2 sm:py-3"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {t.help.supportMinistry}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}