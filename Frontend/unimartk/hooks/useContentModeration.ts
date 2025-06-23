import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ModerationResult {
  is_inappropriate: boolean;
  reason: string;
}

interface ModerationState {
  isModeratingText: boolean;
  isModeratingImages: boolean;
  warnings: string[];
}

// Configuration
const MODERATION_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyAkWbT_GM0CdAb13rMdfU_UcSmFharCOCs",
  textApiUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  imageApiUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
} as const;

// Utility functions
const getBase64ImageFromFile = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1];
        resolve({ base64Data: base64String, mimeType: file.type });
      } else {
        reject(new Error('Failed to read file as base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const createModerationPayload = (prompt: string, imageData?: { base64Data: string; mimeType: string }) => {
  const parts: any[] = [{ text: prompt }];
  
  if (imageData) {
    parts.push({
      inlineData: {
        mimeType: imageData.mimeType,
        data: imageData.base64Data
      }
    });
  }

  return {
    contents: [{ role: "user", parts }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          "is_inappropriate": { "type": "BOOLEAN" },
          "reason": { "type": "STRING" }
        },
        "propertyOrdering": ["is_inappropriate", "reason"]
      }
    }
  };
};

const makeAPIRequest = async (url: string, payload: any): Promise<ModerationResult> => {
  const response = await fetch(`${url}?key=${MODERATION_CONFIG.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const result = await response.json();
  
  if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
    try {
      return JSON.parse(result.candidates[0].content.parts[0].text);
    } catch (jsonError) {
      console.error("Failed to parse JSON from AI response:", jsonError);
      return { 
        is_inappropriate: true, 
        reason: `Invalid AI response format. Raw: ${result.candidates[0].content.parts[0].text.substring(0, 100)}...` 
      };
    }
  } else {
    return { is_inappropriate: true, reason: 'No moderation result from API.' };
  }
};

// Custom hook for text moderation
export const useTextModeration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const moderateText = useCallback(async (textContent: string): Promise<ModerationResult> => {
    if (!textContent.trim()) {
      return { is_inappropriate: false, reason: "None" };
    }

    setIsLoading(true);
    
    try {
      const prompt = `
        You are a content moderation expert for an online marketplace.
        Your task is to analyze the following text and determine if it violates our community guidelines.
        The guidelines prohibit:
        - Hate speech
        - Harassment
        - Sexually explicit content
        - The sale of illegal or dangerous items (e.g., weapons, drugs)
        - Spam or fraudulent content
        - Content promoting violence or self-harm

        Please analyze the following text and provide a concise reason if it's inappropriate.
        ---
        ${textContent}
        ---

        Respond strictly in a JSON format with two keys:
        1. "is_inappropriate": a boolean value (true or false).
        2. "reason": a brief explanation if the content is inappropriate, and a list of the violated categories (e.g., "Hate speech, Harassment"). If not inappropriate, the reason should be "None".
      `;

      const payload = createModerationPayload(prompt);
      return await makeAPIRequest(MODERATION_CONFIG.textApiUrl, payload);
      
    } catch (error) {
      console.error("Error during text moderation:", error);
      throw new Error(`Failed to moderate text: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { moderateText, isLoading };
};

// Custom hook for image moderation
export const useImageModeration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const moderateImage = useCallback(async (file: File): Promise<ModerationResult> => {
    setIsLoading(true);
    
    try {
      const { base64Data, mimeType } = await getBase64ImageFromFile(file);

      const prompt = `
        You are an expert image content moderator for an online marketplace.
        Analyze the provided image for any content that violates our policies, which include:
        - Nudity or sexually suggestive content
        - Graphic violence
        - Hate symbols
        - Depictions of illegal items (firearms, drugs, weapons, illegal substances, counterfeits)
        - Content that promotes self-harm or terrorism
        - Spam or fraudulent imagery.

        Respond strictly in a JSON format with two keys:
        1. "is_inappropriate": a boolean value (true or false).
        2. "reason": a brief explanation of why the image is inappropriate, specifying the violated category (e.g., "Sexually explicit content, Depiction of illegal items"). If appropriate, the reason should be "None".
      `;

      const payload = createModerationPayload(prompt, { base64Data, mimeType });
      return await makeAPIRequest(MODERATION_CONFIG.imageApiUrl, payload);
      
    } catch (error) {
      console.error("Error during image moderation:", error);
      throw new Error(`Failed to moderate image: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { moderateImage, isLoading };
};

// Main content moderation hook that combines text and image moderation
export const useContentModeration = () => {
  const [state, setState] = useState<ModerationState>({
    isModeratingText: false,
    isModeratingImages: false,
    warnings: []
  });

  const { moderateText, isLoading: textLoading } = useTextModeration();
  const { moderateImage, isLoading: imageLoading } = useImageModeration();

  // Update loading states
  useState(() => {
    setState(prev => ({
      ...prev,
      isModeratingText: textLoading,
      isModeratingImages: imageLoading
    }));
  });

  const addWarning = useCallback((warning: string) => {
    setState(prev => ({
      ...prev,
      warnings: [...prev.warnings, warning]
    }));
  }, []);

  const clearWarnings = useCallback(() => {
    setState(prev => ({
      ...prev,
      warnings: []
    }));
  }, []);

  const removeImageWarnings = useCallback(() => {
    setState(prev => ({
      ...prev,
      warnings: prev.warnings.filter(warning => !warning.includes('Image "'))
    }));
  }, []);

  // Moderate multiple images
  const moderateImages = useCallback(async (files: File[]): Promise<File[]> => {
    setState(prev => ({ ...prev, isModeratingImages: true }));
    
    const validFiles: File[] = [];
    const warnings: string[] = [];

    try {
      for (const file of files) {
        try {
          const result = await moderateImage(file);

          if (result.is_inappropriate) {
            warnings.push(`Image "${file.name}" contains inappropriate content: ${result.reason}`);
            toast.error(`Image "${file.name}" was rejected due to inappropriate content.`);
          } else {
            validFiles.push(file);
          }
        } catch (error) {
          console.error(`Error moderating image ${file.name}:`, error);
          warnings.push(`Failed to moderate image "${file.name}". Please try again.`);
        }
      }

      if (warnings.length > 0) {
        setState(prev => ({
          ...prev,
          warnings: [...prev.warnings, ...warnings]
        }));
      }

      return validFiles;
    } finally {
      setState(prev => ({ ...prev, isModeratingImages: false }));
    }
  }, [moderateImage]);

  // Moderate text content (name, description, features)
  const moderateTextContent = useCallback(async (data: {
    name?: string;
    description?: string;
    keyFeatures?: string;
  }): Promise<boolean> => {
    setState(prev => ({ ...prev, isModeratingText: true }));
    
    const warnings: string[] = [];
    let hasInappropriateContent = false;

    try {
      // Moderate product name
      if (data.name) {
        const nameResult = await moderateText(data.name);
        if (nameResult.is_inappropriate) {
          warnings.push(`Product name contains inappropriate content: ${nameResult.reason}`);
          hasInappropriateContent = true;
        }
      }

      // Moderate description
      if (data.description) {
        const descResult = await moderateText(data.description);
        if (descResult.is_inappropriate) {
          warnings.push(`Product description contains inappropriate content: ${descResult.reason}`);
          hasInappropriateContent = true;
        }
      }

      // Moderate key features
      if (data.keyFeatures) {
        const featuresResult = await moderateText(data.keyFeatures);
        if (featuresResult.is_inappropriate) {
          warnings.push(`Key features contain inappropriate content: ${featuresResult.reason}`);
          hasInappropriateContent = true;
        }
      }

      if (warnings.length > 0) {
        setState(prev => ({
          ...prev,
          warnings: [...prev.warnings, ...warnings]
        }));
      }

      return !hasInappropriateContent;
    } catch (error) {
      console.error("Error during content moderation:", error);
      setState(prev => ({
        ...prev,
        warnings: [...prev.warnings, "Failed to moderate content. Please try again."]
      }));
      return false;
    } finally {
      setState(prev => ({ ...prev, isModeratingText: false }));
    }
  }, [moderateText]);

  return {
    // State
    isModeratingText: state.isModeratingText,
    isModeratingImages: state.isModeratingImages,
    warnings: state.warnings,
    
    // Actions
    moderateText,
    moderateImage,
    moderateImages,
    moderateTextContent,
    addWarning,
    clearWarnings,
    removeImageWarnings,
    
    // Computed
    isModeratingAny: state.isModeratingText || state.isModeratingImages,
  };
};