import React, { useState, useEffect } from 'react';
import { courseService, Course, Lesson, Enrollment, LessonProgress } from '../../services/course.service';
import './CoursePlatform.css';

interface CoursePlatformProps {
  userId: string;
}

const CoursePlatform: React.FC<CoursePlatformProps> = ({ userId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-courses' | 'learning' | 'teaching'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [coursesResponse, enrollmentsResponse] = await Promise.all([
        courseService.getAllCourses(),
        courseService.getUserEnrollments(),
      ]);
      
      setCourses(coursesResponse.courses);
      setEnrollments(enrollmentsResponse.enrollments);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseDetails = async (course: Course) => {
    try {
      setSelectedCourse(course);
      const lessonsResponse = await courseService.getCourseLessons(course.id);
      setLessons(lessonsResponse.lessons);
      
      if (activeTab === 'learning') {
        const progressResponse = await courseService.getCourseProgress(course.id);
        setLessonProgress(progressResponse.lessons);
      }
    } catch (error) {
      console.error('Error loading course details:', error);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const enrollment = await courseService.enrollInCourse(courseId);
      setEnrollments([...enrollments, enrollment]);
      
      // Refresh courses to update student count
      const coursesResponse = await courseService.getAllCourses();
      setCourses(coursesResponse.courses);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleLessonSelect = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    
    try {
      const progress = await courseService.getLessonProgress(lesson.id);
      if (progress) {
        setLessonProgress(prev => 
          prev.map(p => p.lessonId === lesson.id ? progress : p)
        );
      }
    } catch (error) {
      console.error('Error loading lesson progress:', error);
    }
  };

  const handleLessonComplete = async (lessonId: string) => {
    try {
      const progress = await courseService.updateLessonProgress(lessonId, {
        isCompleted: true,
      });
      
      setLessonProgress(prev => 
        prev.map(p => p.lessonId === lessonId ? progress : p)
      );
      
      // Update overall course progress
      if (selectedCourse) {
        const progressResponse = await courseService.getCourseProgress(selectedCourse.id);
        setLessonProgress(progressResponse.lessons);
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadInitialData();
      return;
    }

    try {
      const response = await courseService.searchCourses(searchQuery, {
        category: selectedCategory,
        level: selectedLevel,
        priceRange,
      });
      setCourses(response.courses);
    } catch (error) {
      console.error('Error searching courses:', error);
    }
  };

  const handleCreateCourse = async (data: any) => {
    try {
      const newCourse = await courseService.createCourse(data);
      setCourses([...courses, newCourse]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getLessonProgress = (lessonId: string): LessonProgress | undefined => {
    return lessonProgress.find(p => p.lessonId === lessonId);
  };

  const isEnrolled = (courseId: string): boolean => {
    return enrollments.some(e => e.courseId === courseId);
  };

  if (loading) {
    return <div className="course-platform-loading">Loading courses...</div>;
  }

  return (
    <div className="course-platform">
      <div className="platform-header">
        <h1>Course Platform</h1>
        <div className="platform-tabs">
          <button
            className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse Courses
          </button>
          <button
            className={`tab-button ${activeTab === 'my-courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-courses')}
          >
            My Courses
          </button>
          <button
            className={`tab-button ${activeTab === 'learning' ? 'active' : ''}`}
            onClick={() => setActiveTab('learning')}
          >
            Learning
          </button>
          <button
            className={`tab-button ${activeTab === 'teaching' ? 'active' : ''}`}
            onClick={() => setActiveTab('teaching')}
          >
            Teaching
          </button>
        </div>
      </div>

      {activeTab === 'browse' && (
        <div className="browse-tab">
          <div className="search-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
            
            <div className="filters">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-filter"
              >
                <option value="">All Categories</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="photography">Photography</option>
                <option value="music">Music</option>
                <option value="language">Language</option>
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="level-filter"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <div className="price-range">
                <span>Price: ${priceRange[0]} - ${priceRange[1]}</span>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
              </div>
            </div>
          </div>

          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-cover">
                  <img src={course.coverImage} alt={course.title} />
                  <div className="course-level">{course.level}</div>
                </div>
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p className="course-instructor">by {course.instructor.username}</p>
                  <p className="course-description">{course.shortDescription}</p>
                  <div className="course-meta">
                    <span className="duration">{formatDuration(course.duration)}</span>
                    <span className="lessons">{course.totalLessons} lessons</span>
                    <span className="students">{course.totalStudents} students</span>
                    <span className="rating">⭐ {course.rating.toFixed(1)}</span>
                  </div>
                  <div className="course-tags">
                    {course.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="course-price">
                    {course.price === 0 ? (
                      <span className="free">Free</span>
                    ) : (
                      <span className="paid">${course.price} {course.currency}</span>
                    )}
                  </div>
                  <div className="course-actions">
                    <button
                      className="view-details-btn"
                      onClick={() => loadCourseDetails(course)}
                    >
                      View Details
                    </button>
                    {!isEnrolled(course.id) && (
                      <button
                        className="enroll-btn"
                        onClick={() => handleEnroll(course.id)}
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'my-courses' && (
        <div className="my-courses-tab">
          <h2>My Enrolled Courses</h2>
          <div className="enrollments-grid">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="enrollment-card">
                <div className="enrollment-cover">
                  <img src={enrollment.course.coverImage} alt={enrollment.course.title} />
                  <div className="progress-badge">
                    {Math.round(enrollment.progress)}% Complete
                  </div>
                </div>
                <div className="enrollment-info">
                  <h3>{enrollment.course.title}</h3>
                  <p className="instructor">by {enrollment.course.instructor.username}</p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                  <div className="enrollment-meta">
                    <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                    <span>Last accessed: {new Date(enrollment.lastAccessedAt).toLocaleDateString()}</span>
                  </div>
                  <button
                    className="continue-btn"
                    onClick={() => {
                      loadCourseDetails(enrollment.course);
                      setActiveTab('learning');
                    }}
                  >
                    Continue Learning
                  </button>
                  {enrollment.isCompleted && (
                    <button className="certificate-btn">
                      View Certificate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'learning' && selectedCourse && (
        <div className="learning-tab">
          <div className="learning-header">
            <div className="course-info">
              <h2>{selectedCourse.title}</h2>
              <p>by {selectedCourse.instructor.username}</p>
            </div>
            <div className="overall-progress">
              <span>Overall Progress</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${lessonProgress.length > 0 ? 
                    Math.round(lessonProgress.filter(p => p.isCompleted).length / lessonProgress.length * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="learning-content">
            <div className="lessons-sidebar">
              <h3>Course Content</h3>
              <div className="lessons-list">
                {lessons.map((lesson, index) => {
                  const progress = getLessonProgress(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className={`lesson-item ${selectedLesson?.id === lesson.id ? 'active' : ''} ${progress?.isCompleted ? 'completed' : ''}`}
                      onClick={() => handleLessonSelect(lesson)}
                    >
                      <div className="lesson-number">{index + 1}</div>
                      <div className="lesson-info">
                        <h4>{lesson.title}</h4>
                        <span className="lesson-duration">{formatDuration(lesson.duration)}</span>
                      </div>
                      <div className="lesson-status">
                        {progress?.isCompleted ? '✅' : '⭕'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lesson-content">
              {selectedLesson ? (
                <div className="lesson-viewer">
                  <div className="lesson-header">
                    <h3>{selectedLesson.title}</h3>
                    <div className="lesson-actions">
                      {selectedLesson.videoUrl && (
                        <button className="video-btn">📹 Watch Video</button>
                      )}
                      <button
                        className="complete-btn"
                        onClick={() => handleLessonComplete(selectedLesson.id)}
                        disabled={getLessonProgress(selectedLesson.id)?.isCompleted}
                      >
                        {getLessonProgress(selectedLesson.id)?.isCompleted ? '✅ Completed' : 'Mark as Complete'}
                      </button>
                    </div>
                  </div>

                  {selectedLesson.videoUrl && (
                    <div className="video-player">
                      <video
                        src={selectedLesson.videoUrl}
                        controls
                        width="100%"
                        style={{ borderRadius: '8px' }}
                      />
                    </div>
                  )}

                  <div className="lesson-description">
                    <p>{selectedLesson.description}</p>
                  </div>

                  <div className="lesson-content-text">
                    <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                  </div>

                  {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                    <div className="lesson-resources">
                      <h4>Resources</h4>
                      <div className="resources-list">
                        {selectedLesson.resources.map((resource) => (
                          <div key={resource.id} className="resource-item">
                            <span className="resource-type">{resource.type}</span>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                              {resource.title}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedLesson.quiz && (
                    <div className="lesson-quiz">
                      <h4>Quiz</h4>
                      <p>{selectedLesson.quiz.description}</p>
                      <button className="start-quiz-btn">Start Quiz</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-lesson-selected">
                  <p>Select a lesson to start learning</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'teaching' && (
        <div className="teaching-tab">
          <div className="teaching-header">
            <h2>My Courses</h2>
            <button
              className="create-course-btn"
              onClick={() => setShowCreateForm(true)}
            >
              + Create New Course
            </button>
          </div>

          <div className="my-courses-grid">
            {courses
              .filter(course => course.instructor.id === userId)
              .map((course) => (
                <div key={course.id} className="my-course-card">
                  <div className="course-cover">
                    <img src={course.coverImage} alt={course.title} />
                    <div className="course-status">
                      {course.isPublished ? 'Published' : 'Draft'}
                    </div>
                  </div>
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>{course.shortDescription}</p>
                    <div className="course-stats">
                      <span>{course.totalStudents} students</span>
                      <span>⭐ {course.rating.toFixed(1)}</span>
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <div className="course-actions">
                      <button onClick={() => loadCourseDetails(course)}>Edit</button>
                      <button>Analytics</button>
                      <button>Students</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {showCreateForm && (
        <CreateCourseForm
          onSubmit={handleCreateCourse}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

const CreateCourseForm: React.FC<{
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    tags: '',
    level: 'beginner',
    language: 'en',
    price: 0,
    currency: 'USD',
    prerequisites: '',
    learningObjectives: '',
    materials: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      prerequisites: formData.prerequisites.split('\n').map(p => p.trim()).filter(Boolean),
      learningObjectives: formData.learningObjectives.split('\n').map(obj => obj.trim()).filter(Boolean),
      materials: formData.materials.split('\n').map(mat => mat.trim()).filter(Boolean),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <h2>Create New Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief description for course listings"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Full Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="photography">Photography</option>
                <option value="music">Music</option>
                <option value="language">Language</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="javascript, web development, frontend"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label>Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Prerequisites (one per line)</label>
            <textarea
              value={formData.prerequisites}
              onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
              rows={3}
              placeholder="Basic HTML knowledge&#10;Understanding of CSS&#10;JavaScript fundamentals"
            />
          </div>
          
          <div className="form-group">
            <label>Learning Objectives (one per line)</label>
            <textarea
              value={formData.learningObjectives}
              onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
              rows={4}
              placeholder="Build responsive websites&#10;Master modern CSS techniques&#10;Understand JavaScript best practices"
            />
          </div>
          
          <div className="form-group">
            <label>Materials & Resources (one per line)</label>
            <textarea
              value={formData.materials}
              onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
              rows={3}
              placeholder="Code editor (VS Code recommended)&#10;Modern web browser&#10;Computer with internet connection"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit">Create Course</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoursePlatform;