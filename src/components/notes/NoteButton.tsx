import { useState } from 'react';
import { FiBookmark, FiBookOpen } from 'react-icons/fi';
import { useQuery } from 'react-query';
import noteService from '../../services/note.service';

interface NoteButtonProps {
  postId: string;
  onNotesClick?: () => void;
}

const NoteButton = ({ postId, onNotesClick }: NoteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: notes } = useQuery(
    ['notes', postId],
    () => noteService.getPostNotes(postId),
    { enabled: !!postId }
  );

  const handleClick = () => {
    if (onNotesClick) {
      onNotesClick();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const notesCount = notes?.length || 0;

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title={`${notesCount} note${notesCount !== 1 ? 's' : ''}`}
    >
      {notesCount > 0 ? (
        <FiBookOpen className="text-primary-600 dark:text-primary-400" />
      ) : (
        <FiBookmark className="text-gray-500" />
      )}
      <span className="text-sm font-medium">
        {notesCount > 0 ? `${notesCount} Note${notesCount !== 1 ? 's' : ''}` : 'Add Note'}
      </span>
    </button>
  );
};

export default NoteButton;



