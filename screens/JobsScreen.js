// screens/JobsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getShadowStyle } from '../utils/styles';
import { useTheme } from '../utils/ThemeContext';

const JobsScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchJobs = async (pageNumber = 1, isRefreshing = false) => {
    if (loading && !isRefreshing) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://testapi.getlokalapp.com/common/jobs?page=${pageNumber}`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data?.results && Array.isArray(data.results)) {
        if (isRefreshing) {
          setJobs(data.results);
        } else {
          setJobs(prev => [...prev, ...data.results]);
        }
        setPage(pageNumber + 1);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchJobs(1, true);
  };

  const filteredJobs = jobs.filter(job => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const jobText = `${job.title} ${job.company_name} ${job.primary_details?.Place || ''} ${job.primary_details?.Salary || ''} ${job.primary_details?.Experience || ''}`.toLowerCase();
    return searchTerms.every(term => jobText.includes(term));
  });

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={[styles.jobCard, getShadowStyle(), { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
      activeOpacity={0.7}
    >
      {item.creatives && item.creatives[0] && (
        <Image
          source={{ uri: item.creatives[0].thumb_url }}
          style={styles.companyImage}
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
        {item.whatsapp_no && (
          <Text style={[styles.detail, { color: colors.text }]}>
            📞 {item.whatsapp_no}
          </Text>
        )}
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

      <Text style={[styles.postedDate, { color: colors.secondaryText }]}>
        Posted: {new Date(item.created_on).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border 
      }]}>
        <View style={[styles.searchInputContainer, { 
          backgroundColor: colors.searchBackground 
        }]}>
          <Ionicons 
            name="search" 
            size={20} 
            color={colors.secondaryText} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search jobs..."
            placeholderTextColor={colors.secondaryText}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={colors.secondaryText} 
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <FlatList
        data={filteredJobs}
        renderItem={renderJob}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        onEndReached={() => fetchJobs(page)}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor={colors.text}
          />
        }
        ListFooterComponent={() => 
          loading && !refreshing ? (
            <ActivityIndicator 
              style={styles.loader} 
              size="large" 
              color={colors.primary} 
            />
          ) : null
        }
        ListEmptyComponent={() => 
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                {searchQuery ? 'No matching jobs found' : 'No jobs available'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  jobCard: {
    margin: 10,
    padding: 15,
    borderRadius: 12,
  },
  companyImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 22,
  },
  companyName: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  postedDate: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  loader: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default JobsScreen;