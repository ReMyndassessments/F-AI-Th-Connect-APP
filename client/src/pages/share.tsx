import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Share2, Smartphone, Tablet, Monitor, Plus, Home } from "lucide-react";
import { useLocation } from "wouter";
import QRCode from "qrcode";
import { usePWA } from "@/hooks/use-pwa";
import { useLanguage } from "@/contexts/LanguageContext";


export default function SharePage() {
  const [, setLocation] = useLocation();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const { t } = useLanguage();
  const appUrl = window.location.origin;
  const { isInstallable, isInstalled, installApp, getInstallInstructions } = usePWA();
  const installInstructions = getInstallInstructions();

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(appUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1e40af', // Blue-700
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = 'F-AI-TH-Connect-QR.png';
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const shareUrl = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'F-AI-TH-Connect - Built for D-Groups & Bible Study Communities',
          text: 'Free ministry platform for D-Groups, Bible study communities, and missions outreach. Bringing the Word to the Lost and Unreached.',
          url: appUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(appUrl);
      alert('App URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-sm font-medium mb-6 transition-colors"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t.share.heading}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            {t.share.subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* QR Code Card */}
          <Card className="text-center">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-center space-x-2 text-lg sm:text-xl">
                <Smartphone className="w-5 h-5" />
                <span>{t.share.scanQr}</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {t.share.scanQrDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {qrCodeUrl && (
                <div className="flex justify-center">
                  <div className="p-3 sm:p-4 bg-white rounded-lg shadow-inner border-2 border-gray-100">
                    <img 
                      src={qrCodeUrl} 
                      alt="F-AI-TH-Connect QR Code" 
                      className="w-40 h-40 sm:w-48 sm:h-48 mx-auto"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Button
                  onClick={downloadQRCode}
                  variant="outline"
                  className="w-full h-12 text-base touch-target"
                  disabled={!qrCodeUrl}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t.share.downloadQr}
                </Button>
                
                <p className="text-sm text-gray-500 px-2">
                  {t.share.qrForMaterials}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Share Options Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Share2 className="w-5 h-5" />
                <span>{t.share.shareOptions}</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {t.share.shareOptionsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {isInstallable && (
                <Button
                  onClick={installApp}
                  className="w-full faith-button-primary h-12 text-base touch-target"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t.share.installApp}
                </Button>
              )}
              
              {isInstalled && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium text-center">
                    {t.share.appInstalled}
                  </p>
                </div>
              )}
              
              <Button
                onClick={shareUrl}
                className="w-full h-12 text-base touch-target"
                variant={isInstallable ? "outline" : "default"}
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t.share.shareAppLink}
              </Button>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-center sm:text-left">{t.share.perfectFor}</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg touch-target">
                    <Monitor className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm">{t.share.church}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg touch-target">
                    <Tablet className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span className="text-sm">{t.share.social}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg touch-target">
                    <Smartphone className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{t.share.text}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2 font-medium text-center sm:text-left">{t.share.appUrl}</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <code className="flex-1 p-3 bg-white rounded border text-xs sm:text-sm font-mono break-all">
                    {appUrl}
                  </code>
                  <Button
                    onClick={() => navigator.clipboard.writeText(appUrl)}
                    variant="outline"
                    className="h-12 sm:h-auto touch-target sm:w-auto"
                  >
                    {t.share.copy}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Installation Instructions */}
        <Card className="mt-6 sm:mt-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">{t.share.howToInstall}</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {t.share.howToInstallDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* QR Code Instructions */}
              <div>
                <h4 className="font-semibold mb-4 text-base sm:text-lg text-center lg:text-left">{t.share.viaQr}</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-2 sm:p-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">{t.share.scanStep1}</p>
                  </div>
                  <div className="flex items-start space-x-3 p-2 sm:p-0">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-600 font-bold text-sm">2</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">{t.share.scanStep2}</p>
                  </div>
                  <div className="flex items-start space-x-3 p-2 sm:p-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 font-bold text-sm">3</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">{t.share.scanStep3}</p>
                  </div>
                </div>
              </div>

              {/* Browser-specific Instructions */}
              <div>
                <h4 className="font-semibold mb-4 text-base sm:text-lg text-center lg:text-left">For {installInstructions.platform} Users</h4>
                <div className="space-y-3">
                  {installInstructions.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 sm:p-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg">
              <h5 className="font-semibold text-gray-900 mb-4 text-center sm:text-left">{t.share.benefits}</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 p-2 rounded touch-target">
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-gray-700">{t.share.worksOffline}</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded touch-target">
                  <div className="w-3 h-3 bg-amber-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-gray-700">{t.share.fasterLoading}</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded touch-target">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-gray-700">{t.share.nativeApp}</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded touch-target">
                  <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-gray-700">{t.share.homeScreen}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ministry Focus */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-amber-600 rounded-lg p-6 sm:p-8 text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t.share.expandingKingdom}</h3>
            <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto mb-3 sm:mb-4 px-2">
              {t.share.expandingDesc}
            </p>
            <div className="text-center">
              <p className="text-sm opacity-75 px-2">
                {t.share.offlineNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}