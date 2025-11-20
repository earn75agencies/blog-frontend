import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { FiBook, FiSearch, FiFilter, FiTag, FiPin, FiTrash2, FiEdit3 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import noteService, { Note } from '../services/note.service';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

const NotesPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['userNotes', page, selectedType],
    () => noteService.getUserNotes({
      page,
      limit: 20,
      type: selectedType !== 'all' ? selectedType as Note['type'] : undefined,
    }),
    { keepPreviousData: true }
  );

  const deleteMutation = useMutation(
    (noteId: string) => noteService.deleteNote(noteId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userNotes');
        toast.success('Note deleted successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to delete note');
      },
    }
  );

  const togglePinMutation = useMutation(
    (noteId: string) => noteService.togglePin(noteId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userNotes');
      },
    }
  );

  const handleDelete = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate(noteId);
    }
  };

  const handleTogglePin = (noteId: string) => {
    togglePinMutation.mutate(noteId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="primary" />
      </div>
    );
  }

  const notes = data?.notes || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Notes</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {pagination?.total || 0} notes • Your personal annotations and highlights
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="note">Notes</option>
            <option value="highlight">Highlights</option>
            <option value="annotation">Annotations</option>
            <option value="bookmark">Bookmarks</option>
            <option value="reminder">Reminders</option>
          </select>
        </div>
      </div>

      {/* Notes List */}
      {notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note: Note) => (
            <Card key={note._id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {note.isPinned && (
                      <FiPin className="text-primary-600" title="Pinned" />
                    )}
                    <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded">
                      {note.type}
                    </span>
                    {typeof note.post === 'object' && note.post && (
                      <Link
                        to={`/post/${note.post.slug}`}
                        className="text-sm text-primary-600 hover:underline"
                      >
                        {note.post.title}
                      </Link>
                    )}
                  </div>
                  
                  {note.highlightedText && (
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded mb-3 border-l-4 border-yellow-400">
                      <p className="text-sm italic">"{note.highlightedText}"</p>
                    </div>
                  )}
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{note.content}</p>
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs"
                        >
                          <FiTag className="text-xs" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleTogglePin(note._id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title={note.isPinned ? 'Unpin' : 'Pin'}
                  >
                    <FiPin className={note.isPinned ? 'text-primary-600' : 'text-gray-400'} />
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <FiBook className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No notes found</p>
          <p className="text-gray-400 text-sm mt-2">
            Start adding notes to posts you read!
          </p>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotesPage;



