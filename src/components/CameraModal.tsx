import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, X, RefreshCw, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  facingMode?: 'user' | 'environment';
  title?: string;
}

export const CameraModal = ({ 
  isOpen, 
  onClose, 
  onCapture, 
  facingMode = 'user',
  title = "Capturar Foto"
}: CameraModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>(facingMode);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { toast } = useToast();

  const startCamera = async (facing: 'user' | 'environment') => {
    try {
      setIsLoading(true);
      setIsCameraReady(false);

      // Parar stream anterior se existir
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Solicitar acesso à câmera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Aguardar o vídeo estar pronto
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setIsCameraReady(true);
            setIsLoading(false);
          }).catch((error) => {
            console.error("Erro ao iniciar vídeo:", error);
            toast({
              title: "Erro ao iniciar câmera",
              description: "Não foi possível iniciar o preview da câmera.",
              variant: "destructive",
            });
            setIsLoading(false);
          });
        };
      }
    } catch (error: any) {
      console.error("Erro ao acessar câmera:", error);
      setIsLoading(false);
      toast({
        title: "Erro ao acessar câmera",
        description: error.message || "Verifique se você deu permissão para usar a câmera.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraReady) {
      toast({
        title: "Câmera não está pronta",
        description: "Aguarde a câmera inicializar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Configurar canvas com as dimensões do vídeo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Desenhar frame atual do vídeo no canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Não foi possível obter contexto do canvas");
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Converter canvas para blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File(
            [blob], 
            `foto-${Date.now()}.jpg`, 
            { type: 'image/jpeg' }
          );
          
          // Parar câmera
          stopCamera();
          
          // Enviar foto capturada
          onCapture(file);
          
          // Fechar modal
          onClose();
          
          toast({
            title: "Foto capturada!",
            description: "Foto adicionada com sucesso.",
          });
        } else {
          throw new Error("Erro ao converter imagem");
        }
      }, 'image/jpeg', 0.95);

    } catch (error: any) {
      console.error("Erro ao capturar foto:", error);
      toast({
        title: "Erro ao capturar foto",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSwitchCamera = () => {
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    setCurrentFacingMode(newFacingMode);
    startCamera(newFacingMode);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(currentFacingMode);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="relative bg-black aspect-video flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Iniciando câmera...</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          <canvas ref={canvasRef} className="hidden" />

          {/* Controles sobre o vídeo */}
          {isCameraReady && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-center gap-4">
                {/* Botão de trocar câmera */}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 border-white/50"
                  onClick={handleSwitchCamera}
                >
                  <RefreshCw className="h-5 w-5 text-white" />
                </Button>

                {/* Botão de captura */}
                <Button
                  type="button"
                  size="icon"
                  className="h-16 w-16 rounded-full bg-white hover:bg-white/90"
                  onClick={handleCapture}
                >
                  <Circle className="h-12 w-12 text-red-500 fill-red-500" />
                </Button>

                {/* Botão de fechar */}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 border-white/50"
                  onClick={handleClose}
                >
                  <X className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {!isCameraReady && !isLoading && (
          <div className="p-6 text-center text-muted-foreground">
            <p>Aguardando permissão da câmera...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
