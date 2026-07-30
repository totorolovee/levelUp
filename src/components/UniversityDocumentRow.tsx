import { useState } from 'react';
import type { UniversityDocumentAnalysis } from '../lib/universityDocumentAnalysis';
import type { UniversityDocumentProgress } from '../lib/universityDocuments';
import {
  deleteUniversityDocumentFile,
  getUniversityDocumentUrl,
  uploadUniversityDocument,
} from '../lib/universityDocumentFiles';
import { DocumentAiReview } from './DocumentAiReview';
import { FriendlyDatePicker } from './FriendlyDatePicker';

type Props = {
  analysis?: UniversityDocumentAnalysis;
  isRussian: boolean;
  progress: UniversityDocumentProgress;
  title: string;
  universityId: string;
  onUpdate: (patch: Partial<UniversityDocumentProgress>) => Promise<void>;
};

export function UniversityDocumentRow({
  analysis,
  isRussian,
  progress,
  title,
  universityId,
  onUpdate,
}: Props) {
  const [fileStatus, setFileStatus] = useState<'ready' | 'uploading' | 'error'>('ready');
  const savePatch = (patch: Partial<UniversityDocumentProgress>) => {
    void onUpdate(patch).catch(() => setFileStatus('error'));
  };

  const upload = async (file: File) => {
    setFileStatus('uploading');
    let path = '';
    try {
      path = await uploadUniversityDocument(universityId, progress.documentKey, file);
      await onUpdate({ filePath: path, fileName: file.name });
      if (progress.filePath) await deleteUniversityDocumentFile(progress.filePath);
      setFileStatus('ready');
    } catch {
      if (path) await deleteUniversityDocumentFile(path).catch(() => undefined);
      setFileStatus('error');
    }
  };

  const openFile = async () => {
    const popup = window.open('', '_blank');
    try {
      const url = await getUniversityDocumentUrl(progress.filePath);
      if (popup) popup.location.href = url;
    } catch {
      popup?.close();
      setFileStatus('error');
    }
  };

  const removeFile = async () => {
    try {
      await onUpdate({ filePath: '', fileName: '' });
      await deleteUniversityDocumentFile(progress.filePath);
    } catch {
      setFileStatus('error');
    }
  };

  return (
    <article className={progress.completed ? 'completed' : ''}>
      <label className="document-check">
        <input checked={progress.completed} onChange={(event) => savePatch({ completed: event.target.checked })} type="checkbox" />
        <strong>{title}</strong>
      </label>
      <FriendlyDatePicker
        ariaLabel={isRussian ? 'Дедлайн документа' : 'Document deadline'}
        onChange={(dueDate) => savePatch({ dueDate })}
        value={progress.dueDate}
      />
      <textarea
        defaultValue={progress.notes}
        maxLength={1000}
        onBlur={(event) => savePatch({ notes: event.target.value.trim() })}
        placeholder={isRussian ? 'Заметка или ссылка…' : 'Note or link…'}
        rows={2}
      />
      <div className="document-file">
        {progress.filePath ? (
          <>
            <button onClick={openFile} type="button">📎 {progress.fileName}</button>
            <button aria-label={isRussian ? 'Удалить файл' : 'Delete file'} onClick={removeFile} type="button">×</button>
          </>
        ) : (
          <label>
            <input
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              disabled={fileStatus === 'uploading'}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
              type="file"
            />
            {fileStatus === 'uploading'
              ? (isRussian ? 'Загружаю…' : 'Uploading…')
              : (isRussian ? 'Загрузить документ' : 'Upload document')}
          </label>
        )}
        {fileStatus === 'error' && <small>{isRussian ? 'Не удалось обработать файл.' : 'Could not process the file.'}</small>}
      </div>
      {analysis && <DocumentAiReview analysis={analysis} isRussian={isRussian} />}
    </article>
  );
}
