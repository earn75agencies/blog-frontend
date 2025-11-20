import { useRef, useEffect } from 'react';
import { FiBold, FiItalic, FiLink, FiImage, FiList, FiCode } from 'react-icons/fi';

interface PostEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const PostEditor: React.FC<PostEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...',
  className = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleSelection = () => {
      // Track selection for future features (formatting, etc.)
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      // Future: Use selected text for formatting operations
      void textarea.value.substring(start, end);
    };

    textarea.addEventListener('mouseup', handleSelection);
    textarea.addEventListener('keyup', handleSelection);

    return () => {
      textarea.removeEventListener('mouseup', handleSelection);
      textarea.removeEventListener('keyup', handleSelection);
    };
  }, []);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: FiBold,
      label: 'Bold',
      action: () => insertText('**', '**'),
    },
    {
      icon: FiItalic,
      label: 'Italic',
      action: () => insertText('*', '*'),
    },
    {
      icon: FiLink,
      label: 'Link',
      action: () => insertText('[', '](url)'),
    },
    {
      icon: FiImage,
      label: 'Image',
      action: () => insertText('![alt](', ')'),
    },
    {
      icon: FiList,
      label: 'List',
      action: () => insertText('- ', ''),
    },
    {
      icon: FiCode,
      label: 'Code',
      action: () => insertText('`', '`'),
    },
  ];

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex gap-2">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title={button.label}
          >
            <button.icon />
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-96 p-4 resize-none focus:outline-none font-mono text-sm"
      />
    </div>
  );
};

export default PostEditor;

