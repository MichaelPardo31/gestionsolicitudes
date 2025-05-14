import React, { useState } from 'react';
import styles from './Foro.module.css';

const Foro = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Bienvenidos al foro UdeM',
      author: 'Administrador',
      date: '2025-04-11',
      content: 'Este es el espacio para discutir temas académicos y compartir información.',
      comments: [
        {
          id: 1,
          author: 'Estudiante1',
          date: '2025-04-12',
          content: 'Gracias por la bienvenida!'
        }
      ]
    }
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleCreatePost = () => {
    if (!newPostTitle || !newPostContent) return;
    
    const post = {
      id: Date.now(),
      title: newPostTitle,
      author: 'Usuario Actual',
      date: new Date().toISOString().split('T')[0],
      content: newPostContent,
      comments: []
    };
    
    setPosts([post, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handleAddComment = (postId) => {
    if (!newComment) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              author: 'Usuario Actual',
              date: new Date().toISOString().split('T')[0],
              content: newComment
            }
          ]
        };
      }
      return post;
    }));
    
    setNewComment('');
  };

  return (
    <div className={styles.foroContainer}>
      <div className={styles.foroHeader}>
        <h2 className={styles.foroTitle}>Foro Académico</h2>
        <p className={styles.foroSubtitle}>Comparte y discute temas relevantes</p>
      </div>

      <div className={styles.newPostSection}>
        <h3 className={styles.sectionTitle}>Crear nueva publicación</h3>
        <input
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          placeholder="Título de la publicación"
          className={styles.inputField}
        />
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Contenido de la publicación"
          className={`${styles.inputField} ${styles.textareaField}`}
        />
        <button
          onClick={handleCreatePost}
          disabled={!newPostTitle || !newPostContent}
          className={styles.submitButton}
        >
          Publicar
        </button>
      </div>

      <div className={styles.postsList}>
        {posts.map((post) => (
          <div key={post.id} className={styles.postItem}>
            <div className={styles.postHeader}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postMeta}>
                Por {post.author} el {post.date}
              </p>
            </div>
            <p className={styles.postContent}>{post.content}</p>

            <div className={styles.commentsSection}>
              {post.comments.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                  <p className={styles.commentMeta}>
                    {comment.author} · {comment.date}
                  </p>
                  <p className={styles.commentContent}>{comment.content}</p>
                </div>
              ))}

              <div className={styles.commentForm}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Añadir un comentario..."
                  className={styles.commentInput}
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  disabled={!newComment}
                  className={styles.commentButton}
                >
                  Comentar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Foro;