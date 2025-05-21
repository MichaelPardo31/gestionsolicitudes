import React, { useState, useRef } from 'react';
import styles from './Foro.module.css';

const Foro = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Bienvenidos al foro UdeM',
      author: 'Administrador',
      date: '2025-04-11',
      content: 'Este es el espacio para discutir temas académicos y compartir información.',
      image: null,
      comments: [
        {
          id: 1,
          author: 'Estudiante1',
          date: '2025-04-12',
          content: 'Gracias por la bienvenida!',
          image: null
        }
      ]
    }
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newCommentImage, setNewCommentImage] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  const postImageRef = useRef(null);
  const commentImageRef = useRef(null);

  const handleCreatePost = () => {
    if (!newPostTitle || !newPostContent) return;
    
    const post = {
      id: Date.now(),
      title: newPostTitle,
      author: 'Usuario Actual',
      date: new Date().toISOString().split('T')[0],
      content: newPostContent,
      image: newPostImage,
      comments: []
    };
    
    setPosts([post, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostImage(null);
    if (postImageRef.current) {
      postImageRef.current.value = '';
    }
  };

  const handleAddComment = (postId) => {
    if (!newComment && !newCommentImage) return;
    
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
              content: newComment,
              image: newCommentImage
            }
          ]
        };
      }
      return post;
    }));
    
    setNewComment('');
    setNewCommentImage(null);
    setActiveCommentPostId(null);
    if (commentImageRef.current) {
      commentImageRef.current.value = '';
    }
  };

  const handlePostImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPostImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCommentImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewCommentImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const activateCommentForm = (postId) => {
    setActiveCommentPostId(postId);
    setNewComment('');
    setNewCommentImage(null);
    if (commentImageRef.current) {
      commentImageRef.current.value = '';
    }
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
        <div className={styles.imageUploadContainer}>
          <label className={styles.imageUploadLabel}>
            <div className={styles.uploadButtonWrapper}>
              <span className={styles.uploadIcon}>📷</span>
              <span>Adjuntar imagen</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePostImageChange}
              className={styles.imageInput}
              ref={postImageRef}
            />
          </label>
          {newPostImage && (
            <div className={styles.imagePreview}>
              <img src={newPostImage} alt="Vista previa" />
              <button 
                className={styles.removeImageBtn}
                onClick={() => {
                  setNewPostImage(null);
                  if (postImageRef.current) {
                    postImageRef.current.value = '';
                  }
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
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
            {post.image && (
              <div className={styles.postImageContainer}>
                <img 
                  src={post.image} 
                  alt="Imagen adjunta" 
                  className={styles.postImage}
                />
              </div>
            )}

            <div className={styles.commentsSection}>
              <h4 className={styles.commentsTitle}>
                {post.comments.length} {post.comments.length === 1 ? 'comentario' : 'comentarios'}
              </h4>
              
              {post.comments.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                  <p className={styles.commentMeta}>
                    {comment.author} · {comment.date}
                  </p>
                  <p className={styles.commentContent}>{comment.content}</p>
                  {comment.image && (
                    <div className={styles.commentImageContainer}>
                      <img 
                        src={comment.image} 
                        alt="Imagen en comentario" 
                        className={styles.commentImage}
                      />
                    </div>
                  )}
                </div>
              ))}

              {activeCommentPostId === post.id ? (
                <div className={styles.commentFormActive}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario..."
                    className={styles.commentTextarea}
                  />
                  
                  <div className={styles.commentImageUpload}>
                    <label className={styles.commentImageLabel}>
                      <div className={styles.uploadButtonWrapper}>
                        <span className={styles.uploadIcon}>📷</span>
                        <span>Adjuntar imagen</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCommentImageChange}
                        className={styles.imageInput}
                        ref={commentImageRef}
                      />
                    </label>
                    {newCommentImage && (
                      <div className={styles.commentImagePreview}>
                        <img src={newCommentImage} alt="Vista previa" />
                        <button 
                          className={styles.removeImageBtn}
                          onClick={() => {
                            setNewCommentImage(null);
                            if (commentImageRef.current) {
                              commentImageRef.current.value = '';
                            }
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.commentFormActions}>
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComment && !newCommentImage}
                      className={styles.commentButton}
                    >
                      Publicar comentario
                    </button>
                    <button
                      onClick={() => setActiveCommentPostId(null)}
                      className={styles.cancelButton}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => activateCommentForm(post.id)}
                  className={styles.replyButton}
                >
                  Responder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Foro;
