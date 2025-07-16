import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { supabase } from '../utils/supabase';

export function useSupabaseUpload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Returns: { url, error }
    const uploadImage = async (uri: string, userId: string) => {
        setUploading(true);
        setError(null);
        try {
            const ext = uri.split('.').pop();
            const fileName = `avatar-${userId}-${Date.now()}.${ext}`;
            const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

            // Read file as base64
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Convert base64 to ArrayBuffer
            const arrayBuffer = decode(base64);

            // Upload ArrayBuffer to Supabase
            const { data, error: uploadError } = await supabase.storage
                .from('avatar')
                .upload(fileName, arrayBuffer, {
                    contentType,
                    upsert: true,
                });
            if (uploadError) throw uploadError;

            // Get public URL
            const { data: publicUrlData } = supabase.storage
                .from('avatar')
                .getPublicUrl(data.path);

            setUploading(false);
            return { url: publicUrlData.publicUrl, error: null };
        } catch (err: any) {
            setError(err.message ?? 'Upload failed');
            setUploading(false);
            return { url: null, error: err.message ?? 'Upload failed' };
        }
    };

    return { uploadImage, uploading, error };
}
