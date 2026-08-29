import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, PlayCircle } from 'lucide-react';

// Componente para videos embebidos
const SocialVideoEmbed = ({ url, platform }) => {
  const getEmbedUrl = () => {
    if (platform === 'youtube') {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (platform === 'tiktok') {
      const videoId = url.split('/video/')[1]?.split('?')[0];
      return `https://www.tiktok.com/embed/${videoId}`;
    }
    if (platform === 'instagram') {
      const videoId = url.split('/p/')[1]?.split('/')[0];
      return `https://www.instagram.com/p/${videoId}/embed`;
    }
    return url;
  };

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-900">
      <iframe
        src={getEmbedUrl()}
        title="Video de red social"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

// Datos mock (luego se obtendrán de DynamoDB)
const MOCK_POSTS = [
  {
    id: '1',
    doctor_name: 'Dr. Roberto Mendoza',
    specialty: 'Cardiología',
    avatar: 'https://ui-avatars.com/api/?name=Roberto+Mendoza&background=0D8ABC&color=fff&size=64',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: '5 consejos para cuidar tu corazón',
    description: 'En este video te explico cómo mantener una salud cardiovascular óptima.',
    likes: 24,
    comments: 8,
    created_at: '2026-08-27T10:30:00Z',
  },
  {
    id: '2',
    doctor_name: 'Dra. Carolina Gómez',
    specialty: 'Pediatría',
    avatar: 'https://ui-avatars.com/api/?name=Carolina+Gomez&background=8B5CF6&color=fff&size=64',
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@usuario/video/123456789',
    title: 'Cómo identificar alergias en niños',
    description: 'Tips rápidos para padres primerizos.',
    likes: 56,
    comments: 12,
    created_at: '2026-08-27T09:15:00Z',
  },
  {
    id: '3',
    doctor_name: 'Dr. Alberto Rojas',
    specialty: 'Neurología',
    avatar: 'https://ui-avatars.com/api/?name=Alberto+Rojas&background=16A34A&color=fff&size=64',
    platform: 'instagram',
    url: 'https://www.instagram.com/p/Cg8xXZ8D4vZ/',
    title: 'Ejercicios para la memoria',
    description: 'Rutina diaria para mantener tu cerebro activo.',
    likes: 32,
    comments: 5,
    created_at: '2026-08-26T18:45:00Z',
  },
];

const FeedPosts = ({ userSub }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoading(false);
    }, 500);
  }, []);

  const handleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    // En producción, actualizar en DynamoDB
  };

  const handleComment = (postId) => {
    alert('Abrir modal de comentarios (próximamente)');
  };

  const handleShare = (postId) => {
    if (navigator.share) {
      navigator.share({
        title: 'Publicación de UBIKFARMA',
        text: 'Mira este video de un médico especialista',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} d`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <p className="text-center text-slate-500 py-8">No hay publicaciones de médicos aún.</p>
      ) : (
        posts.map((post) => {
          const isLiked = likedPosts[post.id] || false;
          const likesCount = isLiked ? post.likes + 1 : post.likes;

          return (
            <div key={post.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
              {/* Cabecera */}
              <div className="p-4 flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.doctor_name}
                  className="w-10 h-10 rounded-full border-2 border-emerald-200"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{post.doctor_name}</h4>
                  <p className="text-xs text-slate-500">{post.specialty}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {formatDate(post.created_at)}
                </span>
              </div>

              {/* Video embebido */}
              <div className="relative">
                <SocialVideoEmbed url={post.url} platform={post.platform} />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <PlayCircle className="w-3 h-3" />
                  {post.platform.toUpperCase()}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-4">
                <h3 className="font-bold text-slate-900">{post.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{post.description}</p>
              </div>

              {/* Acciones */}
              <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 text-sm transition ${
                      isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
                    <span>{likesCount}</span>
                  </button>
                  <button
                    onClick={() => handleComment(post.id)}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-600 transition"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </button>
                </div>
                <button
                  onClick={() => handleShare(post.id)}
                  className="text-sm text-slate-400 hover:text-slate-600 transition"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FeedPosts;