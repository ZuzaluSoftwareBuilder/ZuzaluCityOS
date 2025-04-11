import { Box, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import TopicChip from './TopicChip';

interface TopicListProps {
  selectedTopics: string[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
}

const TopicList = ({ selectedTopics, setSelectedTopics }: TopicListProps) => {
  const topicsRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const topics = [
    'Announcements',
    'Question',
    'Meetup',
    'Event',
    'Community information',
    'Coding',
    'Logistics',
    'Q&A',
    'Workshop',
    'Afterparty',
    'Other',
  ];

  const handleTopicClick = (topic: string) => {
    setSelectedTopics((prevTopics) => {
      if (prevTopics.includes(topic)) {
        return prevTopics.filter((t) => t !== topic);
      } else {
        return [...prevTopics, topic];
      }
    });
  };

  const handleTopicsMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (topicsRef.current?.offsetLeft || 0));
    setScrollLeft(topicsRef.current?.scrollLeft || 0);
  };

  const handleTopicsMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTopicsMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (topicsRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (topicsRef.current) {
      topicsRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <Stack
      spacing="10px"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        backgroundColor: '#34343499',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        padding: '8px 16px',
      }}
    >
      <Typography variant="body2">Topics</Typography>
      <Box
        ref={topicsRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onMouseDown={handleTopicsMouseDown}
        onMouseLeave={handleTopicsMouseLeave}
        onMouseUp={handleTopicsMouseLeave}
        onMouseMove={handleTopicsMouseMove}
      >
        {topics.map((topic) => (
          <Box key={topic} sx={{ mr: 1 }}>
            <TopicChip
              label={topic}
              onClick={() => handleTopicClick(topic)}
              selected={selectedTopics.includes(topic)}
            />
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export default TopicList;
