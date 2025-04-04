// screens/BookmarksScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { getBookmarks, removeBookmark } from '../utils/db';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';

const BookmarksScreen = ({ navigation }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { colors } = useTheme();

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const data = await getBookmarks();
      setBookmarks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
    const unsubscribe = navigation.addListener('focus', loadBookmarks);
    return unsubscribe;
  }, [navigation]);

  const handleRemoveBookmark = async (jobId) => {
    Alert.alert(
      'Remove Bookmark',
      'Are you sure you want to remove this bookmark?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeBookmark(jobId);
              loadBookmarks();
            } catch (error) {
              Alert.alert('Error', 'Failed to remove bookmark');
            }
          }
        }
      ]
    );
  };

  const renderBookmark = ({ item }) => (
    <TouchableOpacity
      style={[styles.bookmarkCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
      activeOpacity={0.7}
    >
      {item.creatives && item.creatives[0] && (
        <Image
          source={{ uri: item.creatives[0].thumb_url }}
          style={styles.jobImage}
          resizeMode="cover"
        />
      )}

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {item.title}
      </Text>

      <Text style={[styles.companyName, { color: colors.secondaryText }]}>
        {item.company_name}
      </Text>

      <View style={styles.detailsContainer}>
        <Text style={[styles.detail, { color: colors.text }]}>
          📍 {item.primary_details?.Place || 'Location not specified'}
        </Text>
        <Text style={[styles.detail, { color: colors.text }]}>
          💰 {item.primary_details?.Salary || 'Salary not specified'}
        </Text>
        <Text style={[styles.detail, { color: colors.text }]}>
          👔 {item.primary_details?.Experience || 'Experience not specified'}
        </Text>
      </View>

      {item.job_tags && item.job_tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.job_tags.map((tag, index) => (
            <View 
              key={index}
              style={[styles.tag, { backgroundColor: tag.bg_color }]}
            >
              <Text style={[styles.tagText, { color: tag.text_color }]}>
                {tag.value}
              </Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.removeButton, { borderTopColor: colors.border }]}
        onPress={() => handleRemoveBookmark(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        <Text style={styles.removeButtonText}>Remove Bookmark</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={loadBookmarks}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {bookmarks.length === 0 ? (
        <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
          <Ionicons name="bookmark-outline" size={64} color={colors.secondaryText} />
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            No bookmarks yet
          </Text>
          <Text style={[styles.emptySubText, { color: colors.secondaryText }]}>
            Your bookmarked jobs will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmark}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadBookmarks}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  bookmarkCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginHorizontal: 12,
    lineHeight: 22,
  },
  companyName: {
    fontSize: 14,
    marginTop: 4,
    marginHorizontal: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    padding: 12,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    paddingTop: 0,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  removeButtonText: {
    color: '#FF3B30',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default BookmarksScreen;