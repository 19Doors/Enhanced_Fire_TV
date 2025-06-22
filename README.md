# Fire TV Enhanced Experience - Amazon Hackathon 2025

An intelligent Fire TV platform that transforms content discovery through AI-driven cross-platform recommendations, social viewing, and proactive entertainment planning. The system unifies Netflix, Prime Video, and Hotstar into one seamless interface.

## 🚀 Project Overview

Building an Enhanced Fire TV Experience that breaks content silos by providing intelligent recommendations across multiple streaming platforms. Users can discover Prime Video content while watching Netflix, get mood-aware suggestions, and enjoy synchronized social viewing experiences.

### 🎯 Core Innovation

- **Cross-Platform Intelligence**: Breaks content silos by recommending Prime Video content to Netflix users based on viewing patterns
- **Mood-Aware Recommendations**: AI detects emotional state and suggests contextually appropriate content  
- **Temporal Personalization**: Time-of-day and routine-based content suggestions
- **Social Viewing**: Synchronized multi-device viewing with real-time chat

## 🏗️ Architecture

### Frontend Layer
- **Fire TV Frontend**: Next.js with Zustand for state management
- **Static Export**: Optimized for Fire TV deployment
- **Hardware Acceleration**: Smooth TV experience with GSAP animations

### Backend Layer
- **Microservices Architecture**: 4 independent Python FastAPI services
- **API Gateway**: Tyk Open Source for request routing and management
- **Event-Driven Communication**: Apache Kafka for real-time messaging
- **Multi-Database Strategy**: MongoDB, PostgreSQL, Redis, ClickHouse

### Infrastructure
- **Containerization**: Docker for all services
- **Service Discovery**: Docker networking with health checks
- **Scalability**: Independent service scaling

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14
- Zustand (State Management)
- GSAP (Animations)
- Tailwind CSS

**Backend:**
- Python FastAPI
- Tyk API Gateway
- Apache Kafka

**Databases:**
- MongoDB (Content Storage)
- PostgreSQL (User Profiles)
- Redis (Caching)
- ClickHouse (Analytics)

**Infrastructure:**
- Docker & Docker Compose
- Apache Kafka & Zookeeper


## 🔄 Event-Driven Architecture

The system uses Apache Kafka for asynchronous communication between services:

### Key Event Topics
- `user-interactions` - User behavior tracking
- `recommendations-generated` - AI-generated recommendations

### Event Flow Example
```python
# Content Aggregation publishes new content
kafka_producer.send('content-updated', {
    'event_type': 'tmdb_sync_completed',
    'new_content_count': 150,
    'platforms': ['netflix', 'primevideo', 'hotstar']
})

# AI Recommendation Service consumes and updates recommendations
# Social Viewing Service notifies active users
# Analytics Service tracks content popularity
```

## 🎮 Fire TV Frontend Integration

The frontend is optimized for Fire TV remote navigation:

```javascript
const handleContentClick = async (contentItem) => {
  await trackUserInteraction({
    type: 'click',
    contextdata: {
      id: contentItem.id,
      title: contentItem.title,
      platform: contentItem.platform,
      rating: contentItem.rating
    }
  });
  
  // Open content modal with GSAP animations
  setSelectedContent(contentItem);
  setIsModalOpen(true);
};
```

## 🏆 Amazon Hackathon 2025

This project is being developed for Amazon Hackathon 2025, showcasing innovative approaches to content discovery and social viewing experiences on Fire TV platforms.
---

**Built with ❤️ for Amazon Hackathon 2025**
