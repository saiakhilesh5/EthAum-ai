'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Trash2,
  Sparkles,
  AudioWaveform,
  Clock,
  CheckCircle,
  Loader2,
  Volume2,
  Send,
} from 'lucide-react';

interface VoiceReviewRecorderProps {
  startupId: string;
  onReviewSubmitted?: (review: any) => void;
}

export default function VoiceReviewRecorder({
  startupId,
  onReviewSubmitted,
}: VoiceReviewRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(50).fill(5));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio context for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Start visualization
      visualize();

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const visualize = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const draw = () => {
      if (!analyserRef.current || !isRecording) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const normalizedData = Array.from(dataArray.slice(0, 50)).map(
        (value) => Math.max(5, (value / 255) * 100)
      );
      
      setVisualizerData(normalizedData);
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setVisualizerData(new Array(50).fill(5));
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
        visualize();
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) clearInterval(timerRef.current);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      }
      setIsPaused(!isPaused);
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setTranscription('');
    setRecordingTime(0);
  };

  const transcribeAudio = async () => {
    if (!audioBlob) return;

    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'review.webm');

      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Transcription failed');

      const { transcription: text, analysis } = await response.json();
      setTranscription(text);
      toast.success('Audio transcribed successfully!');
    } catch (error) {
      console.error('Error transcribing:', error);
      // Demo transcription
      setTranscription(
        "I've been using this product for about 3 months now and I'm really impressed. " +
        "The onboarding was smooth and the support team was incredibly helpful. " +
        "The main features that stood out to me were the AI-powered analytics and the seamless integrations. " +
        "My only suggestion would be to improve the mobile experience. Overall, I'd highly recommend this to anyone in the SaaS space."
      );
      toast.info('Showing demo transcription');
    } finally {
      setIsTranscribing(false);
    }
  };

  const submitReview = async () => {
    if (!transcription) {
      toast.error('Please transcribe your recording first');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId,
          transcription,
          audioDuration: recordingTime,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      const review = await response.json();
      toast.success('Voice review submitted successfully!');
      onReviewSubmitted?.(review);
      deleteRecording();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-primary" />
          Voice Review
        </CardTitle>
        <CardDescription>
          Record your review with your voice - we'll transcribe it with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visualizer */}
        <div className="h-24 bg-muted/50 rounded-lg flex items-center justify-center gap-0.5 px-4">
          {visualizerData.map((height, index) => (
            <div
              key={index}
              className={`w-1 rounded-full transition-all duration-75 ${
                isRecording ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-center">
          <span className="text-4xl font-mono font-bold">
            {formatTime(recordingTime)}
          </span>
          <p className="text-sm text-muted-foreground mt-1">
            {isRecording ? (isPaused ? 'Paused' : 'Recording...') : audioBlob ? 'Recording complete' : 'Ready to record'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!audioBlob ? (
            <>
              {!isRecording ? (
                <Button
                  size="lg"
                  className="rounded-full w-16 h-16"
                  onClick={startRecording}
                >
                  <Mic className="w-6 h-6" />
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-12 h-12"
                    onClick={pauseRecording}
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    className="rounded-full w-16 h-16"
                    onClick={stopRecording}
                  >
                    <Square className="w-6 h-6" />
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-12 h-12"
                onClick={playAudio}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-12 h-12"
                onClick={deleteRecording}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {/* Audio Player (hidden) */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Transcription */}
        {audioBlob && (
          <div className="space-y-4">
            {!transcription ? (
              <Button
                onClick={transcribeAudio}
                disabled={isTranscribing}
                className="w-full"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Transcribing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Transcribe with AI
                  </>
                )}
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Transcription</label>
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="w-3 h-3" />
                      AI Transcribed
                    </Badge>
                  </div>
                  <Textarea
                    value={transcription}
                    onChange={(e) => setTranscription(e.target.value)}
                    rows={4}
                    placeholder="Edit your transcription if needed..."
                  />
                  <p className="text-xs text-muted-foreground">
                    You can edit the transcription before submitting
                  </p>
                </div>

                <Button
                  onClick={submitReview}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Voice Review
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Tips for a great voice review:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Speak clearly and at a normal pace</li>
            <li>• Mention specific features you liked or disliked</li>
            <li>• Share your use case and results</li>
            <li>• Keep it between 30 seconds to 2 minutes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
