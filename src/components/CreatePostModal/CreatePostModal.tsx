import { useState } from 'react';
import styles from './CreatePostModal.module.css'; 
import { useAuth } from '../../context/AuthContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AVAILABLE_TAGS = [
  "💻 Programming", "🌐 Web Dev", "⚛️ React", "🟣 .NET", "📐 Math", 
  "🎓 Education", "🚀 Startups", "💼 Business", "🎨 Design",
  "💪 Fitness", "✈️ Travel", "🎮 Gaming", "🎵 Music"
];

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const { token } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pic, setPic] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Стан для перевірки, чи картинка в прев'ю валідна
  const [isPreviewError, setIsPreviewError] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPic(e.target.value);
    setIsPreviewError(false); // Скидаємо помилку при зміні посилання
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const postBody = {
      name,
      description,
      // Якщо pic порожній, ставимо дефолтний емодзі, наприклад "📝"
      pic: pic || "📝",
      tags: selectedTags,
      likeCount: 0
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify([postBody])
      });

      if (response.ok) {
        onClose();
        setName('');
        setDescription('');
        setPic('');
        setSelectedTags([]);
        if (onSuccess) onSuccess();
      } else {
        const data = await response.json();
        alert(typeof data === 'string' ? data : "Помилка при створенні");
      }
    } catch (error) {
      console.error(error);
      alert("Помилка з'єднання");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Хедер модалки */}
        <div className={styles.header}>
          <h2 className={styles.title}>Новий пост ✨</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.scrollableContent}>
          <form onSubmit={handleSubmit} className={styles.form}>

            {/* Секція Заголовку */}
            <div className={styles.inputGroup}>
              <label>Заголовок</label>
              <input
                type="text"
                placeholder="Що цікавого?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                autoFocus
                required
              />
            </div>

            {/* Секція Опису */}
            <div className={styles.inputGroup}>
              <label>Опис</label>
              <textarea
                placeholder="Розкажи детальніше..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${styles.input} ${styles.textArea}`}
                required
              />
            </div>

            {/* Секція Картинки з Прев'ю */}
            <div className={styles.inputGroup}>
              <label>Картинка (URL)</label>
              <div className={styles.urlInputContainer}>
                <span className={styles.icon}>🔗</span>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={pic}
                  onChange={handlePicChange}
                  className={styles.inputWithIcon}
                  required
                />
              </div>

              {/* Блок попереднього перегляду */}
              {pic && !isPreviewError && (
                <div className={styles.previewContainer}>
                  <img
                    src={pic}
                    alt="Preview"
                    className={styles.previewImage}
                    onError={() => setIsPreviewError(true)}
                  />
                  <div className={styles.previewBadge}>Preview</div>
                </div>
              )}
            </div>

            {/* Секція Тегів */}
            <div className={styles.inputGroup}>
              <label>Теги</label>
              <div className={styles.tagsContainer}>
                {AVAILABLE_TAGS.map(tagName => {
                  const isActive = selectedTags.includes(tagName);
                  return (
                    <span
                      key={tagName}
                      onClick={() => toggleTag(tagName)}
                      className={`${styles.tagChip} ${isActive ? styles.tagChipActive : ''}`}
                    >
                      {tagName}
                    </span>
                  );
                })}
              </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Публікуємо..." : "Опублікувати"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}