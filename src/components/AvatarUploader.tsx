import { useRef, useState } from 'react';
import { useLanguage } from '../lib/language';
import { uploadCurrentUserAvatar } from '../lib/avatars';

export function AvatarUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const { language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const isRussian = language === 'ru';

  const selectFile = async (file?: File) => {
    if (!file) return;
    setIsUploading(true);
    setError('');
    try {
      onUploaded(await uploadCurrentUserAvatar(file));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="avatar-uploader">
      <button
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {isUploading
          ? isRussian ? 'Загружаю…' : 'Uploading…'
          : isRussian ? 'Выбрать из галереи' : 'Choose from gallery'}
      </button>
      <input
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(event) => void selectFile(event.target.files?.[0])}
        ref={inputRef}
        type="file"
      />
      {error && <small className="error">{error}</small>}
    </div>
  );
}
