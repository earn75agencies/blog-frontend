import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { FiX, FiTag } from 'react-icons/fi';
import noteService, { Note, CreateNoteData } from '../../services/note.service';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface NoteModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  existingNote?: Note;
  highlightedText?: string;
}

const NoteModal = ({ postId, isOpen, onClose, existingNote, highlightedText }: NoteModalProps) => {
  const [content, setContent] = useState(existingNote?.content || '');
  const [type, setType] = useState<Note['type']>(existingNote?.type || 'note');
  const [tags, setTags] = useState<string[]>(existingNote?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [color, setColor] = useState(existingNote?.color || '#FFEB3B');
  const [isPrivate, setIsPrivate] = useState(existingNote?.isPrivate ?? true);

  const queryClient = useQueryClient();

  const createMutation = useMutation(
    (data: CreateNoteData) => noteService.createNote(postId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notes', postId]);
        toast.success('Note created successfully');
        onClose();
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create note');
      },
    }
  );

  const updateMutation = useMutation(
    (data: Partial<CreateNoteData>) => noteService.updateNote(existingNote!._id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notes', postId]);
        toast.success('Note updated successfully');
        onClose();
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update note');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Note content is required');
      return;
    }

    const noteData: CreateNoteData = {
      content,
      type,
      tags,
      color: type === 'highlight' ? color : undefined,
      highlightedText,
      isPrivate,
    };

    if (existingNote) {
      updateMutation.mutate(noteData);
    } else {
      createMutation.mutate(noteData);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {existingNote ? 'Edit Note' : 'Add Note'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Highlighted text preview */}
          {highlightedText && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Highlighted text:</p>
              <p className="text-sm italic">"{highlightedText}"</p>
            </div>
          )}

          {/* Note type */}
          <div>
            <label className="block text-sm font-medium mb-2">Note Type</label>
            <div className="flex gap-2 flex-wrap">
              {(['note', 'highlight', 'annotation', 'bookmark', 'reminder'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    type === t
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker for highlights */}
          {type === 'highlight' && (
            <div>
              <label className="block text-sm font-medium mb-2">Highlight Color</label>
              <div className="flex gap-2">
                {['#FFEB3B', '#FF9800', '#4CAF50', '#2196F3', '#9C27B0'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-lg border-2 ${
                      color === c ? 'border-gray-900 dark:border-white' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Note content */}
          <div>
            <label className="block text-sm font-medium mb-2">Note Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              rows={6}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                <FiTag className="mr-2" />
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary-900 dark:hover:text-primary-100"
                    >
                      <FiX className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Privacy */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <label htmlFor="isPrivate" className="text-sm">
              Private note (only visible to you)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {existingNote ? 'Update Note' : 'Create Note'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NoteModal;



