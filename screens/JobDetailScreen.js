// screens/JobDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { saveBookmark } from '../utils/db';
import { useTheme } from '../utils/ThemeContext';

const JobDetailScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const [saving, setSaving] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { colors } = useTheme();

  // Function to format the description text
  const formatDescription = (text) => {
    if (!text) return 'No description available';

    try {
      const parsedText = JSON.parse(text);
      if (typeof parsedText === 'object') {
        const blocks = [];
        Object.keys(parsedText).forEach(key => {
          if (parsedText[key]) {
            const cleanText = parsedText[key]
              .replace(/\\n/g, '\n')
              .replace(/\\u/g, 'u')
              .replace(/"/g, '')
              .trim();
            if (cleanText) blocks.push(cleanText);
          }
        });
        return blocks.join('\n\n');
      }
      return text;
    } catch (e) {
      return text
        .replace(/\\n/g, '\n')
        .replace(/\\u/g, 'u')
        .replace(/"/g, '')
        .trim();
    }
  };

  const handleBookmark = async () => {
    if (saving) return;

    setSaving(true);
    try {
      const result = await saveBookmark(job);
      Alert.alert(
        'Success',
        result.message,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      setIsBookmarked(true);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to bookmark job. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { backgroundColor: colors.card }]}>
        {/* Job Image */}
        {job.creatives && job.creatives[0] && (
          <Image
            source={{ uri: job.creatives[0].thumb_url }}
            style={styles.jobImage}
            resizeMode="cover"
          />
        )}

        {/* Job Title */}
        <Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>
        
        {/* Company Name */}
        <Text style={[styles.companyName, { color: colors.secondaryText }]}>
          {job.company_name}
        </Text>

        {/* Primary Details */}
        <View style={[styles.section, { backgroundColor: colors.searchBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📍 Location</Text>
          <Text style={[styles.details, { color: colors.text }]}>
            {job.primary_details?.Place || 'Not specified'}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.searchBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>💰 Salary</Text>
          <Text style={[styles.details, { color: colors.text }]}>
            {job.primary_details?.Salary || 'Not specified'}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.searchBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>👔 Experience</Text>
          <Text style={[styles.details, { color: colors.text }]}>
            {job.primary_details?.Experience || 'Not specified'}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.searchBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🎓 Qualification</Text>
          <Text style={[styles.details, { color: colors.text }]}>
            {job.primary_details?.Qualification || 'Not specified'}
          </Text>
        </View>

        {job.whatsapp_no && (
          <View style={[styles.section, { backgroundColor: colors.searchBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📞 Contact</Text>
            <Text style={[styles.details, { color: colors.text }]}>{job.whatsapp_no}</Text>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: colors.searchBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📝 Description</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {formatDescription(job.content)}
          </Text>
        </View>

        {/* Job Tags */}
        {job.job_tags && job.job_tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {job.job_tags.map((tag, index) => (
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
          style={[
            styles.bookmarkButton,
            isBookmarked && styles.bookmarkedButton
          ]}
          onPress={handleBookmark}
          disabled={saving || isBookmarked}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.bookmarkButtonText}>
              {isBookmarked ? '✓ Job Bookmarked' : '🔖 Bookmark Job'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  jobImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 28,
  },
  companyName: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  details: {
    fontSize: 15,
    lineHeight: 22,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'justify',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bookmarkButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  bookmarkedButton: {
    backgroundColor: '#34C759',
  },
  bookmarkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JobDetailScreen;