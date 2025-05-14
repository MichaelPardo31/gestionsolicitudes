import React, { useState, useRef, useEffect } from 'react';
import { UDEM_INFO } from '../mock/udemData';
import { callOpenAI } from '../services/openaiService';
import { searchUdemInfo, searchLocalData } from '../api/apiService';
import styles from './ChatbotAssistant.module.css';

const ChatbotAssistant = () => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatAreaRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    
    // Agregar mensaje del usuario
    setConversation(prev => [...prev, {
      role: 'user',
      content: query
    }]);

    try {
      // 1. Primero buscar en datos locales
      const localResult = searchLocalData(query, UDEM_INFO);
      
      if (localResult) {
        setConversation(prev => [...prev, formatAssistantMessage(localResult)]);
        setQuery('');
        return;
      }

      // 2. Si no hay resultados locales, buscar en la API
      const apiResult = await searchUdemInfo(query);
      
      if (apiResult.success) {
        if (apiResult.results.length > 0) {
          setConversation(prev => [...prev, formatAssistantMessage(apiResult)]);
        } else {
          // 3. Si no hay resultados en la API, usar IA generativa
          try {
            const aiResponse = await callOpenAI(query, UDEM_INFO);
            setConversation(prev => [...prev, {
              role: 'assistant',
              content: aiResponse.content || 'Lo siento, no pude generar una respuesta adecuada.',
              source: 'AI'
            }]);
          } catch (aiError) {
            console.error('Error con IA:', aiError);
            setConversation(prev => [...prev, {
              role: 'assistant',
              content: 'Lo siento, no pude encontrar información específica sobre tu consulta. ¿Podrías reformular tu pregunta?',
              source: 'Sistema'
            }]);
          }
        }
      } else {
        // Si hay un error en la API pero tenemos datos locales como respaldo
        if (apiResult.fallback) {
          setConversation(prev => [...prev, {
            role: 'assistant',
            content: 'Estoy teniendo problemas para conectarme con el servidor principal. Por favor, intenta con una pregunta más específica o reformula tu consulta.',
            source: 'Sistema'
          }]);
        } else {
          setError(apiResult.error);
        }
      }
      
    } catch (err) {
      console.error('Error:', err);
      setError('Error inesperado al procesar tu solicitud. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  // Función para formatear mensajes del asistente
  const formatAssistantMessage = ({ source, results }) => {
    return {
      role: 'assistant',
      content: results.length > 0 
        ? `🔍 Esto encontré (${source}):\n\n${formatResults(results)}`
        : `No encontré resultados específicos en ${source}. ¿Podrías reformular tu pregunta?`,
      source,
      isSearchResult: results.length > 0
    };
  };

  // Función para formatear resultados
  const formatResults = (results) => {
    return results.map(item => 
      `• **${item.titulo}**\n${item.contenido}${item.url ? `\nMás info: ${item.url}` : ''}`
    ).join('\n\n');
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatbotHeader}>
        <h2 className={styles.chatbotTitle}>Asistente Universidad de Medellín</h2>
        <p className={styles.chatbotSubtitle}>Pregunta sobre programas, fechas y trámites</p>
      </div>
      
      <div className={styles.chatArea} ref={chatAreaRef}>
        {conversation.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{UDEM_INFO.mensajeInicial.saludo}</p>
            <p>Puedo ayudarte con:</p>
            <ul>
              {UDEM_INFO.mensajeInicial.sugerencias.map((sugerencia, index) => (
                <li key={index}>{sugerencia}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            {conversation.map((msg, index) => (
              <div 
                key={index} 
                className={`${styles.messageContainer} ${
                  msg.role === 'user' ? styles.userMessage : styles.assistantMessage
                }`}
              >
                <div 
                  className={`${styles.messageBubble} ${
                    msg.role === 'user' ? styles.userBubble : styles.assistantBubble
                  }`}
                >
                  {msg.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                  {msg.source && (
                    <div className={`${styles.messageSource} ${
                      msg.source === 'Base de datos local' ? styles.localSource : 
                      msg.source === 'Universidad de Medellín API' ? styles.webSource : 
                      msg.source === 'AI' ? styles.aiSource : styles.systemSource
                    }`}>
                      Fuente: {
                        msg.source === 'Base de datos local' ? 'Base de datos local' : 
                        msg.source === 'Universidad de Medellín API' ? 'Sitio web oficial' : 
                        msg.source === 'AI' ? 'IA generativa' : 'Sistema'
                      }
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={styles.loadingIndicator}>
                <div className={styles.loadingBubble}>
                  <div className={styles.loadingDots}>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.inputArea}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: ¿Qué programas ofrece la Universidad de Medellín?"
            className={styles.chatInput}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={styles.submitButton}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
        {error && (
          <div className={styles.errorMessage}>
            <span>⚠️</span> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotAssistant;